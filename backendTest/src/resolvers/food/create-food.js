import { foodModel } from "../../models/food-model.js";

export const createFood = async (req, res) => {
  const newFood = await foodModel.create({
    foodName: req.body.foodName,
    price: req.body.price,
    image: req.body.image,
    ingredients: req.body.ingredients,
    category: req.body.category,
  });
  res.status(201).json({
    message: "Succesfully created food",
    food: newFood,
  });
};
