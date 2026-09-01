"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Order } from "@/app/types/order.js";

import { SortableHeader } from "./SortableHeader";
import { SquareToggleButton } from "./SquareToggleButton";
import { DateCell } from "./DateCell";
import { StateDropdownCell } from "./StateDropDownCell";
import { FoodItemsCell } from "./FoodItemsCell";

export const getColumns = (
  currentPage: number,
  itemsPerPage: number,
  selectedRowIds: Set<string>,
  toggleRowSelection: (id: string) => void,
  onStatusUpdated: (id: string, newStatus: Order["status"]) => void,
  pageOrderIds: string[],
  onToggleAll: (ids: string[]) => void,
): ColumnDef<Order>[] => [
  {
    id: "toggle",
    header: () => {
      const allSelected =
        pageOrderIds.length > 0 &&
        pageOrderIds.every((id) => selectedRowIds.has(id));
      return (
        <SquareToggleButton
          checked={allSelected}
          onToggle={() => onToggleAll(pageOrderIds)}
        />
      );
    },
    cell: ({ row }) => {
      const orderId = row.original._id;
      return (
        <SquareToggleButton
          checked={selectedRowIds.has(orderId)}
          onToggle={() => toggleRowSelection(orderId)}
        />
      );
    },
  },
  {
    id: "number",
    header: "№",
    cell: ({ row }) => (
      <span className="font-medium  text-[#71717A] text-[14px]">
        {(currentPage - 1) * itemsPerPage + row.index + 1}
      </span>
    ),
  },
  {
    accessorKey: "user.email",
    header: "Customer",
    cell: ({ row }) => (
      <span className="font-medium text-[#71717A] text-[14px] ">
        {row.original.user?.email || "Guest"}
      </span>
    ),
  },
  {
    id: "foodOrderItems",
    header: "Food",
    cell: ({ row }) => <FoodItemsCell order={row.original} />,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <SortableHeader column={column} label="Date" />,
    cell: ({ row }) => <DateCell dateStr={row.original.createdAt} />,
    sortingFn: "datetime",
  },
  {
    accessorKey: "totalPrice",
    header: "Total",
    cell: ({ row }) => {
      const amount = row.original.totalPrice || 0;
      return <span className="font-medium">${amount.toFixed(2)}</span>;
    },
  },
  {
    accessorKey: "user.address",
    header: "Delivery Address",
    cell: ({ row }) => (
      <span className="text-[#71717A] text-xs max-w-55 truncate block">
        {row.original.user?.address || "No address provided"}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <SortableHeader column={column} label="Delivery State" />
    ),
    cell: ({ row }) => (
      <StateDropdownCell
        orderId={row.original._id}
        initialState={row.original.status}
        onStatusUpdated={onStatusUpdated}
      />
    ),
  },
];
