"use client";

import { useState, useRef, DragEventHandler } from "react";
import { X, Image } from "lucide-react";
import { CldImage } from "next-cloudinary";
import { Button } from "@/components/ui/button";

// Add your actual Cloudinary values here or use process.env references
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

type Category = {
  _id: string;
  categoryName: string;
};

type AddFoodOverlayProps = {
  category: Category;
  onClose: () => void;
  onRefresh: () => Promise<void> | void;
};

export default function AddFoodOverlay2({
  category,
  onClose,
  onRefresh,
}: AddFoodOverlayProps) {
  const [isDragActive, setIsDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null); // Reference to trigger hidden input
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
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

  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "testing");

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await response.json();
      console.log(data);

      return data.secure_url;
    } catch (error) {
      console.error("Cloudinary upload failed:", error);
      throw error;
    }
  };

  const handleLogoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const url = await uploadToCloudinary(file);
      if (url) {
        setFoodImage(url);
      }
    } catch (err) {
      alert("Failed to upload image. Make sure your preset is unsigned!");
      console.log("Failed to upload logo: " + err);
    } finally {
      setUploading(false);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
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

            {/* Hidden native input handler */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleLogoUpload}
              accept="image/*"
              className="hidden"
            />

            {/* Clickable Card Container */}
            <div
              // onDragOver={handleDragOver}
              // onDragLeave={handleDragLeave}
              // onDrop={handleDrop}
              onClick={triggerFileSelect}
              className="relative h-32 bg-[#2563EB]/5  overflow-hidden border border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition"
            >
              {uploading ? (
                <span className="text-xs text-gray-500 animate-pulse">
                  Uploading file to cloud...
                </span>
              ) : foodImage ? (
                <>
                  <CldImage
                    className="object-cover"
                    src={foodImage} // CldImage handles full URLs or Public IDs automatically
                    alt="Uploaded food"
                    fill
                    sizes="(max-width: 768px) 100vw, 300px"
                  />
                  <Button
                    variant={"outline"}
                    onClick={(e) => {
                      e.stopPropagation(); // prevents event from traveling down
                      setFoodImage("");
                    }}
                    className={"absolute  right-2 top-2 w-9 h-9 rounded-full"}
                  >
                    <X size={16} />
                  </Button>
                </>
              ) : (
                <div className="flex flex-col items-center gap-1">
                  <div className="rounded-full p-2 bg-white">
                    <Image size={16} />
                  </div>

                  <span className="text-xs">
                    Choose a file or drag & drop it here
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="submit"
              disabled={isSaving || uploading || !foodName.trim()}
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
