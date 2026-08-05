require("@dotenvx/dotenvx").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const User = require("./models/User");
const Food = require("./models/Foods");

const app = express();
console.log(
  "DEBUG ENVIRONMENT KEYS:",
  Object.keys(process.env).filter((key) => key.includes("MONGO")),
);

// Middleware
app.use(cors()); // Lets your Next.js app talk to Express
app.use(express.json()); // Allows Express to read JSON sent from Next.js

// POST Route: Triggered when user submits the Next.js form
// Add this route in server.js
app.post("/api/users/check-email", async (req, res) => {
  try {
    const { email } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Email is free to use!
    res.status(200).json({ message: "Email available" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/foods", async (req, res) => {
  try {
    console.log("Incoming Food Data:", req.body);

    const { foodName, price, image, ingredients, category } = req.body;

    // 1. Extract the raw ID string if it's nested, or keep it blank for now
    // (Mongoose will throw a validation error if you pass an object into an ObjectId type field)
    const categoryId = typeof category === "object" ? category._id : category;

    const newFood = new Food({
      foodName,
      price,
      image,
      ingredients,
      category: categoryId, // Assign the raw ID string
    });

    // 2. THIS IS THE MISSING PIECE: Actually write the document to MongoDB!
    await newFood.save();

    res
      .status(201)
      .json({ message: "Food saved successfully!", food: newFood });
  } catch (error) {
    // 3. Updated error print to log out validation errors directly to your console
    console.error("Mongoose Save Error:", error);
    res
      .status(500)
      .json({ error: "Failed to save food item", details: error.message });
  }
});

app.get("/api/users", async (req, res) => {
  try {
    // 1. Query the database to find all user documents
    const users = await User.find({});

    // 2. If the array is empty, return a 404
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    // 3. Return the array of users with a 200 OK status
    return res.status(200).json(users);
  } catch (error) {
    // 4. Catch unexpected database errors
    console.error("Error fetching users:", error);
    return res.status(500).json({ error: "Server error fetching users" });
  }
});

app.get("/api/foods", async (req, res)=> {

  const foodsData = await Food.find({});

  return res.status(200).json(foodsData)
});

app.post("/api/users", async (req, res) => {
  try {
    const { email, password } = req.body;

    const newUser = new User({ email, password });
    await newUser.save(); // <-- THIS is what writes to MongoDB!

    res
      .status(201)
      .json({ message: "User saved successfully!", user: newUser });
  } catch (error) {
    res.status(500).json({ error: "Failed to save user" });
  }
});

// Connect to MongoDB Atlas first, then start the server on Port 4000
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(4000, () =>
      console.log("🚀 Backend server running on http://localhost:4000"),
    );
  })
  .catch((err) => console.error("❌ Database connection error:", err));
