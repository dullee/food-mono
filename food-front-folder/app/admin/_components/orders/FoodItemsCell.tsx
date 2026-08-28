"use client";

import { CldImage } from "next-cloudinary";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Order } from "@/app/types/order.js";

const FALLBACK_IMAGE =
  "https://res.cloudinary.com/q36xcdm5/image/upload/v1785501876/cld-sample-4.jpg";

export function FoodItemsCell({ order }: { order: Order }) {
  const foodItems = order.foodOrderItems || [];
  const totalCount = foodItems.reduce(
    (acc, item) => acc + (item.quantity || 0),
    0,
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="h-8 px-3 rounded-md hover:bg-gray-100 text-xs font-medium flex items-center gap-1.5 transition-colors">
        <span>{totalCount} foods</span>
        <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {foodItems.map((item, idx) => (
          <DropdownMenuItem
            key={idx}
            className="flex items-center justify-between gap-3 text-xs p-2 cursor-pointer"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-md bg-gray-100">
                <CldImage
                  alt={item.food?.foodName || "Food image"}
                  fill
                  className="object-cover"
                  src={item.food?.image || FALLBACK_IMAGE}
                  sizes="36px"
                />
              </div>
              <span className="truncate font-medium">
                {item.food?.foodName || "Item"}
              </span>
            </div>
            <span className="font-semibold text-gray-500 shrink-0">
              x{item.quantity}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
