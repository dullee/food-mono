"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, X } from "lucide-react";
import { useState, useEffect } from "react";
import Categories from "./categories";
import { CldImage } from "next-cloudinary";

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

  // 1. Store the full selected category object for the modal (null = closed)
  const [selectedAddCategory, setSelectedAddCategory] =
    useState<Category | null>(null);

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [foodName, setFoodName] = useState<string>("");
  const [foodPrice, setFoodPrice] = useState<number>(0);
  const [foodIngredients, setFoodIngredients] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [foodImage, setFoodImage] = useState<string>("");

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

  const getFoodsForCategory = (categoryId: string) => {
    if (!foods) return [];
    return foods.filter((food) => food.category?._id === categoryId);
  };

  const handleFood = async (
    name: string,
    categoryId: string,
    foodPrice: number,
    foodIngredients: string,
    foodImage: string,
  ) => {
    const response = await fetch(`http://localhost:8000/food`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        foodName: name,
        category: categoryId,
        price: foodPrice,
        ingredients: foodIngredients,
        image: foodImage,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create food");
    }

    return data;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName.trim() || !selectedAddCategory) return;

    setIsSaving(true);
    try {
      await handleFood(
        foodName,
        selectedAddCategory._id,
        foodPrice,
        foodIngredients,
        foodImage,
      );

      // Refresh food list to show newly added food item
      await fetchFoods();

      setFoodName("");
      setSelectedAddCategory(null);
      setFoodPrice(0);
      setFoodIngredients("");
      setFoodImage("");
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSelectCategory = (categoryId: string) => {
    if (!categoryId || categoryId === filterCategory) {
      setFilterCategory(null);
    } else {
      setFilterCategory(categoryId);
    }
  };

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
                    {/* 2. Open modal specifically for THIS category */}
                    <div
                      onClick={() => setSelectedAddCategory(category)}
                      className="group rounded-3xl border gap-2 border-dashed border-red-400 flex flex-col justify-center items-center bg-slate-50 p-4 transition hover:border-black cursor-pointer min-h-[220px]"
                    >
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

                    {!isLoadingFoods &&
                      getFoodsForCategory(category._id)?.map((food) => (
                        <div
                          key={food._id}
                          className="group rounded-3xl border border-gray-200 bg-slate-50 p-4 transition hover:border-black flex flex-col justify-between"
                        >
                          <div>
                            <div className="relative w-full h-32 mb-3 overflow-hidden rounded-2xl bg-gray-200">
                              <CldImage src="cld-sample-5" alt="test" width={500} height={500}/>
                              <Image
                                alt={food.foodName || "Food image"}
                                fill
                                unoptimized={!!food.image?.startsWith("http")}
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

          {/* 3. Render Modal conditionally when selectedAddCategory is NOT null */}
          {selectedAddCategory && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div
                onClick={() => setSelectedAddCategory(null)}
                className="fixed inset-0 bg-slate-950/20 backdrop-blur-sm transition-opacity"
              />

              <div className="relative z-10 w-full max-w-md transform rounded-[2rem] border border-gray-100 bg-white p-6 shadow-xl transition-all">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Add new dish to {selectedAddCategory.categoryName}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedAddCategory(null)}
                    className="rounded-full p-1.5 text-gray-400 hover:bg-slate-50 hover:text-gray-700 transition"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2 flex gap-6">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Food Name
                      </label>
                      <input
                        type="text"
                        placeholder="Type food name"
                        value={foodName}
                        onChange={(e) => setFoodName(e.target.value)}
                        disabled={isSaving}
                        className="w-full rounded-2xl border px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:ring-4 focus:ring-gray-500/5 disabled:opacity-50"
                        required
                        autoFocus
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Food price
                      </label>
                      <input
                        type="text"
                        placeholder="Enter price..."
                        value={foodPrice}
                        onChange={(e) => setFoodPrice(Number(e.target.value))}
                        disabled={isSaving}
                        className="w-full rounded-2xl border px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:ring-4 focus:ring-gray-500/5 disabled:opacity-50"
                        required
                        autoFocus
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Ingredients
                    </label>
                    <input
                      type="text"
                      placeholder="List ingredients"
                      value={foodIngredients}
                      onChange={(e) => setFoodIngredients(e.target.value)}
                      disabled={isSaving}
                      className="w-full rounded-2xl border px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:ring-4 focus:ring-gray-500/5 disabled:opacity-50"
                      required
                      autoFocus
                    />
                  </div>
                  <div className="relative flex-col">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Food Image
                    </p>

                    <div className="relative h-34.5 border border-dashed rounded-xl items-center justify-cente focus:ring-4 focus:ring-gray-500/5r flex cursor-pointer">
                      {/* <input
                        type="file"
                        value={foodImage}
                        onChange={(e) => setFoodImage(e.target.value)}
                        disabled={isSaving}
                        id="imageUpload"
                        accept="image/png, image/jpeg"
                        className="w-full h-full"
                        required
                        autoFocus
                      /> */}
                      <label htmlFor="imageUpload">test</label>
                      <div className="absolute top-1/2 left-40"></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <Button
                      type="submit"
                      disabled={isSaving || !foodName.trim()}
                      className="rounded-xl bg-red-500 hover:bg-red-600 px-5 py-2 text-sm font-medium text-white shadow-sm active:scale-95 transition disabled:opacity-50"
                    >
                      {isSaving ? "Saving..." : "Add Food"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
