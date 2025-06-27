import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Recipe } from "./entities/recipe.entity";
import { Model, FilterQuery } from "mongoose";
import { CreateRecipeDto } from "./dto/create-recipe.dto";
import { UpdateRecipeDto } from "./dto/update-recipe.dto";
import { PatchRecipeDto } from "./dto/patch-recipe.dto";
import { RecipeNotFoundException, DraftRecipePublishException, RecipeValidationException } from "./exceptions/recipe.exceptions";
import { Result, ok, err } from "neverthrow";

export interface RecipeFilters {
  page?: number;
  limit?: number;
  difficulty?: string;
  diet?: string;
  maxCookingTime?: number;
  search?: string;
  draft?: boolean;
  author?: string;
}

type RecipeError = RecipeNotFoundException | RecipeValidationException | DraftRecipePublishException;

@Injectable()
export class RecipesService {
  constructor(@InjectModel(Recipe.name) private recipeRepository: Model<Recipe>) {}

  async findAll(filters: RecipeFilters): Promise<Recipe[]> {
    const query: FilterQuery<Recipe> = {};

    // Apply filters
    if (filters.difficulty) {
      query.difficulty = filters.difficulty;
    }
    if (filters.diet) {
      query.diets = { $in: [filters.diet] };
    }
    if (filters.maxCookingTime) {
      query.cooking_time = { $lte: filters.maxCookingTime };
    }
    if (filters.draft !== undefined) {
      query.is_draft = filters.draft;
    }
    if (filters.author) {
      query.author = filters.author;
    }
    if (filters.search) {
      query.$text = { $search: filters.search };
    }

    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    return this.recipeRepository.find(query).skip(skip).limit(limit).exec();
  }

  async findOne(id: string): Promise<Result<Recipe, RecipeNotFoundException>> {
    const recipe = await this.recipeRepository.findById(id).exec();
    if (!recipe) {
      return err(new RecipeNotFoundException(id));
    }
    return ok(recipe);
  }

  async create(createRecipeDto: CreateRecipeDto): Promise<Result<Recipe, RecipeValidationException>> {
    // Set default author if not provided
    const recipeData = {
      ...createRecipeDto,
      author: createRecipeDto.author || "mock-user-id",
      is_draft: createRecipeDto.is_draft ?? true,
    };

    // Validate total_time if both prep and cooking times are provided
    if (recipeData.preparation_time && recipeData.cooking_time && recipeData.total_time) {
      const expectedTotal = recipeData.preparation_time + recipeData.cooking_time;
      if (recipeData.total_time !== expectedTotal) {
        return err(new RecipeValidationException(
          `Total time (${recipeData.total_time}) should equal preparation time (${recipeData.preparation_time}) + cooking time (${recipeData.cooking_time})`,
        ));
      }
    }

    const recipe = await this.recipeRepository.create(recipeData);
    return ok(recipe);
  }

  async update(id: string, updateRecipeDto: UpdateRecipeDto): Promise<Result<Recipe, RecipeNotFoundException>> {
    const recipe = await this.recipeRepository.findByIdAndUpdate(id, updateRecipeDto, { new: true }).exec();

    if (!recipe) {
      return err(new RecipeNotFoundException(id));
    }

    return ok(recipe);
  }

  async partialUpdate(id: string, patchRecipeDto: PatchRecipeDto): Promise<Result<Recipe, RecipeNotFoundException>> {
    const recipe = await this.recipeRepository.findByIdAndUpdate(id, { $set: patchRecipeDto }, { new: true }).exec();

    if (!recipe) {
      return err(new RecipeNotFoundException(id));
    }

    return ok(recipe);
  }

  async remove(id: string): Promise<Result<void, RecipeNotFoundException>> {
    const result = await this.recipeRepository.findByIdAndDelete(id).exec();
    if (!result) {
      return err(new RecipeNotFoundException(id));
    }
    return ok(undefined);
  }

  async findDraftsByAuthor(author: string): Promise<Recipe[]> {
    return this.recipeRepository.find({ author, is_draft: true }).exec();
  }

  async publish(id: string): Promise<Result<Recipe, RecipeError>> {
    const recipeResult = await this.findOne(id);
    
    if (recipeResult.isErr()) {
      return err(recipeResult.error);
    }
    
    const recipe = recipeResult.value;

    // Validate required fields for publication
    if (!recipe.title || !recipe.description || !recipe.ingredients?.length || !recipe.steps?.length) {
      return err(new DraftRecipePublishException(id));
    }

    const updatedRecipe = await this.recipeRepository.findByIdAndUpdate(id, { is_draft: false }, { new: true }).exec();
    return ok(updatedRecipe!);
  }

  async unpublish(id: string): Promise<Result<Recipe, RecipeNotFoundException>> {
    const recipe = await this.recipeRepository.findByIdAndUpdate(id, { is_draft: true }, { new: true }).exec();

    if (!recipe) {
      return err(new RecipeNotFoundException(id));
    }

    return ok(recipe);
  }

  async findByFilters(filters: RecipeFilters): Promise<Recipe[]> {
    return this.findAll(filters);
  }

  async searchByText(query: string): Promise<Recipe[]> {
    return this.recipeRepository.find({ $text: { $search: query } }).exec();
  }
}
