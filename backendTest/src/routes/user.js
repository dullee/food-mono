import express from "express";
import { getUser } from "../resolvers/user/get-user.js";
import { createUser } from "../resolvers/user/create-user.js";
import { updateUser } from "../resolvers/user/update-user.js";
import { deleteUser } from "../resolvers/user/delete-user.js";
import { verifyToken, isAdmin, loginUser } from "../resolvers/user/login.js";
import { checkEmail } from "../resolvers/user/check-email.js";
import { UserModel } from "../models/user-model.js";
import { logoutUser } from "../resolvers/user/logout.js";

export const userRouter = express.Router();

userRouter.post("/", createUser); // This acts as your /signup
userRouter.post("/login", loginUser); // New login endpoint
userRouter.post("/check-email", checkEmail);
userRouter.post("/logout", logoutUser);

// Protected Routes (Requires a valid cookie token)
userRouter.patch("/", verifyToken, updateUser); // Users can update their own data
userRouter.get("/me", verifyToken, async (req, res) => {
  const user = await UserModel.findById(req.user.id).select("name email role");
  res.json({ authenticated: true, user });
});

userRouter.delete("/:id", verifyToken, isAdmin, deleteUser); // Only admins can delete a user
userRouter.get("/", verifyToken, isAdmin, getUser); // Only admins can fetch all users
