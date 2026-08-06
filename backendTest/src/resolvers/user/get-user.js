import { UserModel } from "../../models/user-model.js";

export const getUser = async (req, res) => {
  const user = await UserModel.find();

  res.status(200).json(user);
};
