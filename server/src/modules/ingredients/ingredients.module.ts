import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Ingredient, IngredientEntity } from "../ingredients/entity/ingredient.entity";
import { IngredientsController } from "./ingredients.controller";
import { IngredientsService } from "./ingredients.service";

@Module({
  imports: [MongooseModule.forFeature([{ name: Ingredient.name, schema: IngredientEntity }])],
  controllers: [IngredientsController],
  providers: [IngredientsService],
})
export class IngredientsModule {}
