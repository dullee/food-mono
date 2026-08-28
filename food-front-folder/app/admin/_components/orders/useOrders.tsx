"use client";

import { useEffect, useState } from "react";
import { type DateRange } from "react-day-picker";
import { Order } from "@/app/types/order.js";

function filterByDate(allOrders: Order[], range: DateRange | undefined) {
  if (!range || !range.from) return allOrders;

  const fromDate = new Date(range.from);
  fromDate.setHours(0, 0, 0, 0);

  const toDate = range.to ? new Date(range.to) : new Date(range.from);
  toDate.setHours(23, 59, 59, 999);

  return allOrders.filter((order) => {
    if (!order.createdAt) return false;
    const orderDate = new Date(order.createdAt);
    return orderDate >= fromDate && orderDate <= toDate;
  });
}

export function useOrders(date: DateRange | undefined) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order`);
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        setOrders(data);
        setFilteredOrders(filterByDate(data, date));
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
      setFilteredOrders(filterByDate(orders, date));
    }
    // Mirrors the original: only re-filter on `date` change, fetch happens once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  const updateOrderStatus = (orderId: string, newStatus: Order["status"]) => {
    const apply = (list: Order[]) =>
      list.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o));

    setOrders((prev) => apply(prev));
    setFilteredOrders((prev) => apply(prev));
  };

  const updateManyStatuses = (ids: Set<string>, newStatus: Order["status"]) => {
    const apply = (list: Order[]) =>
      list.map((o) => (ids.has(o._id) ? { ...o, status: newStatus } : o));

    setOrders((prev) => apply(prev));
    setFilteredOrders((prev) => apply(prev));
  };

  return {
    filteredOrders,
    isLoading,
    error,
    updateOrderStatus,
    updateManyStatuses,
  };
}
