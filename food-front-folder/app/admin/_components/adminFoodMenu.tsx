"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import Categories from "./categories";

type FoodMenuItem = {
  id: string;
  name: string;
  ingredients: string;
  category: string;
  price: number;
  status: "Available" | "Out of stock";
};

type Category = {
  categoryName: String;
  _id: String;
};

export default function AdminFoodMenu() {
  const [categories, setCategories] = useState<Category[] | null>([]);
  const [foods, setFoods] = useState<any[] | null>([]);
  const [isLoading, setIsLoading] = useState<Boolean>(true);
  const [isLoadingFoods, setIsLoadingFoods] = useState<Boolean>(true);

  const fetchCategories = async () => {
    const res = await fetch("http://localhost:8000/category");

    const data = await res.json();
    setCategories(data);
    setIsLoading(false);
  };

  const fetchFoods = async () => {
    const res = await fetch("http://localhost:8000/food");
    const data = await res.json();
    setFoods(data);
    setIsLoadingFoods(false);
  };

  useEffect(() => {
    fetchCategories();
    fetchFoods();
  }, []);

  function filterFood(categoryId: String) {
    return foods?.filter((food) => food.category?._id === categoryId);
  }

  return (
    <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-6">
        <div className="space-y-6">
          <div className="rounded-3xl border border-gray-200 bg-slate-50 p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
                  Categories
                </p>
              </div>
            </div>
            <Categories onCategoryAdded={fetchCategories}/>
          </div>
        </div>

        <div className="space-y-6">
          {!isLoading && (
            <div className="rounded-3xl border border-gray-200 bg-white p-5">
              {categories?.map((category, index) => (
                <div key={index}>
                  <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="font-semibold text-gray-800">
                      {category.categoryName}
                    </div>
                  </div>

                  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
                    <div className="group rounded-3xl border gap-2 border-dashed border-red-400 flex flex-col justify-center items-center bg-slate-50 p-4 transition hover:border-black cursor-pointer min-h-55">
                      <Button
                        variant="outline"
                        className="w-10 h-10 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <Plus/>
                      </Button>
                      <span className="text-sm text-gray-600 font-medium">
                        Add new Dish to {category.categoryName}
                      </span>
                    </div>

                    {!isLoadingFoods &&
                      filterFood(category._id)?.map((food) => (
                        <div
                          key={food._id}
                          className="group rounded-3xl border border-gray-200 bg-slate-50 p-4 transition hover:border-black"
                        >
                          <div className="relative w-full h-32 mb-3 overflow-hidden rounded-2xl">
                            <Image
                              alt="food"
                              fill
                              className="object-cover"
                              src={food.image || `/finger-food.jpg`}
                            />
                            <Button
                              variant="outline"
                              className="text-xs text-red-500 absolute bottom-3 right-3 h-9 w-9 p-0 bg-white/90 backdrop-blur-sm z-30 shadow-sm rounded-xl hover:bg-white"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-sm font-semibold text-red-500 truncate max-w-37.5">
                              {food.foodName}
                            </span>
                            <span className="text-sm font-bold text-gray-900">
                              ${food.price}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 line-clamp-2">
                            {food.ingredients}
                          </p>
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
