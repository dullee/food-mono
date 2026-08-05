import mongoose from "mongoose";
import { UserModel } from "./user-model";

const ObjectId = mongoose.ObjectId;
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  id: ObjectId,
  user: UserModel,
  totalPrice: Number,
  foodOrderItems: [{ food: String, quantity: Number }],
  status: {
    type: String,
    enum: ["PENDING", "CANCELED", "DELIVERED"],
    default: "PENDING",
  },
  createdAt: { type: Date, require: true, default: Date.now },
  updatedAt: { type: Date, require: true, default: Date.now },
});

export const OrderModel = mongoose.model("order", OrderSchema)