import mongoose from "mongoose";

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const UserSchema = new Schema(
  {
    email: { type: string, required: true },
    password: { type: string, required: true },
    phoneNumber: String,
    address: String,
    role: { type: String, enum: ["USER", "ADMIN"], default: "USER" },
    orderedFoods: { type: Schema.Types.ObjectId, ref: "order" },
    ttl: Date,
    isVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true, // 👈 Enables automatic createdAt and updatedAt management
  },
);
export const UserModel = mongoose.model("user", UserSchema);
