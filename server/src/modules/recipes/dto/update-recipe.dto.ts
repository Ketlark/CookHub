import { IsString, IsOptional, IsEnum, IsNumber, IsArray, IsBoolean, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { RecipeDifficulty, RecipeIngredient, RecipeStep, RecipeNutrition } from '../entities/recipe.entity';

// UpdateRecipeDto - All fields optional
export class UpdateRecipeDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  translation_ref?: string;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsString()
  preview_image?: string;

  @IsOptional()
  @IsEnum(RecipeDifficulty)
  difficulty?: RecipeDifficulty;

  @IsOptional()
  @IsNumber()
  preparation_time?: number;

  @IsOptional()
  @IsNumber()
  cooking_time?: number;

  @IsOptional()
  @IsNumber()
  total_time?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecipeIngredient)
  ingredients?: RecipeIngredient[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecipeStep)
  steps?: RecipeStep[];

  @IsOptional()
  @IsArray()
  diets?: string[];

  @IsOptional()
  @IsArray()
  allergens?: string[];

  @IsOptional()
  nutrition?: RecipeNutrition;

  @IsOptional()
  @IsNumber()
  yield?: number;

  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @IsBoolean()
  is_draft?: boolean;
}