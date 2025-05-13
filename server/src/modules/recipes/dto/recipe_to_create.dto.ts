import { IsEnum, IsNotEmpty, IsString } from "class-validator";
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
}
