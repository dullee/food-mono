"use client";

import FoodCard from "./foodCard";
import { useState, useEffect } from "react";

type Category = {
  _id: string;
  categoryName: string;
  createdAt?: string;
  updatedAt?: string;
  foodCount: number;
};

type Food = {
  _id: string;
  foodName: string;
  category: Category;
};

export default function FoodMenu() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        const [catRes, foodRes] = await Promise.all([
          fetch("http://localhost:8000/category"),
          fetch("http://localhost:8000/food"),
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
        <div>
          <h1 className="pb-13.5 text-white text-[30px] font-semibold">
            {category.categoryName}
          </h1>
          <div className="grid md:grid-cols-3 md:gap-9">
            {Array.from({length: category.foodCount}).map((_, index)=>(
            <FoodCard />

            ))

            }

          </div>
        </div>
      ))}

      {/* <div>
        <h1 className="pb-13.5 text-white text-[30px] font-semibold">Salads</h1>
        <div className="grid md:grid-cols-3 md:gap-9">
          <FoodCard id={0} />
          <FoodCard id={0} />
          <FoodCard id={0} />
        </div>
      </div>
      <div>
        <h1 className="pb-13.5 text-white text-[30px] font-semibold">
          Lunch favorites
        </h1>
        <div className="grid md:grid-cols-3 md:gap-9">
          <FoodCard id={0} />
          <FoodCard id={0} />
          <FoodCard id={0} />
          <FoodCard id={0} />
          <FoodCard id={0} />
        </div>
      </div>
      <div>
        <h1 className="pb-13.5 text-white text-[30px] font-semibold">Salads</h1>
        <div className="grid md:grid-cols-3 md:gap-9">
          <FoodCard id={0} />
          <FoodCard id={0} />
          <FoodCard id={0} />
        </div>
      </div> */}
    </div>
  );
}
