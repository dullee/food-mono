"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Plus, Tag, Sparkles, Pencil } from "lucide-react";

type FoodMenuItem = {
  id: string;
  name: string;
  ingredients: string;
  category: string;
  price: number;
  status: "Available" | "Out of stock";
};

const categories = ["Appetizers", "Salads", "Pasta", "Desserts", "Beverages"];

const sampleMenu: FoodMenuItem[] = [
  {
    id: "F-101",
    name: "Grilled Ribeye Steak",
    ingredients: "Past, mushroom, truffle, butter, cheese",

    category: "Main course",
    price: 42,
    status: "Available",
  },
  {
    id: "F-102",
    name: "Avocado Chicken Salad",
    ingredients: "Past, mushroom, truffle, butter, cheese",

    category: "Salads",
    price: 18,
    status: "Available",
  },
  {
    id: "F-103",
    name: "Truffle Mushroom Pasta",
    ingredients: "Past, mushroom, truffle, butter, cheese",
    category: "Pasta",
    price: 27,
    status: "Out of stock",
  },
  {
    id: "F-104",
    name: "Spicy Buffalo Wings",
    ingredients: "Past, mushroom, truffle, butter, cheese",

    category: "Appetizers",
    price: 16,
    status: "Available",
  },
];

export default function AdminFoodMenu() {
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
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <span
                  key={category}
                  className="rounded-full border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700"
                >
                  {category}
                </span>
              ))}{" "}
              <Button variant="outline" className="px-3 py-2">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-gray-200 bg-white p-5">
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>Appetizers(6)</div>
            </div>

            <div className="grid gap-4 grid-cols-4">
              <div className="group rounded-3xl border border-dashed border-[#EF4444] flex justify-center items-center bg-slate-50 p-4 transition hover:border-black">
                <div className="mt-4 flex flex-col items-center justify-between">
                  <Button
                    variant="outline"
                    className="px-3 py-2 text-xs bg-[#EF4444] text-white"
                  >
                    +
                  </Button>
                  Add new Dish to Appetizers
                </div>
              </div>

              {sampleMenu.map((item) => (
                <div
                  key={item.id}
                  className="group rounded-3xl border border-gray-200 bg-slate-50 p-4 transition hover:border-black"
                >
                  <div className="max-w-59.75 max-h-32.25 relative">
                    <Image
                      alt="food"
                      width={239}
                      height={129}
                      src={"/finger-food.jpg"}
                    />
                    <Button
                      variant="outline"
                      className="text-xs text-[#EF4444] absolute bottom-5 right-5 h-12 w-12 z-30"
                    >
                      <Pencil />
                    </Button>
                  </div>

                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-sm font-semibold text-[#EF4444]">
                      {item.name}
                    </span>{" "}
                    <span className=" text-gray-900">${item.price}</span>
                  </div>
                  <p className="text-sm">{item.ingredients}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
