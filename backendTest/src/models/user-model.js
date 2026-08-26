import mongoose from "mongoose";

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const UserSchema = new Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, default: null },
    address: { type: String, default: null },
    role: { type: String, enum: ["USER", "ADMIN"], default: "USER" },
    orderedFoods: [{ type: Schema.Types.ObjectId, ref: "order" }],
    ttl: Date,
    isVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);
export const UserModel = mongoose.model("user", UserSchema);
