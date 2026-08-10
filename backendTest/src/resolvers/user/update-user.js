import { UserModel } from "../../models/user-model.js";

export const updateUser = async (req, res) => {
  try {
    const { _id, ...updateData } = req.body;
    const updatedUser = await UserModel.findByIdAndUpdate(_id, updateData, {
      returnDocument: "after",
      runValidators: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
