import { NotFoundException, ConflictException } from '@nestjs/common';

export class RecipeNotFoundException extends NotFoundException {
  constructor(id: string) {
    super(`Recipe with ID ${id} not found`);
  }
}

export class RecipeValidationException extends ConflictException {
  constructor(message: string) {
    super(message);
  }
}

export class DraftRecipePublishException extends ConflictException {
  constructor(id: string) {
    super(`Cannot publish recipe ${id}: missing required fields for publication`);
  }
}