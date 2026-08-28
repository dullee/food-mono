"use client";

import { CldImage } from "next-cloudinary";

import { Button } from "@/components/ui/button";
import { Check, ChevronDown, CalendarIcon } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

import {
  Pagination,
  PaginationContent,
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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Order } from "@/app/types/order.js";

import { format } from "date-fns";
import { type DateRange } from "react-day-picker";

import { Calendar } from "@/components/ui/calendar";
import { Field } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function SquareToggleButton({
  checked,
  onToggle,
}: {
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
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

function DateCell({ dateStr }: { dateStr?: string }) {
  const [formattedDate, setFormattedDate] = useState<string>("");

  useEffect(() => {
    if (dateStr) {
      setFormattedDate(new Date(dateStr).toLocaleDateString());
    }
  }, [dateStr]);

  if (!dateStr) return <span className="text-gray-400">N/A</span>;

  return (
    <span className="text-xs text-gray-600">
      {formattedDate || dateStr.split("T")[0]}
    </span>
  );
}

function StateDropdownCell({
  orderId,
  initialState,
  onStatusUpdated,
}: {
  orderId: string;
  initialState: Order["status"];
  onStatusUpdated: (id: string, newStatus: Order["status"]) => void;
}) {
  const [isUpdating, setIsUpdating] = useState(false);

  const stateStyles: Record<string, string> = {
    DELIVERED: "border-green-500 hover:bg-green-200",
    PENDING: "border-red-600 hover:bg-red-200",
    CANCELED: "border-gray-500 hover:bg-red-200",
  };

  const options: Order["status"][] = ["PENDING", "DELIVERED", "CANCELED"];

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
          stateStyles[initialState] || "bg-gray-100 text-gray-800"
        }`}
      >
        {isUpdating ? "Updating..." : initialState}
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
}

export const getColumns = (
  currentPage: number,
  itemsPerPage: number,
  selectedRowIds: Set<string>,
  toggleRowSelection: (id: string) => void,
  onStatusUpdated: (id: string, newStatus: Order["status"]) => void,
): ColumnDef<Order>[] => [
  {
    id: "toggle",
    header: "Label",
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
      <span className="font-medium text-gray-500">
        {(currentPage - 1) * itemsPerPage + row.index + 1}
      </span>
    ),
  },
  {
    accessorKey: "user.email",
    header: "Customer",
    cell: ({ row }) => (
      <span className="font-medium text-gray-900">
        {row.original.user?.email || "Guest"}
      </span>
    ),
  },
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
                      src={
                        item.food?.image ||
                        "https://res.cloudinary.com/q36xcdm5/image/upload/v1785501876/cld-sample-4.jpg"
                      }
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
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => <DateCell dateStr={row.original.createdAt} />,
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
      <span className="text-gray-600 max-w-55 truncate block">
        {row.original.user?.address || "No address provided"}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Delivery State",
    cell: ({ row }) => (
      <StateDropdownCell
        orderId={row.original._id}
        initialState={row.original.status}
        onStatusUpdated={onStatusUpdated}
      />
    ),
  },
];

export default function AdminOrderInfo() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrder] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());
  const [isBatchUpdating, setIsBatchUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<Order["status"] | null>(
    null,
  );
  const [isMounted, setIsMounted] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order`);
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        setOrders(data);
        filterOrdersByDate(data, date);
      } catch (err) {
        console.error("Database connection error via backend", err);
        setError("Express server is offline.");
      } finally {
        setIsLoading(false);
      }
    };

    if (orders.length === 0) {
      fetchOrders();
    } else {
      filterOrdersByDate(orders, date);
    }
  }, [date]); // Consistent single-array dependency

  const filterOrdersByDate = (
    allOrders: Order[],
    range: DateRange | undefined,
  ) => {
    setCurrentPage(1);

    if (!range || !range.from) {
      setFilteredOrder(allOrders);
      return;
    }

    const fromDate = new Date(range.from);
    fromDate.setHours(0, 0, 0, 0);

    const toDate = range.to ? new Date(range.to) : new Date(range.from);
    toDate.setHours(23, 59, 59, 999);

    const result = allOrders.filter((order) => {
      if (!order.createdAt) return false;
      const orderDate = new Date(order.createdAt);
      return orderDate >= fromDate && orderDate <= toDate;
    });

    setFilteredOrder(result);
  };

  const toggleRowSelection = (id: string) => {
    setSelectedRowIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleStatusUpdatedLocally = (
    orderId: string,
    newStatus: Order["status"],
  ) => {
    const updateList = (list: Order[]) =>
      list.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o));

    setOrders((prev) => updateList(prev));
    setFilteredOrder((prev) => updateList(prev));
  };

  const handleBatchStatusChange = async (newStatus: Order["status"]) => {
    if (selectedRowIds.size === 0) return;

    setIsBatchUpdating(true);
    const idsToUpdate = Array.from(selectedRowIds);

    try {
      await Promise.all(
        idsToUpdate.map((id) =>
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/order`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ _id: id, status: newStatus }),
          }),
        ),
      );

      const updateList = (list: Order[]) =>
        list.map((o) =>
          selectedRowIds.has(o._id) ? { ...o, status: newStatus } : o,
        );

      setOrders((prev) => updateList(prev));
      setFilteredOrder((prev) => updateList(prev));
      setSelectedRowIds(new Set());
      setIsDialogOpen(false);
    } catch (err) {
      console.error("Failed to update status for selected orders:", err);
    } finally {
      setIsBatchUpdating(false);
    }
  };

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const options: Order["status"][] = ["PENDING", "DELIVERED", "CANCELED"];

  // Determines state consistently across SSR and initial render
  const isButtonDisabled = selectedRowIds.size === 0 || isBatchUpdating;

  return (
    <div>
      <div className="p-4 flex justify-between items-center">
        <div className="flex flex-col">
          <h1 className="text-xl font-bold">Orders</h1>
          <h3 className="text-sm text-gray-500">
            {filteredOrders.length} items
          </h3>
        </div>
        <div className="flex gap-3">
          <Field className="mx-auto w-60">
            <Popover>
              <PopoverTrigger
                render={
                  <button
                    type="button"
                    id="date-picker-range"
                    className="inline-flex h-9 items-center justify-start rounded-md border border-input bg-background px-2.5 text-sm font-normal shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground gap-2"
                  >
                    <CalendarIcon
                      data-icon="inline-start"
                      className="h-4 w-4"
                    />
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, "LLL dd, y")} -{" "}
                          {format(date.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(date.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </button>
                }
              />
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </Field>

          <Button
            disabled={isButtonDisabled}
            onClick={() => setIsDialogOpen(true)}
            suppressHydrationWarning
          >
            Change delivery state{" "}
            {selectedRowIds.size > 0 ? selectedRowIds.size : null}
          </Button>

          <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) setSelectedStatus(null);
            }}
          >
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Change Delivery State</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-3 gap-3 py-4">
                {options.map((status) => {
                  const isSelected = selectedStatus === status;
                  return (
                    <Button
                      key={status}
                      variant={isSelected ? "default" : "secondary"}
                      disabled={isBatchUpdating}
                      onClick={() => setSelectedStatus(status)}
                      className={`w-full justify-center font-medium ${
                        isSelected
                          ? "border-[#EF4444] text-[#EF4444] bg-[#E11D48]/10"
                          : ""
                      }`}
                    >
                      {status}
                    </Button>
                  );
                })}
              </div>
              <DialogFooter className="w-full flex gap-2">
                <Button
                  className="w-full"
                  disabled={!isMounted || !selectedStatus || isBatchUpdating}
                  onClick={() => {
                    if (selectedStatus) {
                      handleBatchStatusChange(selectedStatus);
                      setSelectedStatus(null);
                    }
                  }}
                >
                  {isBatchUpdating ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex flex-col">
        {isLoading && (
          <p className="text-sm justify-center flex text-gray-400 py-8">
            Loading orders...
          </p>
        )}
        {error && <p className="text-sm text-red-500 py-4 px-4">{error}</p>}
        {!isLoading && !error && (
          <DataTable
            columns={getColumns(
              currentPage,
              itemsPerPage,
              selectedRowIds,
              toggleRowSelection,
              handleStatusUpdatedLocally,
            )}
            data={paginatedOrders}
          />
        )}
      </div>

      {totalPages > 1 && (
        <Pagination className="py-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) setCurrentPage((p) => p - 1);
                }}
                className={
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  isActive={currentPage === page}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(page);
                  }}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages) setCurrentPage((p) => p + 1);
                }}
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
