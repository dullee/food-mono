import { categoryModel } from "../../models/category-model.js";
import { foodModel } from "../../models/food-model.js";

export const getCategory = async (req, res) => {
  const categories = await categoryModel.find();

  const result = await Promise.all(
    categories.map(async (category) => {
      const foodCount = await foodModel.countDocuments({
        category: category._id,
      });
      return { ...category.toObject(), foodCount };
    }),
  );

  const AllFoodCount = await foodModel.countDocuments();

  res.status(200).json({ categories: result, AllFoodCount });x
};
