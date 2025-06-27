import { PartialType } from '@nestjs/mapped-types';
import { CreateIngredientDto } from './create-ingredient.dto';

export class PatchIngredientDto extends PartialType(CreateIngredientDto) {
  // All properties from CreateIngredientDto are now optional
}