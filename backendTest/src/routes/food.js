import express from "express";
import { getFood } from "../resolvers/food/get-food.js";
import { createFood } from "../resolvers/food/create-food.js";
import { updateFood } from "../resolvers/food/update-food.js";

export const foodRouter = express.Router();

foodRouter.get("/", getFood);
foodRouter.post("/", createFood);
foodRouter.patch("/", updateFood);
