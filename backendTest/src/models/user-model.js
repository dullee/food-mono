import mongoose from "mongoose";

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const UserSchema = new Schema({
  id: ObjectId,
  email: String,
  password: String,
  phoneNumber: String,
  address: String,
  role: { type: String, enum: ["USER", "ADMIN"], default: "USER" },
  orderedFoods: { type: Schema.Types.ObjectId, ref: "order" },
  ttl: Date,
  isVerified: Boolean,
  createdAt: { type: Date, require: true, default: Date.now },
  updatedAt: { type: Date, require: true, default: Date.now },
});
export const UserModel = mongoose.model("user", UserSchema);
