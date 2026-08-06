import { UserModel } from "../../models/user-model.js";

export const createUser = async (req, res) => {
  const body = req.body;
  const newUser = await UserModel.create({
    email: body.email,
    password: body.password,
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
