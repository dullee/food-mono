import { UserModel } from "../../models/user-model.js";

export const checkEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Search for a single match in MongoDB
    const existingUser = await UserModel.findOne({
      email: email.toLowerCase().trim(),
    });

    // Send back true or false
    res.json({ emailTaken: !!existingUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
