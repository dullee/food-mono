import express from "express";

import { getOrder } from "../resolvers/order/get-order.js";
import { createOrder } from "../resolvers/order/create-order.js";
import { updateOrder } from "../resolvers/order/update-order.js";
import { deleteOrder } from "../resolvers/order/delete-order.js";

export const orderRouter = express.Router();

orderRouter.get("/", getOrder);
orderRouter.post("/", createOrder);
orderRouter.patch("/", updateOrder);
orderRouter.delete("/:id", deleteOrder);
