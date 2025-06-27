import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, FilterQuery } from "mongoose";
import { Ingredient } from "./entity/ingredient.entity";
import { CreateIngredientDto } from "./dto/create-ingredient.dto";
import { UpdateIngredientDto } from "./dto/update-ingredient.dto";
import { PatchIngredientDto } from "./dto/patch-ingredient.dto";
import { IngredientNotFoundException, DuplicateIngredientException, IngredientValidationException } from "./exceptions/ingredient.exceptions";
import { IngredientCategory } from "./enums/ingredient.enum";
import { Result, ok, err } from "neverthrow";

export interface IngredientFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: IngredientCategory;
  createdBy?: string;
}

type IngredientError = IngredientNotFoundException | DuplicateIngredientException | IngredientValidationException;

@Injectable()
export class IngredientsService {
  constructor(@InjectModel(Ingredient.name) private ingredientRepository: Model<Ingredient>) {}

  async findAll(filters: IngredientFilters): Promise<Ingredient[]> {
    const query: FilterQuery<Ingredient> = {};

    // Apply filters
    if (filters.search) {
      query.$or = [
        { name_key: { $regex: filters.search, $options: "i" } },
        { aliases: { $in: [new RegExp(filters.search, "i")] } },
        { "i18n.fr": { $regex: filters.search, $options: "i" } },
        { "i18n.en": { $regex: filters.search, $options: "i" } },
      ];
    }
    if (filters.category) {
      query.category = filters.category;
    }
    if (filters.createdBy) {
      query.created_by = filters.createdBy;
    }

    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    return this.ingredientRepository.find(query).skip(skip).limit(limit).exec();
  }

  async findOne(id: string): Promise<Result<Ingredient, IngredientNotFoundException>> {
    const ingredient = await this.ingredientRepository.findById(id).exec();
    if (!ingredient) {
      return err(new IngredientNotFoundException(id));
    }
    return ok(ingredient);
  }

  async create(createIngredientDto: CreateIngredientDto): Promise<Result<Ingredient, IngredientError>> {
    // Check for duplicate name_key
    const existingIngredient = await this.ingredientRepository.findOne({ name_key: createIngredientDto.name_key }).exec();

    if (existingIngredient) {
      return err(new DuplicateIngredientException(createIngredientDto.name_key));
    }

    // Validate i18n object has at least one language
    if (!createIngredientDto.i18n || Object.keys(createIngredientDto.i18n).length === 0) {
      return err(new IngredientValidationException("i18n object must contain at least one language"));
    }

    // Set default created_by if not provided
    const ingredientData = {
      ...createIngredientDto,
      created_by: createIngredientDto.created_by || "system",
    };

    const ingredient = await this.ingredientRepository.create(ingredientData);
    return ok(ingredient);
  }

  async update(id: string, updateIngredientDto: UpdateIngredientDto): Promise<Result<Ingredient, IngredientError>> {
    // Check for duplicate name_key if it's being updated
    if (updateIngredientDto.name_key) {
      const existingIngredient = await this.ingredientRepository.findOne({ name_key: updateIngredientDto.name_key, _id: { $ne: id } }).exec();

      if (existingIngredient) {
        return err(new DuplicateIngredientException(updateIngredientDto.name_key));
      }
    }

    const ingredient = await this.ingredientRepository.findByIdAndUpdate(id, updateIngredientDto, { new: true }).exec();

    if (!ingredient) {
      return err(new IngredientNotFoundException(id));
    }

    return ok(ingredient);
  }

  async partialUpdate(id: string, patchIngredientDto: PatchIngredientDto): Promise<Result<Ingredient, IngredientError>> {
    // Check for duplicate name_key if it's being updated
    if (patchIngredientDto.name_key) {
      const existingIngredient = await this.ingredientRepository.findOne({ name_key: patchIngredientDto.name_key, _id: { $ne: id } }).exec();

      if (existingIngredient) {
        return err(new DuplicateIngredientException(patchIngredientDto.name_key));
      }
    }

    const ingredient = await this.ingredientRepository.findByIdAndUpdate(id, { $set: patchIngredientDto }, { new: true }).exec();

    if (!ingredient) {
      return err(new IngredientNotFoundException(id));
    }

    return ok(ingredient);
  }

  async remove(id: string): Promise<Result<void, IngredientNotFoundException>> {
    const result = await this.ingredientRepository.findByIdAndDelete(id).exec();
    if (!result) {
      return err(new IngredientNotFoundException(id));
    }
    return ok(undefined);
  }

  async searchByAliases(query: string, language?: string): Promise<Ingredient[]> {
    const searchQuery: FilterQuery<Ingredient> = {
      $or: [{ name_key: { $regex: query, $options: "i" } }, { aliases: { $in: [new RegExp(query, "i")] } }],
    };

    // Add language-specific search if provided
    if (language) {
      searchQuery.$or.push({ [`i18n.${language}`]: { $regex: query, $options: "i" } });
    } else {
      // Search in all i18n fields
      searchQuery.$or.push({ "i18n.fr": { $regex: query, $options: "i" } }, { "i18n.en": { $regex: query, $options: "i" } });
    }

    return this.ingredientRepository.find(searchQuery).exec();
  }

  async findByCategory(category: IngredientCategory): Promise<Ingredient[]> {
    return this.ingredientRepository.find({ category }).exec();
  }

  async findByNameKey(nameKey: string): Promise<Result<Ingredient, IngredientNotFoundException>> {
    const ingredient = await this.ingredientRepository.findOne({ name_key: nameKey }).exec();
    if (!ingredient) {
      return err(new IngredientNotFoundException(nameKey));
    }
    return ok(ingredient);
  }
}
