import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { categoryRouter } from "./routes/category.js";
import { foodRouter } from "./routes/food.js";
import { userRouter } from "./routes/user.js";
import { orderRouter } from "./routes/order.js";
import cookieParser from "cookie-parser";
import "dotenv/config";

const port = Number(process.env.PORT);
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: `http://localhost:3000`, credentials: true }));

app.use("/category", categoryRouter);
app.use("/food", foodRouter);
app.use("/user", userRouter);
app.use("/order", orderRouter);

mongoose.connect(process.env.MONGODB_URI).then(() => console.log("Connected"));
app.listen(port, async () => {
  console.log(`server is running on http://localhost:${port}`);
});
