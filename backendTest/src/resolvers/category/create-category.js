import { categoryModel } from "../../models/category-model.js";

export const createCategory = async (req, res) => {
  const newCategory = await categoryModel.create({
    categoryName: req.body.categoryName,
  });

  res.status(201).json({
    message: "Successfully created category",
    category: newCategory,
  });
};
