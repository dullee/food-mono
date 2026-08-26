"use client";

import { CldImage } from "next-cloudinary";

import { Button } from "@/components/ui/button";
import { Check, CalendarRange, ChevronDown } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { useEffect, useState } from "react";
import { DataTable } from "./dataTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Order } from "@/app/types/order.js";


let pageNumber = 1

function SquareToggleButton() {
  const [checked, setChecked] = useState(false);

  return (
    <button
      onClick={() => setChecked(!checked)}
      className={`h-5 w-5 rounded border transition-colors flex items-center justify-center ${
        checked
          ? "bg-black text-white border-black"
          : "border-gray-300 hover:border-gray-400 bg-white"
      }`}
      aria-label="Toggle row"
    >
      {checked && <Check className="h-3.5 w-3.5 stroke-3" />}
    </button>
  );
}

// Fixed missing closing bracket and added status change handler
function StateDropdownCell({
  orderId,
  initialState,
}: {
  orderId: string;
  initialState: Order["status"];
}) {
  const [state, setState] = useState(initialState);
  const [isUpdating, setIsUpdating] = useState(false);

  const stateStyles: Record<string, string> = {
    DELIVERED: "  border-green-500 hover:bg-green-200",
    PENDING: "  border-red-600 hover:bg-red-200",
    CANCELED: " border-gray-500 hover:bg-red-200",
  };

  const options: Order["status"][] = ["PENDING", "DELIVERED", "CANCELED"];

  const handleStatusChange = async (newState: string) => {
    setState(newState);
    setIsUpdating(true);

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: orderId, status: newState }),
      });
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
          stateStyles[state] || "bg-gray-100 text-gray-800"
        }`}
      >
        {isUpdating ? "Updating..." : state}
        <ChevronDown className="h-3 w-3 opacity-60" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {options.map((opt) => (
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
} // 👈 Added missing closing bracket here!

// 2. Define the columns layout
export const columns: ColumnDef<Order>[] = [
  // Square Toggle Button
  {
    id: "toggle",
    header: "Label",
    cell: () => <SquareToggleButton />,
  },
  // Row Number
  {
    id: "number",
    header: "№",
    cell: ({ row }) => (
      <span className="font-medium text-gray-500">{row.index + 1}</span>
    ),
  },
  // Customer Email
  {
    accessorKey: "user.email",
    header: "Customer",
    cell: ({ row }) => (
      <span className="font-medium text-gray-900">
        {row.original.user?.email || "Guest"}
      </span>
    ),
  },
  // Food Count + Dropdown Details
  {
    id: "foodOrderItems",
    header: "Food",
    cell: ({ row }) => {
      const foodItems = row.original.foodOrderItems || [];

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
                      src={item.food?.image}
                      sizes="36px"
                    />
                  </div>

                  {/* Food Name */}
                  <span className="truncate font-medium">
                    {item.food?.foodName || "Item"}
                  </span>
                </div>

                {/* Quantity */}
                <span className="font-semibold text-gray-500 shrink-0">
                  x{item.quantity}
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
  // Date
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => {
      const dateStr = row.original.createdAt;
      if (!dateStr) return <span className="text-gray-400">N/A</span>;
      return (
        <span className="text-xs text-gray-600">
          {new Date(dateStr).toLocaleDateString()}
        </span>
      );
    },
  },
  // Total Price
  {
    accessorKey: "totalPrice",
    header: "Total",
    cell: ({ row }) => {
      const amount = row.original.totalPrice || 0;
      return <span className="font-medium">${amount.toFixed(2)}</span>;
    },
  },
  // Delivery Address
  {
    accessorKey: "user.address",
    header: "Delivery Address",
    cell: ({ row }) => (
      <span className="text-gray-600 max-w-55 truncate block">
        {row.original.user?.address || "No address provided"}
      </span>
    ),
  },
  // Delivery State Dropdown Button
  {
    accessorKey: "status",
    header: "Delivery State",
    cell: ({ row }) => (
      <StateDropdownCell
        orderId={row.original._id}
        initialState={row.original.status}
      />
    ),
  },
];

export default function AdminOrderInfo() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order`);
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error("Database connection error via backend", err);
        setError("Express server is offline.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div>
      <div className="p-4 flex justify-between items-center">
        <div className="flex flex-col">
          <h1 className="text-xl font-bold">Orders</h1>
          <h3 className="text-sm text-gray-500">{orders.length} items</h3>
        </div>
        <div className="flex gap-3">
          <Button variant={"outline"} className={"px-4 py-2"}>
            <CalendarRange className="mr-2 h-4 w-4" /> 13 June 2023 - 14 July
            2023
          </Button>
          <Button>Change delivery state</Button>
        </div>
      </div>
      <div className="flex flex-col">
        {isLoading && (
          <p className="text-sm justify-center flex text-gray-400 py-8">
            Loading orders...
          </p>
        )}
        {error && <p className="text-sm text-red-500 py-4 px-4">{error}</p>}
        {!isLoading && !error && <DataTable columns={columns} data={orders} />}
      </div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              {pageNumber}
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
