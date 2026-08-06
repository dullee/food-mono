import { categoryModel } from "../../models/category-model.js";

export const getCategory = async (req, res) => {
const categories = await categoryModel.find()

res.status(200).json(categories);

};