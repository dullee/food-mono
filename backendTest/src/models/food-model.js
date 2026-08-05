import mongoose, { mongo } from "mongoose";
import { categoryModel } from "./category-model";

const ObjectId = mongoose.ObjectId;
const Schema = mongoose.Schema;

const FoodSchema = new Schema({
  id: ObjectId,
  foodName: String,
  price: Number,
  image: String,
  ingredients: String,
  category: categoryModel,
  createdAt: { type: Date, require: true, default: Date.now },
  updatedAt: { type: Date, require: true, default: Date.now },
});
export const FoodModel = mongoose.model("food", FoodSchema)
