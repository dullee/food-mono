"use client";

import { useState, useEffect } from "react";
import { X, Trash } from "lucide-react";
import { CldImage, CldUploadButton } from "next-cloudinary";
import { Button } from "@/components/ui/button";

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

type EditFoodOverlayProps = {
  food: Food;
  categories: Category[];
  onClose: () => void;
  onRefresh: () => Promise<void> | void;
};

export default function EditFoodOverlay({
  food,
  categories,
  onClose,
  onRefresh,
}: EditFoodOverlayProps) {
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Initialize state directly from passed prop
  const [foodName, setFoodName] = useState<string>(food.foodName || "");
  const [foodPrice, setFoodPrice] = useState<number>(food.price || 0);
  const [foodIngredients, setFoodIngredients] = useState<string>(
    food.ingredients || "",
  );
  const [foodCategoryId, setFoodCategoryId] = useState<string>(
    food.category?._id || "",
  );
  const [foodImage, setFoodImage] = useState<string>(food.image || "");

  // Update state if selected food prop changes
  useEffect(() => {
    setFoodName(food.foodName || "");
    setFoodPrice(food.price || 0);
    setFoodIngredients(food.ingredients || "");
    setFoodCategoryId(food.category?._id || "");
    setFoodImage(food.image || "");
  }, [food]);

  const patchFood = async () => {
    const response = await fetch(`http://localhost:8000/food`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        _id: food._id,
        foodName,
        category: foodCategoryId,
        price: foodPrice,
        ingredients: foodIngredients,
        image: foodImage,
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to update food");
    return data;
  };

  const deleteFood = async (_id: string) => {
    const response = await fetch(`http://localhost:8000/food/${_id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to delete food");
    return data;
  };

  const handleEditChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName.trim() || !foodCategoryId) return;

    setIsSaving(true);
    try {
      await patchFood();
      await onRefresh();
      onClose();
    } catch (err: any) {
      alert(`Error updating food: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${food.foodName}?`))
      return;

    setIsSaving(true);
    try {
      await deleteFood(food._id);
      await onRefresh();
      onClose();
    } catch (err: any) {
      alert(`Error deleting food: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/20 backdrop-blur-sm transition-opacity"
      />
      <div className="relative z-10 w-full max-w-md transform rounded-[2rem] border border-gray-100 bg-white p-6 shadow-xl transition-all">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Edit {food.foodName}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-gray-400 hover:bg-slate-50 hover:text-gray-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleEditChanges} className="space-y-4">
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Dish Name
              </label>
              <input
                type="text"
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                disabled={isSaving}
                className="w-full rounded-2xl border px-4 py-3 text-sm text-gray-900 outline-none transition focus:ring-4 focus:ring-gray-500/5 disabled:opacity-50"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Dish Category
              </label>
              <select
                value={foodCategoryId}
                onChange={(e) => setFoodCategoryId(e.target.value)}
                disabled={isSaving}
                className="w-full rounded-2xl border px-4 py-3 text-sm text-gray-900 bg-white outline-none transition focus:ring-4 focus:ring-gray-500/5 disabled:opacity-50"
                required
              >
                <option value="" disabled>
                  Select a category
                </option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.categoryName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Food Price ($)
              </label>
              <input
                type="number"
                value={foodPrice}
                onChange={(e) => setFoodPrice(Number(e.target.value))}
                disabled={isSaving}
                className="w-full rounded-2xl border px-4 py-3 text-sm text-gray-900 outline-none transition focus:ring-4 focus:ring-gray-500/5 disabled:opacity-50"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Ingredients
              </label>
              <input
                type="text"
                value={foodIngredients}
                onChange={(e) => setFoodIngredients(e.target.value)}
                disabled={isSaving}
                className="w-full rounded-2xl border px-4 py-3 text-sm text-gray-900 outline-none transition focus:ring-4 focus:ring-gray-500/5 disabled:opacity-50"
                required
              />
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
              Image
            </p>
            <div className="relative w-full h-36 overflow-hidden border border-dashed rounded-xl flex items-center justify-center cursor-pointer">
              <CldUploadButton
                className="w-full h-full cursor-pointer z-10 absolute opacity-0"
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                onSuccess={(result: any) => {
                  if (result?.info?.secure_url) {
                    setFoodImage(result.info.secure_url);
                  }
                }}
              />
              {foodImage ? (
                <CldImage
                  className="z-0 object-cover"
                  src={foodImage}
                  alt="Food preview"
                  fill
                  sizes="(max-width: 768px) 100vw, 300px"
                />
              ) : (
                <span className="text-xs text-gray-400">
                  Click to upload new image
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 pt-2">
            <Button
              type="button"
              onClick={handleDelete}
              disabled={isSaving}
              className="rounded-xl bg-white hover:bg-red-50 border border-red-500 px-4 py-2 text-red-500 transition disabled:opacity-50"
            >
              <Trash className="h-4 w-4" />
            </Button>
            <Button
              type="submit"
              disabled={isSaving || !foodName.trim()}
              className="rounded-xl bg-red-500 hover:bg-red-600 px-5 py-2 text-sm font-medium text-white shadow-sm transition disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
