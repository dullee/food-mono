"use client"; // Required for client-side hooks like useEffect and useState

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import AddCategory from "./addCategory";

interface Category {
  _id: string;
  categoryName: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:8000/category");
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Database connection error via backend:", err);
        setError("Express server is offline.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the category "${name}"?`))
      return;

    try {
      const response = await fetch(`http://localhost:8000/category/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete category");
      }

      setCategories((prev) => prev.filter((cat) => cat._id !== id));
      alert("Category deleted successfully");
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };



  // 2. Fixed layout structure: Wrapped everything in a single React Fragment (<> ... </>)
  return (
    <>
      {isLoading && (
        <p className="text-sm text-gray-400">Loading categories...</p>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}

      {!isLoading && !error && (
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <span
              key={category._id}
              className="group/badge inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white pl-3 pr-2 py-1 text-sm text-gray-700 transition hover:bg-slate-100"
            >
              {category.categoryName}
              <button
                onClick={() =>
                  handleDeleteCategory(category._id, category.categoryName)
                }
                className="rounded-full p-0.5 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                title="Delete Category"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </span>
          ))}
          <AddCategory/>

        </div>
      )}
    </>
  );
}
