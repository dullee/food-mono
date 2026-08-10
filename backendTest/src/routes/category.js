import express from "express";
import { getCategory } from "../resolvers/category/get-category.js";
import { createCategory } from "../resolvers/category/create-category.js";
import { deleteCategory } from "../resolvers/category/delete-category.js";

export const categoryRouter = express.Router()

categoryRouter.get("/", getCategory)
categoryRouter.post('/',createCategory)
categoryRouter.delete("/:id", deleteCategory)