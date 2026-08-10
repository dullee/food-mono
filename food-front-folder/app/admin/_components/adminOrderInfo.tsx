"use client";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";

import { Check, CalendarRange, ChevronDown } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { DataTable } from "./dataTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FoodOrderItemsProps {
  food: { _id: string; foodName: string };
  quantity: number;
}

interface UserProps {
  _id: string;
  email: string;
  password: string;
  phoneNumber: string;
  address: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface OrderProps {
  _id: string;
  user: UserProps;
  totalPrice: Number;
  foodOrderItems: FoodOrderItemsProps[];
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

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
  initialState: OrderProps["status"];
}) {
  const [state, setState] = useState(initialState);

  const stateStyles: Record<string, string> = {
    DELIVERED:
      "bg-green-100 text-green-800 border-green-200 hover:bg-green-200",
    IN_TRANSIT: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200",
    PENDING: "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200",
    CANCELED: "bg-red-100 text-red-800 border-red-200 hover:bg-red-200",
  };

  const options: OrderProps["status"][] = [
    "PENDING",
    "IN_TRANSIT",
    "DELIVERED",
    "CANCELED",
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
const sampleOrders: OrderProps[] = [
  {
    _id: "6a79719559e4958a07ceb266",
    user: {
      _id: "6a74052c0cebb0f4dbc2565c",
      email: "funny@gmail.com",
      password: "123456",
      phoneNumber: "90484372",
      address: "ulaanbaatar",
      role: "USER",
      isVerified: false,
      createdAt: "2026-08-06T03:53:16.330Z",
      updatedAt: "2026-08-08T09:16:37.049Z",
    },
    totalPrice: 500,
    foodOrderItems: [
      {
        food: { _id: "1" },
        quantity: 2,
      },
    ],
    status: "PENDING",
    createdAt: "2026-08-10T06:37:09.511Z",
    updatedAt: "2026-08-10T06:37:09.511Z",
  },
  // {
  //   _id: "ORD-102",
  //   customerEmail: "sarah.connor@cyberdyne.com",
  //   foodItems: [
  //     { name: "Pepperoni Pizza (Large)", quantity: 1 },
  //     { name: "Garlic Breadsticks", quantity: 1 },
  //   ],
  //   date: "2026-08-04",
  //   total: 28.0,
  //   deliveryAddress: "100 Ocean Drive, Suite 4B",
  //   deliveryState: "Delivered",
  // },
  // {
  //   _id: "ORD-103",
  //   customerEmail: "m.scott@dundermifflin.com",
  //   foodItems: [{ name: "Chicken Alfredo Pasta", quantity: 1 }],
  //   date: "2026-08-03",
  //   total: 18.75,
  //   deliveryAddress: "1725 Slough Avenue, Scranton",
  //   deliveryState: "Pending",
  // },
];
// 2. Define the columns layout
export const columns: ColumnDef<OrderProps>[] = [
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
        {row.original.user?.email || "N/A"}
      </span>
    ),
  },
  // Food Count + Dropdown Details
  {
    id: "foodOrderItems",
    header: "Food",
    cell: ({ row }) => {
      const foodItems = row.original.foodOrderItems;

      const totalCount = foodItems.reduce(
        (acc, item) => acc + item.quantity,
        0,
      );

      return (
        <DropdownMenu>
          <DropdownMenuTrigger className="h-8 px-3 rounded-md hover:bg-gray-100 text-xs font-medium flex items-center gap-1.5 transition-colors ">
            <span>{totalCount} foods</span>
            <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            {foodItems.map((item, idx) => (
              <DropdownMenuItem
                key={idx}
                className="flex justify-between text-xs"
              >
                <span>{item["food"].foodName}</span>
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
    accessorKey: "createdAt",
    header: "Date",
  },
  // Total Price
  {
    accessorKey: "totalPrice",
    header: "Total",
    cell: ({ row }) => {
      const amount = row.original.totalPrice;

      return <span className="font-medium">${String(amount)}</span>;
    },
  },
  // Delivery Address
  {
    accessorKey: "user.address",
    header: "Delivery Address",
    cell: ({ row }) => (
      <span className="text-gray-600 max-w-[220px] truncate block">
        {row.original.user.address}
      </span>
    ),
  },
  // Delivery State Dropdown Button
  {
    accessorKey: "status",
    header: "Delivery State",
    cell: ({ row }) => <StateDropdownCell initialState={row.original.status} />,
  },
];

export default function AdminOrderInfo() {
  const [orders, setOrders] = useState<OrderProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("http://localhost:8000/order");
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
        {isLoading && (
          <p className="text-sm justify-center flex text-gray-400">
            Loading categories...
          </p>
        )}
        {error && <p className="text-sm text-red-500">{error}</p>}
        {!isLoading && !error && <DataTable columns={columns} data={orders} />}
      </div>
    </div>
  );
}
