// models/FoodOrder.js
const mongoose = require("mongoose");

// FoodOrderItem is NOT its own collection in your ERD ("Энэ model биш")
// — it only ever lives embedded inside a FoodOrder.
const FoodOrderItemSchema = new mongoose.Schema(
  {
    food: { type: mongoose.Schema.Types.ObjectId, ref: "Food", required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false },
);

const FoodOrderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    totalPrice: { type: Number, required: true },
    foodOrderItems: [FoodOrderItemSchema],
    address: { type: String, required: true },
    status: {
      type: String,
      // FoodOrderStatusEnum — extended per Step 0 of the backend guide
      enum: ["PENDING", "PREPARING", "DELIVERING", "DELIVERED", "CANCELED"],
      default: "PENDING",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("FoodOrder", FoodOrderSchema);
