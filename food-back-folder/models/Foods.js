// models/Food.js
const mongoose = require("mongoose");

const FoodSchema = new mongoose.Schema(
  {
    foodName: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String }, // will hold the Cloudinary URL, see Part 8
    ingredients: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "FoodCategory" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Food", FoodSchema);
