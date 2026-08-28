"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Order } from "@/app/types/order.js";

export const STATUS_OPTIONS: Order["status"][] = [
  "PENDING",
  "DELIVERED",
  "CANCELED",
];

const STATE_STYLES: Record<string, string> = {
  DELIVERED: "border-green-500 hover:bg-green-200",
  PENDING: "border-red-600 hover:bg-red-200",
  CANCELED: "border-gray-500 hover:bg-red-200",
};

export function StateDropdownCell({
  orderId,
  initialState,
  onStatusUpdated,
}: {
  orderId: string;
  initialState: Order["status"];
  onStatusUpdated: (id: string, newStatus: Order["status"]) => void;
}) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newState: Order["status"]) => {
    setIsUpdating(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: orderId, status: newState }),
      });
      onStatusUpdated(orderId, newState);
    } catch (err) {
      console.error("Failed to update status on server:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={isUpdating}
        className={`h-7 px-2.5 rounded-full text-xs font-medium border flex items-center gap-1 transition-colors ${
          STATE_STYLES[initialState] || "bg-gray-100 text-gray-800"
        }`}
      >
        {isUpdating ? "Updating..." : initialState}
        <ChevronDown className="h-3 w-3 opacity-60" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {STATUS_OPTIONS.map((opt) => (
          <DropdownMenuItem
            key={opt}
            onClick={() => handleStatusChange(opt)}
            className="text-xs font-medium cursor-pointer"
          >
            {opt}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}