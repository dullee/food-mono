"use client";

import FoodCard from "./foodCard";
import { useState, useEffect } from "react";
import { Category } from "../types/category";
import { Food } from "../types/food";

export default function FoodMenu() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        const [catRes, foodRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/category`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/food`),
        ]);

        if (!catRes.ok || !foodRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const catData = await catRes.json();
        const foodData = await foodRes.json();
        setCategories(catData.categories);
        setFoods(foodData);
      } catch (err) {
        console.error("Database connection error via backend:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  return (
    <div className="w-full flex flex-col md:p-22 md:gap-13.5">
      {categories.map((category) => (
        <div key={category._id}>
          <h1 className="pb-13.5 text-white text-[30px] font-semibold">
            {category.categoryName}
          </h1>
          <div className="grid md:grid-cols-3 md:gap-9">
            {!isLoading &&
              foods
                .filter((food) => {
                  const foodCatId =
                    typeof food.category === "object"
                      ? food.category?._id
                      : food.category;
                  return foodCatId === category._id;
                })
                .map((food) => <FoodCard key={food._id} food={food} />)}
          </div>
        </div>
      ))}
    </div>
  );
}
