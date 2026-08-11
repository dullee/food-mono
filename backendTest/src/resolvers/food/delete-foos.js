import { foodModel } from "../../models/food-model.js";

import mongoose from "mongoose";

export const deleteFood = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format " });
    }
    const deletedFood = await foodModel.findByIdAndDelete(id);

    if (!deletedFood) {
      return res.status(404).json({ message: "Food not found" });
    }

    return res.status(200).json({
      message: "Successfully deleted category",
      food: deletedFood,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
