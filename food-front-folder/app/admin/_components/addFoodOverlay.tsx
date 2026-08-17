"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { CldImage, CldUploadButton } from "next-cloudinary";
import { Button } from "@/components/ui/button";

type Category = {
  _id: string;
  categoryName: string;
};

type AddFoodOverlayProps = {
  category: Category;
  onClose: () => void;
  onRefresh: () => Promise<void> | void;
};

export default function AddFoodOverlay({
  category,
  onClose,
  onRefresh,
}: AddFoodOverlayProps) {
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [foodName, setFoodName] = useState<string>("");
  const [foodPrice, setFoodPrice] = useState<number>(0);
  const [foodIngredients, setFoodIngredients] = useState<string>("");
  const [foodImage, setFoodImage] = useState<string>("");

  const addFood = async () => {
    const response = await fetch(`http://localhost:8000/food`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        foodName,
        category: category._id,
        price: foodPrice,
        ingredients: foodIngredients,
        image: foodImage,
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to create food");
    return data;
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName.trim()) return;

    setIsSaving(true);
    try {
      await addFood();
      await onRefresh();
      onClose();
    } catch (err: any) {
      alert(`Error adding dish: ${err.message}`);
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
            Add new dish to {category.categoryName}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-gray-400 hover:bg-slate-50 hover:text-gray-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
                Food Price ($)
              </label>
              <input
                type="number"
                placeholder="Enter price..."
                value={foodPrice || ""}
                onChange={(e) => setFoodPrice(Number(e.target.value))}
                disabled={isSaving}
                className="w-full rounded-2xl border px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:ring-4 focus:ring-gray-500/5 disabled:opacity-50"
                required
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
            />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
              Food Image
            </p>
            <div className="relative h-32 overflow-hidden border border-dashed rounded-xl flex items-center justify-center cursor-pointer">
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
                  alt="Uploaded food"
                  fill
                  sizes="(max-width: 768px) 100vw, 300px"
                />
              ) : (
                <span className="text-xs text-gray-400">
                  Click to upload image
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="submit"
              disabled={isSaving || !foodName.trim()}
              className="rounded-xl bg-red-500 hover:bg-red-600 px-5 py-2 text-sm font-medium text-white shadow-sm transition disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Add Food"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
