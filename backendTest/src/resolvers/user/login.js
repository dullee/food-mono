import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserModel } from "../../models/user-model.js"; // Adjust path to your actual Mongoose User model

const JWT_SECRET =
  "Z9L85NIwinxKTmWKcH41HbvBcScJEWbtS97u-PiUzyDsCNEoFpnocvp1PU2viSVx";

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Search database for the email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 2. Safely compare the passwords using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 3. Generate the token payload
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "1h",
    });

    // 4. Place token inside a secure browser cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // Set to true when you deploy with HTTPS
      sameSite: "strict",
      maxAge: 3600000, // 1 hour
    });

    // 5. Send success back to Next.js
    res.json({
      success: true,
      user: { id: user._id, name: user.name, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const verifyToken = (req, res, next) => {
  const token = req.cookies.token; // Read token from the secure cookie

  if (!token) {
    return res.status(401).json({ message: "Access denied. Please log in." });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified; // This injects { id, role } into the request object
    next(); // Pass control to the next check
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired token." });
  }
};

export const isAdmin = (req, res, next) => {
  // req.user was created right above in verifyToken
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next(); // Pass control to your CRUD resolver
};
