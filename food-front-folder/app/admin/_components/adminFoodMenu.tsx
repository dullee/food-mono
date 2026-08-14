"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Plus, Pencil } from "lucide-react";
import { useState, useEffect } from "react";
import Categories from "./categories";

// 1. Correct TypeScript primitive types (string instead of String)
type Category = {
  _id: string;
  categoryName: string;
};

type Food = {
  _id: string;
  foodName: string;
  ingredients: string;
  category: Category;
  price: number;
  image: string;
};

export default function AdminFoodMenu() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [foods, setFoods] = useState<Food[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingFoods, setIsLoadingFoods] = useState<boolean>(true);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  // 2. Safe fetch handlers with try/catch to prevent unhandled fetch crashes
  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:8000/category");
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Categories fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFoods = async () => {
    try {
      const res = await fetch("http://localhost:8000/food");
      if (!res.ok) throw new Error("Failed to fetch foods");
      const data = await res.json();
      setFoods(data);
    } catch (err) {
      console.error("Foods fetch error:", err);
    } finally {
      setIsLoadingFoods(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchFoods();
  }, []);

  // Helper function to filter foods for a category ID
  const getFoodsForCategory = (categoryId: string) => {
    if (!foods) return [];
    return foods.filter((food) => food.category?._id === categoryId);
  };

  const handleSelectCategory = (categoryId: string) => {
    if (!categoryId || categoryId === filterCategory) {
      setFilterCategory(null); // Toggle off filter if clicked again
    } else {
      setFilterCategory(categoryId);
    }
  };

  // Filter categories displayed depending on user selection
  const displayedCategories = filterCategory
    ? categories.filter((cat) => cat._id === filterCategory)
    : categories;

  return (
    <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-6">
        <div className="space-y-6">
          <div className="rounded-3xl border border-gray-200 bg-slate-50 p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
                  Categories
                </p>
              </div>
            </div>
            <Categories
              onCategoryAdded={fetchCategories}
              onSelectedCategory={handleSelectCategory}
            />
          </div>
        </div>

        <div className="space-y-6">
          {!isLoading && (
            <div className="rounded-3xl border border-gray-200 bg-white p-5 space-y-8">
              {displayedCategories?.map((category) => (
                <div key={category._id}>
                  <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="font-semibold text-gray-800 text-lg">
                      {category.categoryName}
                    </div>
                  </div>

                  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
                    {/* Add New Dish Card */}
                    <div className="group rounded-3xl border gap-2 border-dashed border-red-400 flex flex-col justify-center items-center bg-slate-50 p-4 transition hover:border-black cursor-pointer min-h-[220px]">
                      <Button
                        variant="outline"
                        className="w-10 h-10 bg-red-500 text-white rounded-full hover:bg-red-600 border-none"
                      >
                        <Plus className="h-5 w-5" />
                      </Button>
                      <span className="text-sm text-gray-600 font-medium text-center">
                        Add new Dish to {category.categoryName}
                      </span>
                    </div>

                    {/* Food Items list for this category */}
                    {!isLoadingFoods &&
                      getFoodsForCategory(category._id)?.map((food) => (
                        <div
                          key={food._id}
                          className="group rounded-3xl border border-gray-200 bg-slate-50 p-4 transition hover:border-black flex flex-col justify-between"
                        >
                          <div>
                            <div className="relative w-full h-32 mb-3 overflow-hidden rounded-2xl bg-gray-200">
                              <Image
                                alt={food.foodName || "Food image"}
                                fill
                                unoptimized={!!food.image?.startsWith("http")} // Prevents next/image hostname errors for local external images
                                className="object-cover"
                                src={food.image || "/finger-food.jpg"}
                              />
                              <Button
                                variant="outline"
                                className="text-xs text-red-500 absolute bottom-3 right-3 h-9 w-9 p-0 bg-white/90 backdrop-blur-sm z-30 shadow-sm rounded-xl hover:bg-white"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="mb-2 flex items-center justify-between gap-2">
                              <span className="text-sm font-semibold text-red-500 truncate">
                                {food.foodName}
                              </span>
                              <span className="text-sm font-bold text-gray-900 shrink-0">
                                ${food.price}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 line-clamp-2">
                              {food.ingredients}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}