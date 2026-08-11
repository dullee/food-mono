import { UserModel } from "../../models/user-model.js";
import bcrypt from "bcryptjs";

export const createUser = async (req, res) => {
  const body = req.body;
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(body.password, saltRounds);
  const newUser = await UserModel.create({
    email: body.email,
    password: hashedPassword,
    phoneNumber: body.phoneNumber,
    address: body.address,
    role: body.role,
    orderedFoods: body.orderedFoods,
    ttl: body.ttl,
    isVerified: body.isVerified,
  });
  res.status(201).json({
    message: "Succesfully created user",
    user: newUser,
  });
};
