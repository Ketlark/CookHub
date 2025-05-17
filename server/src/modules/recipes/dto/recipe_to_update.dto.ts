import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { RecipeDifficulty } from "../entity/recipe.entity";

export class RecipeToUpdateDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsEnum(RecipeDifficulty)
  difficulty: RecipeDifficulty;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  image_url: string;
}
