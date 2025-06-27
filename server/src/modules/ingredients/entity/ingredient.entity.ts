import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IngredientCategory } from "../enums/ingredient.enum";

// Ingredient nutrition interface
export interface IngredientNutrition {
  calories?: number;
  proteins?: number;
  carbs?: number;
  fats?: number;
  // Add more as needed
}

@Schema({ timestamps: true })
export class Ingredient {
  @Prop({ unique: true, required: true })
  name_key: string;

  @Prop({ type: Map, of: String, required: true })
  i18n: Record<string, string>;

  @Prop({ type: [String] })
  aliases?: string[];

  @Prop({ enum: Object.values(IngredientCategory), type: String })
  category?: IngredientCategory;

  @Prop({ type: String })
  created_by?: string; // 'system' or user ID

  @Prop({
    type: {
      calories: { type: Number },
      proteins: { type: Number },
      carbs: { type: Number },
      fats: { type: Number },
    },
  })
  nutrition?: IngredientNutrition; // Nutrition object (basic structure)
}

export const IngredientEntity = SchemaFactory.createForClass(Ingredient);
