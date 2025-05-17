import { Prop, raw, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { Ingredient } from "src/modules/ingredients/entity/ingredient.entity";

export enum RecipeDifficulty {
  BEGINNER = "beginner",
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard",
}

export class RecipeStep {
  @Prop({ required: true })
  order: number;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop(
    raw({
      name: { type: String },
      duration: { type: Number },
    }),
  )
  timer?: Record<string, any>;

  @Prop({ type: Number })
  temperature?: number;

  @Prop({ type: [String] })
  ingredients?: string[];
}

export class RecipeIngredient {
  @Prop({ type: Types.ObjectId, ref: Ingredient.name })
  ingredient?: string;

  @Prop()
  ingredient_custom?: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  unit: string;

  @Prop()
  notes: string;
}

export class RecipeMetadata {
  @Prop({ required: true })
  author: string;

  @Prop({ required: true, default: true })
  draft: boolean;

  @Prop({ required: true, default: true })
  is_private: boolean;

  @Prop({ required: true })
  image_url: string;
}

@Schema({ timestamps: true })
export class Recipe {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: String, enum: RecipeDifficulty, required: true })
  difficulty: RecipeDifficulty;

  @Prop()
  ingredients: RecipeIngredient[];

  @Prop()
  steps: RecipeStep[];

  @Prop({ required: true })
  metadata: RecipeMetadata;
}

export const RecipeEntity = SchemaFactory.createForClass(Recipe);
