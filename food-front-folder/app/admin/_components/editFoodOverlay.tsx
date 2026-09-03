"use client";

import { useState, useEffect, useRef } from "react";
import { X, Trash } from "lucide-react";
import { CldImage } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { Food } from "@/app/types/food";
import { Category } from "@/app/types/category.js";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

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
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  const [dragOverUpload, setDragOverUpload] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);

  // Update state if selected food prop changes
  useEffect(() => {
    setFoodName(food.foodName || "");
    setFoodPrice(food.price || 0);
    setFoodIngredients(food.ingredients || "");
    setFoodCategoryId(food.category?._id || "");
    setFoodImage(food.image || "");
    const stopGlobalDrop = (e: globalThis.DragEvent) => {
      e.preventDefault();
    };

    window.addEventListener("dragover", stopGlobalDrop, true);
    window.addEventListener("drop", stopGlobalDrop, true);

    return () => {
      window.removeEventListener("dragover", stopGlobalDrop, true);
      window.removeEventListener("drop", stopGlobalDrop, true);
    };
  }, [food]);

  const patchFood = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/food`, {
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
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/food/${_id}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      },
    );

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

  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", `${UPLOAD_PRESET}`);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Cloudinary upload failed:", error);
      throw error;
    }
  };

  const processAndUploadFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file.");
      return;
    }
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

  const handleLogoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await processAndUploadFile(file);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation(); // CRITICAL: Keeps event execution scoped strictly inside this component
    setDragOverUpload(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation(); // CRITICAL
    setDragOverUpload(false);
  };

  const handleDragDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation(); // CRITICAL: Stop browser from handling the drop natively
    setDragOverUpload(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processAndUploadFile(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/20 transition-opacity"
      />
      <div className="relative z-10 w-118 transform rounded-md border border-gray-100 bg-white p-6 shadow-xl transition-all">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Dishes info</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-[#71717A] hover:bg-slate-50 hover:text-gray-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleEditChanges} className="flex flex-col gap-3">
          <div>
            <div className="flex justify-between py-3">
              <label className="text-xs  uppercase tracking-wider text-[#71717A]">
                Dish Name
              </label>
              <input
                type="text"
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                disabled={isSaving}
                className="w-[288px] rounded-md border px-3 py-2 text-sm text-gray-900 outline-none transition focus:ring-4 focus:ring-gray-500/5 disabled:opacity-50"
                required
              />
            </div>

            <div className="flex justify-between py-3">
              <label className="text-xs  uppercase tracking-wider text-[#71717A]">
                Dish Category
              </label>
              <Select
                value={foodCategoryId}
                onValueChange={(val) => setFoodCategoryId(val || "")}
                disabled={isSaving}
                required
              >
                <SelectTrigger className="w-[288px] focus:ring-4 ring-1 ring-gray-500/9  focus:ring-gray-500/5 rounded-md border px-4 py-3 text-sm text-gray-900 bg-white">
                  <SelectValue placeholder="Select a category">
                    {
                      categories.find(
                        (c) => String(c._id) === String(foodCategoryId),
                      )?.categoryName
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent
                  align="start"
                  alignItemWithTrigger={false}
                  className={"rounded-md max-w-20 "}
                >
                  {categories.map((cat) => (
                    <SelectItem key={cat._id} value={cat._id} className={"p-2"}>
                      <p className=" bg-[#F4F4F5] py-0.5 pl-2.5 w-29 rounded-2xl">
                        {cat.categoryName}
                      </p>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-between py-3">
              <label className="text-xs  uppercase tracking-wider text-[#71717A]">
                Ingredients
              </label>
              <input
                type="text"
                value={foodIngredients}
                onChange={(e) => setFoodIngredients(e.target.value)}
                disabled={isSaving}
                className=" rounded-md w-[288px] border px-4 py-3 text-sm text-gray-900 outline-none transition focus:ring-4 focus:ring-gray-500/5 disabled:opacity-50"
                required
              />
            </div>

            <div className="flex justify-between py-3">
              <label className="text-xs  uppercase tracking-wider text-[#71717A]">
                Food Price ($)
              </label>
              <input
                type="number"
                value={foodPrice}
                onChange={(e) => setFoodPrice(Number(e.target.value))}
                disabled={isSaving}
                className=" rounded-md w-[288px] border px-4 py-3 text-sm text-gray-900 outline-none transition focus:ring-4 focus:ring-gray-500/5 disabled:opacity-50"
                required
              />
            </div>
            <div className="flex justify-between py-3">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleLogoUpload}
                accept="image/*"
                className="hidden"
              />
              <p className="text-xs  uppercase tracking-wider text-[#71717A]">
                Image
              </p>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDragDrop}
                onClick={triggerFileSelect}
                className={`relative w-[288px] h-29 overflow-hidden border border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition ${
                  dragOverUpload
                    ? "border-blue-500 bg-blue-50/50 scale-[0.98]"
                    : "border-gray-300 bg-blue-600/5 hover:border-gray-400 hover:bg-gray-50"
                }`}
              >
                <div className="relative w-full h-36 overflow-hidden border border-dashed rounded-xl flex items-center justify-center cursor-pointer">
                  {uploading ? (
                    <span className="text-xs text-gray-500 animate-pulse">
                      Uploading file to cloud...
                    </span>
                  ) : foodImage ? (
                    <div className="relative w-full h-full">
                      <CldImage
                        className="object-cover"
                        src={foodImage}
                        alt="Uploaded food"
                        sizes="w-100 h-30"
                        fill
                      />
                      <Button
                        onClick={(e) => {
                          e.stopPropagation(); // prevents event from traveling down
                          setFoodImage("");
                        }}
                        variant={"outline"}
                        className="absolute top-2 right-2 rounded-full p-2 bg-white w-9 h-9"
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  ) : (
                    <span className="text-xs">
                      {dragOverUpload
                        ? "Drop here!"
                        : "Click or drag image file"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 pt-6">
            <Button
              type="button"
              onClick={handleDelete}
              disabled={isSaving}
              className="rounded-md bg-white hover:bg-red-50 border border-red-500 px-4 py-3 text-red-500 transition disabled:opacity-50"
            >
              <Trash className="h-4 w-4" size={16} />
            </Button>
            <Button
              type="submit"
              disabled={isSaving || !foodName.trim()}
              className="rounded-md px-4 py-2.5 text-sm font-medium text-white shadow-sm transition disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
