import { UserModel } from "../../models/user-model.js";
import bcrypt from "bcryptjs";

export const changePassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res
        .status(400)
        .json({ message: "Email and new password are required" });
    }

    // 1. Find the user
    const existingUser = await UserModel.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!existingUser) {
      return res
        .status(404)
        .json({ message: "Email is not linked to an account" });
    }

    // 2. Hash the new password before saving
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // 3. Syntax for updating the password property in Mongoose
    await UserModel.findByIdAndUpdate(
      existingUser._id,
      { password: hashedPassword }, // or { $set: { password: hashedPassword } }
      { new: true }, // Returns the updated document
    );

    return res.status(200).json({ message: "Successfully changed password" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
