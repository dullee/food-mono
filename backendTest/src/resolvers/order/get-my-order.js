import { UserModel } from "../../models/user-model.js";

export const getMyOrders = async (req, res) => {
  try {
    const { id } = req.params;
    // req.userId comes from your auth middleware
    const user = await UserModel.findById(id)
      .populate({
        path: "orderedFoods",
        populate: { path: "foodOrderItems.food" },
      })
      .exec();
    const orders = user.orderedFoods;

    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};
