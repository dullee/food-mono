import mongoose from "mongoose";

const Schema = mongoose.Schema;

const CategorySchema = new Schema(
  {
    categoryName: { type: String, required: true },
  },
  {
    timestamps: true, // 👈 Enables automatic createdAt and updatedAt management
  },
);

export const categoryModel = mongoose.model("category", CategorySchema);
