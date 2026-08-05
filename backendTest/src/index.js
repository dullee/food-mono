import express from "express";
import mongoose from 'mongoose';
import cors from 'cors';

const port = 8000;
const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://dulguunenkhbayar05_db_user:PMtoxRdJDoIt8rVw@testcluster.vdlomqi.mongodb.net").then(()=> console.log("Connected"));
app.listen(port, () => {
    console.log(`server is running on https://localhost:${port}`);
})

