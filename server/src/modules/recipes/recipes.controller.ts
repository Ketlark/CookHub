import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { RecipesService } from "./recipes.service";
import { RecipeToCreateDto } from "./dto/recipe_to_create.dto";
import { RecipeToUpdateDto } from "./dto/recipe_to_update.dto";

@Controller("recipes")
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Get()
  async fetchAll() {
    return await this.recipesService.fetchAll();
  }

  @Post()
  async create(@Body() recipeToCreate: RecipeToCreateDto) {
    return await this.recipesService.create(recipeToCreate);
  }

  @Patch(":id")
  async update(@Body() recipeToUpdate: RecipeToUpdateDto, @Param("id") id: string) {
    return await this.recipesService.update(id, recipeToUpdate);
  }

  @Post(":id/publish")
  async publish() {}
}
