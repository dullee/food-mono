import { foodModel } from "../../models/food-model.js";

export const updateFood = async (req, res) => {
  try {
    const { _id, ...updateData } = req.body;
    const updatedFood = await foodModel.findByIdAndUpdate(_id, updateData, {
      returnDocument: "after",
      runValidators: true,
    });
    if (!updatedFood) {
      return res.status(404).json({ message: "Food not found" });
    }
    return res.status(200).json({
      message: "Food updated successfully",
      data: updatedFood,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
