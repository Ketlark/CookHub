import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { IngredientsService } from "./ingredients.service";
import { IngredientToCreateDto } from "./dto/ingredient_to_create.dto";

@Controller("ingredients")
export class IngredientsController {
  constructor(private readonly ingredientsService: IngredientsService) {}

  @Post()
  async create(@Body() ingredientToCreate: IngredientToCreateDto) {
    return await this.ingredientsService.create(ingredientToCreate);
  }

  @Get()
  async fetch(@Query("name") name: string) {
    return await this.ingredientsService.fetch(name);
  }

  @Get("/:id")
  async fetchById(@Param("id") id: string) {
    return await this.ingredientsService.fetchById(id);
  }
}
