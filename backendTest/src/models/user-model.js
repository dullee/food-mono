import mongoose from "mongoose";

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const UserSchema = new Schema(
  {
    email: String,
    password: String,
    phoneNumber: String,
    address: String,
    role: { type: String, enum: ["USER", "ADMIN"], default: "USER" },
    orderedFoods: { type: Schema.Types.ObjectId, ref: "order" },
    ttl: Date,
    isVerified: Boolean,
  },
  {
    timestamps: true, // 👈 Enables automatic createdAt and updatedAt management
  },
);
export const UserModel = mongoose.model("user", UserSchema);
