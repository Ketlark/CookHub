import { IsString, IsObject, IsOptional, IsArray, IsEnum } from "class-validator";
import { IngredientNutrition } from "../entity/ingredient.entity";
import { IngredientCategory } from "../enums/ingredient.enum";

export class UpdateIngredientDto {
  @IsOptional()
  @IsString()
  name_key?: string;

  @IsOptional()
  @IsObject()
  i18n?: Record<string, string>;

  @IsOptional()
  @IsArray()
  aliases?: string[];

  @IsOptional()
  @IsEnum(IngredientCategory)
  category?: IngredientCategory;

  @IsOptional()
  nutrition?: IngredientNutrition;
}
