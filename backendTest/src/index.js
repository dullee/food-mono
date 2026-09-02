import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";

import { categoryRouter } from "./routes/category.js";
import { foodRouter } from "./routes/food.js";
import { userRouter } from "./routes/user.js";
import { orderRouter } from "./routes/order.js";

const app = express();
const port = process.env.PORT || 4000;

// 1. Defined Allowed Origins (Array prevents undefined/trailing slash issues)
const allowedOrigins = [
  "https://food-mono-food-front-folder.vercel.app",
  process.env.BASE_URL?.replace(/\/$/, ""), // strip trailing slash if present
  "http://localhost:3000",
].filter(Boolean);

app.use(express.json());
app.use(cookieParser());

// 2. Dynamic CORS Configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, server-to-server, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked for origin: ${origin}`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// 3. Cached MongoDB Connection for Vercel Serverless
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI);
    isConnected = db.connections[0].readyState === 1;
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};

// Middleware to ensure DB connection before handling requests on serverless
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Routes
app.use("/category", categoryRouter);
app.use("/food", foodRouter);
app.use("/user", userRouter);
app.use("/order", orderRouter);

// Export for Vercel serverless + local listening
if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

export default app;
