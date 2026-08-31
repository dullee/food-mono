import { OrderModel } from "../../models/order-model.js";

export const getMyOrders = async (req, res) => {
  try {
    const userId = req.params.id;

    const orders = await OrderModel.find({ user: userId })
      .populate("user", "address name email") // Select specific fields from User
      .populate("foodOrderItems.food") // Populate food details inside array
      .exec();

    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};
