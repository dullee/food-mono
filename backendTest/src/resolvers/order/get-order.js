import { OrderModel } from "../../models/order-model.js";

export const getOrder = async (req, res) => {
  const order = await OrderModel.find().populate("user").populate({
    path: "foodOrderItems.food", // Steps into the array and populates each food reference
  });
  res.status(200).json(order);
};
