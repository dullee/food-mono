"use client";

import { useState } from "react";
import { Plus, X, FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AddCategory() {
  // 1. Control the toggle visibility state
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [categoryName, setCategoryName] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    const form = e.target;
    console.log(form);


    setIsSaving(true);

    handleCreateCategory("name");
    console.log("Saving item:", categoryName);

    setTimeout(() => {
      setIsSaving(false);
      setCategoryName("");
      setIsOpen(false); // Close the menu on complete success
    }, 800);
  };

  const handleCreateCategory = async (name: string) => {
    try {
      const response = await fetch(`http://localhost:8000/category/`, {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete category");
      }

      alert("Category added successfully");
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div className="p-4">
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="px-3 py-2 h-auto rounded-full hover:bg-slate-50"
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
  );
}
