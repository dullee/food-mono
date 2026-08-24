"use client";

import { X, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { FoodOrderItemsProps } from "../types/order.js";
import Image from "next/image.js";

type CartOverlayProps = {
  onClose: () => void;
  userId?: string; // Type signature for a function taking no args and returning nothing
};

export default function CartOverlay({ onClose, userId }: CartOverlayProps) {
  const [activeCartButton, setActiveCartButton] = useState<string>("cart");
  const [orders, setOrders] = useState<FoodOrderItemsProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/order/6a74052c0cebb0f4dbc2565c`,
          {
            credentials: "include", // Sends auth cookie automatically
          },
        );
        const data = await res.json();
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        setOrders(data.orders.foodOrderItems);
        console.log(data.orders.foodOrderItems);
      } catch (err) {
        console.error("Failed to load orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30 text-white w-screen h-screen">
      <div className="w-full max-w-133.75 h-full bg-[#404040] p-8 gap-6 flex flex-col rounded-2xl shadow-xl relative">
        <div className="flex justify-between items-center">
          <div className="flex gap-3">
            <ShoppingCart />
            <h2 className="text-lg font-bold">Order details</h2>
          </div>

          <Button
            variant={"outline"}
            onClick={onClose}
            className="bg-[#404040] w-9 h-9"
          >
            <X size={16} />
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-2 p-1 rounded-full bg-white">
          <Button
            onClick={() => setActiveCartButton("cart")}
            className={`w-full bg-white text-black ${activeCartButton === "cart" && "bg-[#EF4444] text-white"}`}
          >
            Cart
          </Button>
          <Button
            onClick={() => setActiveCartButton("order")}
            className={`w-full bg-white text-black ${activeCartButton === "order" && "bg-[#EF4444] text-white"}`}
          >
            Order
          </Button>
        </div>
        <div className="bg-white rounded-2xl h-full p-4 text-[#71717A]">
          <h2>My {activeCartButton}</h2>

          <div>
            {!loading &&
              orders.map((order, index) => (
                <div key={index} className="flex gap-2.5">
                  <div className="w-[124px] h-[120px] shrink-0 relative rounded-xl overflow-hidden">
                    <Image
                      src={order.food.image}
                      alt={order.food.foodName}
                      className="object-cover"
                      fill
                    />
                  </div>
                  <div className="flex flex-col justify-between max-w-76.25 w-full">
                    <div className="flex justify-between  w-full">
                      <div className="flex flex-col ">
                        <h1>{order.food.foodName}</h1>
                        <p className="text-xs ">{order.food.ingredients}</p>
                      </div>

                      <Button
                        variant={"outline"}
                        className={"border border-red-500 text-red-500 w-9 h-9"}
                      >
                        <X />
                      </Button>
                    </div>

                    <div className="flex justify-between">
                      <p>{order.quantity}</p>
                      <p>${order.food.price}</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
