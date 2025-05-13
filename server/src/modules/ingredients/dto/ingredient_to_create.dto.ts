import { IngredientCategory } from "../entity/ingredient.entity";
import { IsEnum, IsNotEmpty, IsOptional } from "class-validator";

export class IngredientToCreateDto {
  @IsNotEmpty()
  name_key: string;

  @IsOptional()
  @IsEnum(IngredientCategory)
  category?: IngredientCategory;
}
