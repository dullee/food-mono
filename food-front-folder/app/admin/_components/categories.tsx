"use client"; // Required for client-side hooks like useEffect and useState

import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type Category = {
  _id: string;
  categoryName: string;
  createdAt?: string;
  updatedAt?: string;
};

type Food = {
  _id: string;
  foodName: string;
  category: Category;
};
interface CategoriesProps {
  onCategoryAdded: () => void;
  onSelectedCategory: (value: string) => void;
}
export default function Categories({
  onCategoryAdded,
  onSelectedCategory,
}: CategoriesProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [foods, setFoods] = useState<Food[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [categoryName, setCategoryName] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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

        setCategories(catData);
        setFoods(foodData);
      } catch (err) {
        console.error("Database connection error via backend:", err);
        setError("Express server is offline.");
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const getFoodLength = (categoryId: string) => {
    return foods?.filter((food) => food.category._id === categoryId).length;
  };

  const selectCategoryFilter = (categoryId: string) => {
    if (selectedCategory !== categoryId) {
      setSelectedCategory(categoryId);
      onSelectedCategory(categoryId);
    }
  };
  // ----------------------------------Test----------------------------------
  // const handleDeleteCategory = async (id: string) => {
  //   try {
  //     const response = await fetch(`http://localhost:8000/category/${id}`, {
  //       method: "DELETE",
  //     });

  //     const data = await response.json();

  //     if (!response.ok) {
  //       throw new Error(data.message || "Failed to delete category");
  //     }

  //     setCategories((prev) => prev.filter((cat) => cat._id !== id));
  //     onCategoryAdded();
  //   } catch (err: any) {
  //     alert(`Error: ${err.message}`);
  //   }
  // };

  const handleCreateCategory = async (name: string) => {
    try {
      const response = await fetch(`http://localhost:8000/category`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          categoryName: name,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create category");
      }

      return data.category;
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    setIsSaving(true);
    try {
      const newCategory = await handleCreateCategory(categoryName);

      onCategoryAdded();
      setCategoryName("");
      setIsOpen(false);
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      {isLoading && (
        <p className="text-sm text-gray-400">Loading categories...</p>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}

      {!isLoading && !error && (
        <div className="flex flex-wrap items-start gap-2">
          <Button
            variant={"outline"}
            className={!selectedCategory ? "border-red-500" : ""}
            onClick={() => selectCategoryFilter("")}
          >
            All dishes{" "}
            <span className="rounded-full bg-black text-white px-2.5 py-0.5 text-xs">
              {foods.length}
            </span>
          </Button>
          {categories.map((category) => (
            <Button
              className={
                selectedCategory === category._id ? "border-red-500" : ""
              }
              key={category._id}
              variant={"outline"}
              onClick={() => selectCategoryFilter(category._id)}
            >
              {category.categoryName}
              <span className="rounded-full bg-black text-white px-2.5 py-0.5 text-xs">
                {getFoodLength(category._id)}
              </span>
              {/* <button
                onClick={() => handleDeleteCategory(category._id)}
                className="rounded-full p-0.5 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                title="Delete Category"
              >
                <Trash2 className="h-3 w-3" />
              </button> */}
            </Button>
          ))}
          <div className="">
            <Button
              onClick={() => setIsOpen(true)}
              variant="outline"
              className="w-9 h-9 bg-[#EF4444] text-white rounded-full hover:bg-slate-50"
            >
              <Plus className="h-4 w-4" />
            </Button>

            {isOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                  onClick={() => setIsOpen(false)}
                  className="fixed inset-0 bg-slate-950/20 backdrop-blur-sm transition-opacity"
                />

                <div className="relative z-10 w-full max-w-md transform rounded-[2rem] border border-gray-100 bg-white p-6 shadow-xl transition-all">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Add New Category
                      </h3>
                    </div>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="rounded-full p-1.5 text-gray-400 hover:bg-slate-50 hover:text-gray-700 transition"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Form Body: Holds inputs and action triggers */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Category Name
                      </label>
                      <input
                        type="text"
                        placeholder="Type category name"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        disabled={isSaving}
                        className="w-full rounded-2xl border bg-slate-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition   focus:ring-4 focus:ring-red-500/5 disabled:opacity-50"
                        required
                        autoFocus
                      />
                    </div>

                    {/* Footer: Grouped confirmation actions */}
                    <div className="flex items-center justify-end gap-2 pt-2">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setIsOpen(false)}
                        disabled={isSaving}
                        className="rounded-xl px-4 py-2 text-sm text-gray-500 hover:bg-slate-50"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSaving || !categoryName.trim()}
                        className="rounded-xl  px-5 py-2 text-sm font-medium text-white  shadow-sm active:scale-95 transition disabled:opacity-50"
                      >
                        {isSaving ? "Saving..." : "Add Category"}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
