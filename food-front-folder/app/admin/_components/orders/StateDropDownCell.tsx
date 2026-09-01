"use client";

import { useState } from "react";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
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
        className={`h-7 px-2.5 rounded-full text-xs font-semibold text-black border flex items-center gap-2.5 transition-colors ${
          STATE_STYLES[initialState] || "bg-gray-100 text-gray-800"
        }`}
      >
        {isUpdating
          ? "Updating..."
          : initialState.charAt(0) + initialState.slice(1).toLowerCase()}

        <ChevronsUpDown size={16} />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className={"flex flex-col w-36 px-1 py-3 gap-4 text-xs rounded-md "}
      >
        <Button
          onClick={() => handleStatusChange("DELIVERED")}
          variant={"secondary"}
          className={"w-18.75 h-5 ml-2 text-xs"}
        >
          Delivered
        </Button>
        <Button
          onClick={() => handleStatusChange("PENDING")}
          variant={"secondary"}
          className={"w-18.75 h-5 ml-2 text-xs"}
        >
          Pending
        </Button>
        <Button
          onClick={() => handleStatusChange("CANCELLED")}
          variant={"secondary"}
          className={"w-18.75 h-5 ml-2 text-xs"}
        >
          Cancelled
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
