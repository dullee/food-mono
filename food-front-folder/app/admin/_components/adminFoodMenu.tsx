"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react"; // Added Trash2 icon for deletion
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
          <Categories/>
          </div>
        </div>


        <div className="space-y-6">
          <div className="rounded-3xl border border-gray-200 bg-white p-5">
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="font-semibold text-gray-800">Appetizers (6)</div>
            </div>

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
              <div className="group rounded-3xl border border-dashed border-red-400 flex flex-col justify-center items-center bg-slate-50 p-4 transition hover:border-black cursor-pointer min-h-[220px]">
                <Button
                  variant="outline"
                  className="px-3 py-2 text-xs bg-red-500 text-white rounded-full mb-2 hover:bg-red-600"
                >
                  +
                </Button>
                <span className="text-sm text-gray-600 font-medium">
                  Add new Dish to Appetizers
                </span>
              </div>

              {sampleMenu.map((item) => (
                <div
                  key={item.id}
                  className="group rounded-3xl border border-gray-200 bg-slate-50 p-4 transition hover:border-black"
                >
                  <div className="relative w-full h-32 mb-3 overflow-hidden rounded-2xl">
                    <Image
                      alt="food"
                      fill
                      className="object-cover"
                      src="/finger-food.jpg"
                    />
                    <Button
                      variant="outline"
                      className="text-xs text-red-500 absolute bottom-3 right-3 h-9 w-9 p-0 bg-white/90 backdrop-blur-sm z-30 shadow-sm rounded-xl hover:bg-white"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-semibold text-red-500 truncate max-w-[150px]">
                      {item.name}
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      ${item.price}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {item.ingredients}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
