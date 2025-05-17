import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Recipe } from "./entity/recipe.entity";
import { Model } from "mongoose";
import { RecipeToCreateDto } from "./dto/recipe_to_create.dto";
import { RecipeToUpdateDto } from "./dto/recipe_to_update.dto";

@Injectable()
export class RecipesService {
  constructor(@InjectModel(Recipe.name) private recipeRepository: Model<Recipe>) {}

  async fetchAll(): Promise<Recipe[]> {
    return this.recipeRepository.find().exec();
  }

  async create(recipeToCreate: RecipeToCreateDto): Promise<Recipe> {
    return await this.recipeRepository.create({
      title: recipeToCreate.title,
      description: recipeToCreate.description,
      difficulty: recipeToCreate.difficulty,
      metadata: {
        image_url: recipeToCreate.image_url,
        author: "me",
      },
    });
  }

  async update(id: string, recipeToUpdate: RecipeToUpdateDto): Promise<Recipe> {
    return await this.recipeRepository.findByIdAndUpdate(
      id,
      {
        title: recipeToUpdate.title,
        description: recipeToUpdate.description,
        difficulty: recipeToUpdate.difficulty,
        metadata: {
          image_url: recipeToUpdate.image_url,
        },
      },
      { new: true },
    );
  }
}
