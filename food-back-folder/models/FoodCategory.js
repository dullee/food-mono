// models/FoodCategory.js
const mongoose = require("mongoose");

const FoodCategorySchema = new mongoose.Schema(
  {
    categoryName: { type: String, required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("FoodCategory", FoodCategorySchema);
