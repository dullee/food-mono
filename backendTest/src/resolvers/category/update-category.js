import { categoryModel } from "../../models/category-model.js";

export const updateCategory = async (req, res) => {
  try {
    const { _id, newName } = req.body;

    const updatedCategory = await categoryModel.findByIdAndUpdate(
      _id,
      { $set: { categoryName: newName } },
      { returnDocument: "after", runValidators: true },
    );
    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    return res.status(200).json({
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
