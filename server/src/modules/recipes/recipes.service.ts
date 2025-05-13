import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Recipe } from "./entity/recipe.entity";
import { Model } from "mongoose";
import { RecipeToCreateDto } from "./dto/recipe_to_create.dto";

@Injectable()
export class RecipesService {
  constructor(@InjectModel(Recipe.name) private recipeRepository: Model<Recipe>) {}

  async fetchAll(): Promise<Recipe[]> {
    return this.recipeRepository.find().exec();
  }

  async create(recipeToCreate: RecipeToCreateDto): Promise<Recipe> {
    return await this.recipeRepository.create({
      ...recipeToCreate,
      metadata: {
        author: "me",
      },
    });
  }
}
