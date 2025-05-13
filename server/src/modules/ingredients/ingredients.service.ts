import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Ingredient } from "./entity/ingredient.entity";

@Injectable()
export class IngredientsService {
  constructor(@InjectModel(Ingredient.name) private ingredientRepository: Model<Ingredient>) {}

  async create(ingredientToCreate: object): Promise<Ingredient> {
    return await this.ingredientRepository.create(ingredientToCreate);
  }

  async fetch(name?: string): Promise<Ingredient[]> {
    if (name) {
      return this.ingredientRepository.find({ name: { $regex: name, $options: "i" } }).exec();
    }
    return this.ingredientRepository.find().exec();
  }

  async fetchById(id: string): Promise<Ingredient> {
    return this.ingredientRepository.findById(id).exec();
  }

  async fetchByName(name: string): Promise<Ingredient> {
    return this.ingredientRepository.findOne({ name }).exec();
  }
}
