import mongoose from "mongoose";

const ObjectId = mongoose.ObjectId;
const Schema = mongoose.Schema;

const foodOrderItems = new Schema(
  {
    food: {
      type: Schema.Types.ObjectId,
      ref: "food",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: false },
);
//
const OrderSchema = new Schema(
  {
    id: ObjectId,
    user: { type: Schema.Types.ObjectId, ref: "user", required: true },
    totalPrice: {
      type: Number,
      required: true,
    },
    foodOrderItems: [foodOrderItems],
    status: {
      type: String,
      enum: ["PENDING", "CANCELED", "DELIVERED"],
      default: "PENDING",
    },
  },
  {
    timestamps: true, // 👈 Enables automatic createdAt and updatedAt management
  },
);

export const OrderModel = mongoose.model("order", OrderSchema);
