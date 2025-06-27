import { PartialType } from '@nestjs/mapped-types';
import { CreateRecipeDto } from './create-recipe.dto';

// PatchRecipeDto - Extends PartialType(CreateRecipeDto)
export class PatchRecipeDto extends PartialType(CreateRecipeDto) {}