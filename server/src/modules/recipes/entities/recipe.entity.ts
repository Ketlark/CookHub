import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Types } from "mongoose";
import { Ingredient } from "src/modules/ingredients/entity/ingredient.entity";

export enum RecipeDifficulty {
  BEGINNER = "beginner",
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard",
}

// New type definitions according to spec
export interface RecipeNutrition {
  calories?: number;
  proteins?: number;
  carbs?: number;
  fats?: number;
}

export interface RecipeStepMedia {
  type: 'image' | 'video';
  url: string;
}

export class RecipeStep {
  @Prop({ required: true })
  order: number;

  @Prop({ required: true })
  instructions: string;

  @Prop(
    raw([
      {
        type: { type: String, enum: ['image', 'video'] },
        url: { type: String }
      }
    ])
  )
  media?: RecipeStepMedia[];

  @Prop({ type: Number })
  duration?: number;

  @Prop({ type: Number })
  temperature?: number;
}

export class RecipeIngredient {
  @Prop({ type: String })
  id?: string; // Reference to ingredient

  @Prop({ type: String })
  name?: string; // Custom ingredient name

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  unit: string;
}

@Schema({ timestamps: true })
export class Recipe {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: String })
  translation_ref?: string; // UUID for translation reference

  @Prop({ type: String })
  language?: string; // Language code (e.g., 'fr', 'en')

  @Prop({ type: String })
  preview_image?: string; // Main recipe image URL

  @Prop({ type: String, enum: RecipeDifficulty, required: true })
  difficulty: RecipeDifficulty;

  @Prop({ type: Number })
  preparation_time?: number; // Prep time in minutes

  @Prop({ type: Number })
  cooking_time?: number; // Cooking time in minutes

  @Prop({ type: Number })
  total_time?: number; // Total time in minutes

  @Prop({ type: [RecipeIngredient] })
  ingredients?: RecipeIngredient[];

  @Prop({ type: [RecipeStep] })
  steps?: RecipeStep[];

  @Prop({ type: [String] })
  diets?: string[]; // Diet categories

  @Prop({ type: [String] })
  allergens?: string[]; // Allergen information

  @Prop(
    raw({
      calories: { type: Number },
      proteins: { type: Number },
      carbs: { type: Number },
      fats: { type: Number }
    })
  )
  nutrition?: RecipeNutrition; // Nutrition object

  @Prop({ type: Number })
  yield?: number; // Number of servings

  @Prop({ type: String })
  author?: string; // Author ID (mocked for now)

  @Prop({ type: Boolean, default: false })
  is_draft?: boolean; // Draft status
}

export const RecipeEntity = SchemaFactory.createForClass(Recipe);
