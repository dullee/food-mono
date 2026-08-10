import { OrderModel } from "../../models/order-model.js";
import { foodModel } from "../../models/food-model.js";

export const createOrder = async (req, res) => {
  const body = req.body;
  const newOrder = await OrderModel.create({
    user: body.user,
    totalPrice: body.totalPrice,
    foodOrderItems: body.foodOrderItems,
  });
  res.status(201).json({
    message: "Succesfully created order",
    order: newOrder,
  });
};
