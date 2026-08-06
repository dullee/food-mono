import express from "express";
import { getUser } from "../resolvers/user/get-user.js";
import { createFood } from "../resolvers/food/create-food.js";

export const foodRouter = express.Router();

foodRouter.get("/", getUser);
foodRouter.post('/', createFood)
