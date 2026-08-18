import { Order } from "./order.js";

export type User = {
  _id: string;
  email: string;
  password: string;
  phoneNumber: string;
  address: string;
  role: string;
  orderedFoods: Order;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
};
