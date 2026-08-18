import express from "express";
import { getUser } from "../resolvers/user/get-user.js";
import { createUser } from "../resolvers/user/create-user.js";
import { updateUser } from "../resolvers/user/update-user.js";
import { deleteUser } from "../resolvers/user/delete-user.js";
import { verifyToken, isAdmin, loginUser } from "../resolvers/user/login.js";
import { checkEmail } from "../resolvers/user/check-email.js";

export const userRouter = express.Router();

userRouter.post("/", createUser); // This acts as your /signup
userRouter.post("/login", loginUser); // New login endpoint
userRouter.post("/check-email", checkEmail);

// Protected Routes (Requires a valid cookie token)
userRouter.get("/", verifyToken, isAdmin, getUser); // Only admins can fetch all users
userRouter.patch("/", verifyToken, updateUser); // Users can update their own data
userRouter.delete("/:id", verifyToken, isAdmin, deleteUser); // Only admins can delete a user
