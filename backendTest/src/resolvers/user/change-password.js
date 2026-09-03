import { UserModel } from "../../models/user-model.js";

export const changePassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Search for a single match in MongoDB
    const existingUser = await UserModel.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!existingUser)
      return res
        .status(404)
        .json({ message: "Email is not linked to an account" });
    // Send back true or false
    return res.status(200).json("Succesfully changed password");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
