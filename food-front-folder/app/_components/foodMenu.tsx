"use client";

import FoodCard from "./foodCard";
import { useState, useEffect } from "react";
import { Category } from "../types/category";
import { Food } from "../types/food";

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export default function FoodMenu() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        const [catRes, foodRes, userRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/category`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/food`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/me`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include", // Crucial to send the cookie up
          }),
        ]);

        if (catRes.ok && foodRes.ok) {
          const catData = await catRes.json();
          const foodData = await foodRes.json();

          // Handle array responses safely
          setCategories(catData.categories || catData);
          setFoods(foodData.foods || foodData);
        } else {
          console.error("Failed to load category or food data.");
        }
        if (userRes.ok) {
          const userData = await userRes.json();
          setUser(userData.user);
        } else {
          setUser(null); // Guest user
        }
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
                .map((food) => (
                  <FoodCard key={food._id} food={food} user={user} />
                ))}
          </div>
        </div>
      ))}
    </div>
  );
}
