import { IsNotEmpty, IsString, IsObject, IsOptional, IsArray, IsEnum } from "class-validator";
import { IngredientNutrition } from "../entity/ingredient.entity";
import { IngredientCategory } from "../enums/ingredient.enum";

export class CreateIngredientDto {
  @IsNotEmpty()
  @IsString()
  name_key: string;

  @IsNotEmpty()
  @IsObject()
  i18n: Record<string, string>;

  @IsOptional()
  @IsArray()
  aliases?: string[];

  @IsOptional()
  @IsEnum(IngredientCategory)
  category?: IngredientCategory;

  @IsOptional()
  @IsString()
  created_by?: string; // Mock for now

  @IsOptional()
  nutrition?: IngredientNutrition;
}
