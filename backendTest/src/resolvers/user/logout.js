import jwt from "jsonwebtoken";
import { UserModel } from "../../models/user-model.js";

export const logoutUser = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  res.json({ success: true });
};
