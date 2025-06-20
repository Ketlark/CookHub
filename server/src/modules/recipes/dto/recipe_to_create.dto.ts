import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { RecipeDifficulty } from "../entity/recipe.entity";

export class RecipeToCreateDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsEnum(RecipeDifficulty)
  difficulty: RecipeDifficulty;

  @IsNotEmpty()
  @IsString()
  image_url: string;

  @IsNotEmpty()
  @IsBoolean()
  is_draft: boolean;

  @IsNotEmpty()
  @IsNumber()
  cooking_time: number;

  @IsNotEmpty()
  @IsNumber()
  servings_people: number;
}
