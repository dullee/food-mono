"use client";

import { useState } from "react";
import { type DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Order } from "@/app/types/order.js";
import { DataTable } from "./dataTable"; // adjust path to match your project

import { getColumns } from "./columns";
import { DateRangeFilter } from "./DateRangeFinder";
import { BatchStatusDialog } from "./BatchStatusDialog";
import { OrdersPagination } from "./OrdersPagination";
import { useOrders } from "./useOrders";
import { useRowSelection } from "./useRowSelection";

const ITEMS_PER_PAGE = 10;

export default function AdminOrderInfo() {
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    filteredOrders,
    isLoading,
    error,
    updateOrderStatus,
    updateManyStatuses,
  } = useOrders(date);

  const {
    selectedRowIds,
    isBatchUpdating,
    toggleRowSelection,
    toggleAllRows,
    batchUpdateStatus,
  } = useRowSelection(updateManyStatuses);

  const handleDateChange = (range: DateRange | undefined) => {
    setDate(range);
    setCurrentPage(1);
  };

  const handleSaveBatchStatus = async (status: Order["status"]) => {
    const success = await batchUpdateStatus(status);
    if (success) setIsDialogOpen(false);
  };

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE) || 1;
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <div>
      <div className="bg-white rounded-2xl">
        <div className="p-4 flex justify-between items-center">
          <div className="flex flex-col">
            <h1 className="text-xl font-bold">Orders</h1>
            <h3 className="text-sm text-gray-500">
              {filteredOrders.length} items
            </h3>
          </div>
          <div className="flex gap-3">
            <DateRangeFilter date={date} onDateChange={handleDateChange} />

            <Button
              disabled={selectedRowIds.size === 0 || isBatchUpdating}
              suppressHydrationWarning
              onClick={() => setIsDialogOpen(true)}
              className={"gap-2 flex py-2 px-4"}
            >
              Change delivery state
              {selectedRowIds.size > 0 && (
                <div className="bg-white rounded-2xl text-black text-xs px-2.5 py-0.5">
                  {selectedRowIds.size}
                </div>
              )}
            </Button>

            <BatchStatusDialog
              open={isDialogOpen}
              onOpenChange={setIsDialogOpen}
              isSaving={isBatchUpdating}
              onSave={handleSaveBatchStatus}
            />
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
                ITEMS_PER_PAGE,
                selectedRowIds,
                toggleRowSelection,
                updateOrderStatus,
                paginatedOrders.map((o) => o._id),
                toggleAllRows,
              )}
              data={paginatedOrders}
              getRowClassName={(order) =>
                selectedRowIds.has(order._id) ? "bg-gray-100" : "bg-white"
              }
            />
          )}
        </div>
      </div>

      <OrdersPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
