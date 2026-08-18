import { Category } from "./category";

export type Food = {
  _id: string;
  foodName: string;
  price: number;
  image: string;
  ingredients: string;
  category: Category;
  createdAt: string;
  updatedAt: string;
};
