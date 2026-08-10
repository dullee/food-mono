import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { categoryRouter } from "./routes/category.js";
import { foodRouter } from "./routes/food.js";
import { userRouter } from "./routes/user.js";
import { orderRouter } from "./routes/order.js";

const port = 8000;
const app = express();
app.use(express.json());
app.use(cors());

app.use("/category", categoryRouter);
app.use("/food", foodRouter);
app.use("/user", userRouter);
app.use("/order", orderRouter);

mongoose
  .connect(
    "mongodb+srv://dulguunenkhbayar05_db_user:PMtoxRdJDoIt8rVw@testcluster.vdlomqi.mongodb.net",
  )
  .then(() => console.log("Connected"));
app.listen(port, () => {
  console.log(`server is running on http://localhost:${port}`);
});
//aaasd