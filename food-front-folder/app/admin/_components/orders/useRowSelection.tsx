"use client";

import { useState } from "react";
import { Order } from "@/app/types/order.js";

export function useRowSelection(
  onManyUpdated: (ids: Set<string>, newStatus: Order["status"]) => void,
) {
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());
  const [isBatchUpdating, setIsBatchUpdating] = useState(false);

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

  const batchUpdateStatus = async (newStatus: Order["status"]) => {
    if (selectedRowIds.size === 0) return false;

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

      onManyUpdated(selectedRowIds, newStatus);
      setSelectedRowIds(new Set());
      return true;
    } catch (err) {
      console.error("Failed to update status for selected orders:", err);
      return false;
    } finally {
      setIsBatchUpdating(false);
    }
  };

  const toggleAllRows = (ids: string[]) => {
    setSelectedRowIds((prev) => {
      const allSelected = ids.every((id) => prev.has(id));
      const next = new Set(prev);
      ids.forEach((id) => (allSelected ? next.delete(id) : next.add(id)));
      return next;
    });
  };

  return {
    selectedRowIds,
    isBatchUpdating,
    toggleRowSelection,
    toggleAllRows,
    batchUpdateStatus,
  };
}
