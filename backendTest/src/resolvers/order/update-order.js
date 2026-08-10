import { OrderModel } from "../../models/order-model.js";

export const updateOrder = async (req, res) => {
  try {
    const { _id, ...updateData } = req.body;
    const updatedOrder = await OrderModel.findByIdAndUpdate(_id, updateData, {
      returnDocument: "after",
      runValidators: true,
    });
    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    return res.status(200).json({
      message: "Order updated successfully",
      data: updatedOrder,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
