import mongoose from "mongoose";

const Schema = mongoose.Schema;

const FoodSchema = new Schema({
  foodName: { type: String, required: true },
  price: { type: Number, required: true },
  image: String,
  ingredients: String,
  category: { type: Schema.Types.ObjectId, ref: "category", required: true },
  createdAt: { type: Date, required: true, default: Date.now },
  updatedAt: { type: Date, required: true, default: Date.now },
});

export const foodModel = mongoose.model("food", FoodSchema);