import mongoose from "mongoose";

const ObjectId = mongoose.ObjectId;
const Schema = mongoose.Schema;

const foodOrderItems = new Schema({
  food: {
    type: Schema.Types.ObjectId,
    ref: "food",
  },
  quantity: Number,
});

const OrderSchema = new Schema({
  id: ObjectId,
  user: { type: Schema.Types.ObjectId, ref: "user", required: true },
  totalPrice: Number,
  foodOrderItems: [foodOrderItems],
  status: {
    type: String,
    enum: ["PENDING", "CANCELED", "DELIVERED"],
    default: "PENDING",
  },
  createdAt: { type: Date, require: true, default: Date.now },
  updatedAt: { type: Date, require: true, default: Date.now },
});

export const OrderModel = mongoose.model("order", OrderSchema);
