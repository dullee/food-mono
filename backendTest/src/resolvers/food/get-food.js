import { foodModel } from "../../models/food-model.js";

export const getFood = async (req, res) => {
  try {
    const food = await foodModel.find().populate("category");
    res.status(200).json(food);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
