import { OrderModel } from "../../models/order-model.js";

import mongoose from "mongoose";

export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const deletedOrder = await OrderModel.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json({
      message: "Successfully deleted order",
      category: deletedOrder,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
