import express from "express";
import { getUser } from "../resolvers/user/get-user.js";
import { createUser } from "../resolvers/user/create-user.js";

export const userRouter = express.Router();

userRouter.get("/", getUser);
userRouter.post('/', createUser)
