import mongoose from "mongoose";

const Schema = mongoose.Schema;

const FoodSchema = new Schema(
  {
    foodName: { type: String, required: true },
    price: { type: Number, required: true },
    image: String,
    ingredients: { type: String, default: null },
    category: { type: Schema.Types.ObjectId, ref: "category", required: true },
  },
  {
    timestamps: true, // 👈 Enables automatic createdAt and updatedAt management
  },
);

export const foodModel = mongoose.model("food", FoodSchema);
