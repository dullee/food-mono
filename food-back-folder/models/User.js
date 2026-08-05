// models/User.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String , default: null},
    address: { type: String, default: null},
    role: { type: String, enum: ["USER", "ADMIN"], default: "USER" }, // UserRoleEnum
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true },
); // auto-adds createdAt/updatedAt, matching your ERD

// "User" here becomes a MongoDB collection called "users" automatically
module.exports = mongoose.model("User", UserSchema);
