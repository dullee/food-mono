import { OrderModel } from "../../models/order-model.js";
import { foodModel } from "../../models/food-model.js";

export const createOrder = async (req, res) => {
  try {
    const foodOrderItems = req.body.foodOrderItems;

    if (!foodOrderItems || !Array.isArray(foodOrderItems) || foodOrderItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // 1. Map item.food to get the array of IDs
    const foodIds = foodOrderItems.map((item) => item.food);

    // 2. Fetch food records from DB
    const dbFoods = await foodModel.find({ _id: { $in: foodIds } });
    const foodMap = new Map(dbFoods.map((food) => [food._id.toString(), food]));

    let totalPrice = 0;
    const orderItems = [];

    // 3. Loop through items and calculate secure backend total
    for (const item of foodOrderItems) {
      const foodDoc = foodMap.get(item.food); // Reads item.food directly

      if (!foodDoc) {
        return res
          .status(404)
          .json({ message: `Item with ID ${item.food} not found` });
      }

      const itemTotal = foodDoc.price * item.quantity;
      totalPrice += itemTotal;

      orderItems.push({
        food: foodDoc._id,
        foodName: foodDoc.foodName,
        priceAtPurchase: foodDoc.price,
        quantity: item.quantity,
      });
    }

    // 4. Create the order
    const userId = req.user?.id || req.body.user?._id || req.body.user;

    const newOrder = await OrderModel.create({
      user: userId,
      totalPrice: totalPrice,
      foodOrderItems: orderItems,
    });

    return res.status(201).json({
      message: "Successfully created order",
      order: newOrder,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};