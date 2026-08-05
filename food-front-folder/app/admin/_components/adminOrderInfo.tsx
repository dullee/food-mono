"use client";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";

import { Check, CalendarRange, ChevronDown } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { DataTable } from "./dataTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type DeliveryOrder = {
  id: string;
  customerEmail: string;
  foodItems: { name: string; quantity: number }[];
  date: string;
  total: number;
  deliveryAddress: string;
  deliveryState: "Pending" | "In Transit" | "Delivered" | "Cancelled";
};

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
      {checked && <Check className="h-3.5 w-3.5 stroke-[3]" />}
    </button>
  );
}

function StateDropdownCell({
  initialState,
}: {
  initialState: DeliveryOrder["deliveryState"];
}) {
  const [state, setState] = useState(initialState);

  const stateStyles: Record<DeliveryOrder["deliveryState"], string> = {
    Delivered:
      "bg-green-100 text-green-800 border-green-200 hover:bg-green-200",
    "In Transit": "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200",
    Pending: "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200",
    Cancelled: "bg-red-100 text-red-800 border-red-200 hover:bg-red-200",
  };

  const options: DeliveryOrder["deliveryState"][] = [
    "Pending",
    "In Transit",
    "Delivered",
    "Cancelled",
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={`h-7 px-2.5 rounded-full text-xs font-medium border flex items-center gap-1 transition-colors ${stateStyles[state]}`}
      >
        {state}
        <ChevronDown className="h-3 w-3 opacity-60" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {options.map((opt) => (
          <DropdownMenuItem
            key={opt}
            onClick={() => setState(opt)}
            className="text-xs font-medium cursor-pointer"
          >
            {opt}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// 2. Define the columns layout
export const columns: ColumnDef<DeliveryOrder>[] = [
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
    accessorKey: "customerEmail",
    header: "Customer",
    cell: ({ row }) => (
      <span className="font-medium text-gray-900">
        {row.getValue("customerEmail")}
      </span>
    ),
  },
  // Food Count + Dropdown Details
  {
    id: "food",
    header: "Food",
    cell: ({ row }) => {
      const foodItems = row.original.foodItems;
      const totalCount = foodItems.reduce(
        (acc, item) => acc + item.quantity,
        0,
      );

      return (
        <DropdownMenu>
          <DropdownMenuTrigger className="h-8 px-3 rounded-md border border-gray-200 hover:bg-gray-100 text-xs font-medium flex items-center gap-1.5 transition-colors bg-white shadow-sm">
            <span>{totalCount} items</span>
            <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            {foodItems.map((item, idx) => (
              <DropdownMenuItem
                key={idx}
                className="flex justify-between text-xs"
              >
                <span>{item.name}</span>
                <span className="font-semibold text-gray-500">
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
    accessorKey: "date",
    header: "Date",
  },
  // Total Price
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("total"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <span className="font-medium">{formatted}</span>;
    },
  },
  // Delivery Address
  {
    accessorKey: "deliveryAddress",
    header: "Delivery Address",
    cell: ({ row }) => (
      <span className="text-gray-600 max-w-[220px] truncate block">
        {row.getValue("deliveryAddress")}
      </span>
    ),
  },
  // Delivery State Dropdown Button
  {
    accessorKey: "deliveryState",
    header: "Delivery State",
    cell: ({ row }) => (
      <StateDropdownCell initialState={row.getValue("deliveryState")} />
    ),
  },
];

// 3. Sample Data
const sampleOrders: DeliveryOrder[] = [
  {
    id: "ORD-101",
    customerEmail: "alex.johnson@gmail.com",
    foodItems: [
      { name: "Double Cheese Burger", quantity: 2 },
      { name: "French Fries", quantity: 1 },
      { name: "Coca Cola", quantity: 2 },
    ],
    date: "2026-08-04",
    total: 22.5,
    deliveryAddress: "742 Evergreen Terrace, Springfield",
    deliveryState: "In Transit",
  },
  {
    id: "ORD-102",
    customerEmail: "sarah.connor@cyberdyne.com",
    foodItems: [
      { name: "Pepperoni Pizza (Large)", quantity: 1 },
      { name: "Garlic Breadsticks", quantity: 1 },
    ],
    date: "2026-08-04",
    total: 28.0,
    deliveryAddress: "100 Ocean Drive, Suite 4B",
    deliveryState: "Delivered",
  },
  {
    id: "ORD-103",
    customerEmail: "m.scott@dundermifflin.com",
    foodItems: [{ name: "Chicken Alfredo Pasta", quantity: 1 }],
    date: "2026-08-03",
    total: 18.75,
    deliveryAddress: "1725 Slough Avenue, Scranton",
    deliveryState: "Pending",
  },
];

export default function AdminOrderInfo() {
  return (
    <div>
      <div className="p-4 flex justify-between">
        <div className="flex flex-col">
          <h1>Orders</h1>
          <h3>32 items</h3>
        </div>
        <div className="flex gap-3">
          <Button variant={"outline"} className={"px-4 py-2"}>
            <CalendarRange /> 13 June 2023 - 14 July 2023
          </Button>
          <Button>Change delivery state</Button>
        </div>
      </div>
      <div className="flex flex-col">
        <DataTable columns={columns} data={sampleOrders} />
      </div>
    </div>
  );
}
