import { UserModel } from "../../models/user-model.js";

export const getMyOrders = async (req, res) => {
  try {
    // 1. Get ID from authenticated user, or fallback to URL params
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // 2. Fetch user and populate nested food items
    const user = await UserModel.findById(userId)
      .populate({
        path: "orderedFoods",
        populate: { path: "foodOrderItems.food" },
      })
      .exec();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ orders: user.orderedFoods || [] });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};
