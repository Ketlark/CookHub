import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export enum IngredientCategory {
  VEGETABLE = "vegetable",
  FRUIT = "fruit",
  MEAT = "meat",
  DAIRY = "dairy",
  FISH = "fish",
  OTHER = "other",
}

@Schema({ timestamps: true })
export class Ingredient {
  @Prop({ unique: true, required: true })
  name_key: string;

  @Prop({ type: Map, of: String, required: true })
  i18n: Record<string, string>;

  @Prop({ type: [String], required: true })
  aliases: string[];

  @Prop({ enum: Object.keys(IngredientCategory), type: String })
  category: IngredientCategory;
}

export const IngredientEntity = SchemaFactory.createForClass(Ingredient);
