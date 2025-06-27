import { NotFoundException, ConflictException } from '@nestjs/common';

export class IngredientNotFoundException extends NotFoundException {
  constructor(id: string) {
    super(`Ingredient with ID ${id} not found`);
  }
}

export class DuplicateIngredientException extends ConflictException {
  constructor(nameKey: string) {
    super(`Ingredient with name_key '${nameKey}' already exists`);
  }
}

export class IngredientValidationException extends ConflictException {
  constructor(message: string) {
    super(message);
  }
}