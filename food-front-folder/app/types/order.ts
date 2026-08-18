import { User } from "./user";
import { Food } from "./food";

export type FoodOrderItemsProps = {
  food: Food;
  quantity: number;
};
export type Order = {
  _id: string;
  user: User;
  totalPrice: number;
  foodOrderItems: FoodOrderItemsProps[];
  status: string;
  createdAt?: string;
  updatedAt?: string;
};
