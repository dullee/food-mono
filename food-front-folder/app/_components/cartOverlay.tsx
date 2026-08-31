"use client";

import { X, ShoppingCart, Minus, Plus, Soup, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Order } from "../types/order";
import Image from "next/image";
import { Food } from "../types/food";

type CartOverlayProps = {
  onClose: () => void;
  userId?: string;
};

interface CartItem {
  food: Food;
  quantity: number;
}

const CART_KEY = "food_cart";

export default function CartOverlay({ onClose, userId }: CartOverlayProps) {
  const [activeCartButton, setActiveCartButton] = useState<string>("cart");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[] | null>([]);
  const [loading, setLoading] = useState(true);

  const getCart = (): CartItem[] => {
    if (typeof window === "undefined") return [];
    try {
      const data = localStorage.getItem(CART_KEY);
      return data ? JSON.parse(data) : [];
    } catch (err) {
      console.error("Failed to parse cart:", err);
      return [];
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/order/${userId}`,
        { method: "GET", credentials: "include" },
      );

      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      console.error("Failed to load orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCartItems(getCart());

    if (!userId || userId === "undefined") {
      setLoading(false);
      return;
    }

    fetchOrders();
  }, [userId]);

  const updateCartQuantity = (
    foodId: string,
    newQuantity: number,
  ): CartItem[] => {
    let currentCart = getCart();

    if (newQuantity <= 0) {
      currentCart = currentCart.filter((item) => item.food._id !== foodId);
    } else {
      currentCart = currentCart.map((item) =>
        item.food._id === foodId ? { ...item, quantity: newQuantity } : item,
      );
    }

    localStorage.setItem(CART_KEY, JSON.stringify(currentCart));
    return currentCart;
  };

  const handleQuantityChange = (foodId: string, newQuantity: number) => {
    const updatedCart = updateCartQuantity(foodId, newQuantity);
    setCartItems(updatedCart);
  };

  const removeCartItem = (foodId: string) => {
    const updatedCart = updateCartQuantity(foodId, 0);
    setCartItems(updatedCart);
  };

  const createOrder = async () => {
    if (!userId) {
      alert("Please log in to add items to your cart.");
      return;
    }

    if (cartItems.length === 0) return;

    try {
      const payload = {
        user: userId,
        foodOrderItems: cartItems.map((item) => ({
          food: item.food._id,
          quantity: item.quantity,
        })),
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to place order");

      localStorage.removeItem(CART_KEY);
      setCartItems([]);
      await fetchOrders();
      setActiveCartButton("order");
    } catch (error: any) {
      console.error("Error creating order:", error.message || error);
    }
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.food.price * item.quantity,
    0,
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30 text-white w-screen h-screen">
      <div className="w-full max-w-133.75 h-full bg-[#404040] p-8 gap-6 flex flex-col rounded-2xl shadow-xl relative">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex gap-3">
            <ShoppingCart />
            <h2 className="text-lg font-bold">Order details</h2>
          </div>

          <Button
            variant="outline"
            onClick={onClose}
            className="bg-[#404040] w-9 h-9"
          >
            <X size={16} />
          </Button>
        </div>

        {/* Tab Buttons */}
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

        {/* Main Content Box */}
        <div className="  font-bold text-xl h-full flex flex-col justify-between gap-5 text-[#71717A] overflow-hidden">
          {!loading && activeCartButton === "cart" && (
            <>
              {/* Scrollable Cart Items Container */}
              <div className="flex-1 p-4 bg-white rounded-2xl overflow-y-auto pr-1 flex flex-col gap-5">
                <h2>My cart</h2>
                {cartItems.length === 0 ? (
                  <div className="bg-[#F4F4F5] flex flex-col px-8 py-12 justify-center items-center gap-1 rounded-xl">
                    <Image
                      width={61}
                      height={50}
                      alt="logo"
                      src={"./logoWithoutText.svg"}
                    />
                    <h1 className="text-black">Your cart is empty</h1>
                    <p className="text-sm font-normal text-center py-4">
                      Hungry? 🍔 Add some delicious dishes to your cart and
                      satisfy your cravings!
                    </p>
                  </div>
                ) : (
                  cartItems.map((item, index, array) => (
                    <div key={item.food._id} className="flex flex-col gap-5">
                      <div className="flex gap-2.5">
                        <div className="w-31 h-30 shrink-0 relative rounded-xl overflow-hidden">
                          <Image
                            src={item.food.image}
                            alt={item.food.foodName}
                            className="object-cover"
                            fill
                          />
                        </div>
                        <div className="flex flex-col justify-between max-w-76.25 w-full">
                          <div className="flex justify-between w-full">
                            <div className="flex flex-col">
                              <h1 className="text-base text-[#EF4444]">
                                {item.food.foodName}
                              </h1>
                              <p className="text-xs font-normal text-black line-clamp-2">
                                {item.food.ingredients}
                              </p>
                            </div>

                            <Button
                              variant="outline"
                              onClick={() => removeCartItem(item.food._id)}
                              className="border border-red-500 text-red-500 w-9 h-9"
                            >
                              <X size={16} />
                            </Button>
                          </div>

                          <div className="flex justify-between text-black">
                            <div className="flex gap-3 items-center">
                              <Button
                                onClick={() =>
                                  handleQuantityChange(
                                    item.food._id,
                                    item.quantity - 1,
                                  )
                                }
                                variant="ghost"
                                className="p-2.5"
                              >
                                <Minus size={16} />
                              </Button>
                              <p className="text-sm">{item.quantity}</p>
                              <Button
                                onClick={() =>
                                  handleQuantityChange(
                                    item.food._id,
                                    item.quantity + 1,
                                  )
                                }
                                variant="ghost"
                                className="p-2.5"
                              >
                                <Plus size={16} />
                              </Button>
                            </div>
                            <p className="text-base font-bold">
                              ${item.food.price}
                            </p>
                          </div>
                        </div>
                      </div>
                      {index !== array.length - 1 && (
                        <div className="border-b-2 border-dashed border-gray-400" />
                      )}
                    </div>
                  ))
                )}
              </div>

              {cartItems.length > 0 && (
                <div className="pt-4 p-4  gap-4 bg-white rounded-2xl flex-col flex mt-auto shrink-0 text-sm font-normal text-black">
                  <h1 className="font-bold text-xl text-[#71717A]">
                    Payment info
                  </h1>
                  <div className="flex justify-between">
                    <p className="text-[#71717A]">Items</p>
                    <p>${totalPrice.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-[#71717A]">Shipping</p>
                    <p>$0.00</p>
                  </div>
                  <div className="border-b-2 border-dashed border-gray-400" />

                  <div className="flex justify-between font-bold text-base">
                    <p>Total</p>
                    <p>${totalPrice.toFixed(2)}</p>
                  </div>
                  <Button
                    variant="outline"
                    className="bg-[#EF4444] text-white hover:bg-red-600 font-bold py-3"
                    onClick={createOrder}
                  >
                    Checkout
                  </Button>
                </div>
              )}
            </>
          )}

          {!loading && activeCartButton === "order" && (
            <div className="flex-1 overflow-y-scroll bg-white rounded-2xl p-4">
              <h2>Order history</h2>
              {orders && orders.length > 0 ? (
                orders.map((order, index, array) => (
                  <div
                    key={order._id}
                    className="flex flex-col gap-3 px-3 mt-4"
                  >
                    <div className="flex justify-between items-center">
                      <h1 className="text-black text-base">
                        ${order.totalPrice}
                      </h1>
                      <div className="flex rounded-full border px-2.5 py-1.5 text-xs text-black capitalize">
                        {order.status}
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 text-xs font-medium">
                      {order.foodOrderItems.map((foodItem) => (
                        <div
                          key={foodItem.food._id}
                          className="flex justify-between text-[#71717A]"
                        >
                          <div className="flex gap-2">
                            <Soup size={16} />
                            <p>{foodItem.food.foodName}</p>
                          </div>
                          <p className="text-black">x {foodItem.quantity}</p>
                        </div>
                      ))}
                      <div className="flex gap-2">
                        <Timer size={16} />
                        <p>
                          {order?.createdAt?.replace(
                            /^(\d{4})-(\d{2})-(\d{2}).*/,
                            "$1/$2/$3",
                          )}
                        </p>
                      </div>
                      <p className="overflow-y-clip max-h-4">
                        {order.user.address}
                      </p>
                    </div>
                    {index !== array.length - 1 && (
                      <div className="border-b-2 border-dashed border-gray-400 mb-5" />
                    )}
                  </div>
                ))
              ) : (
                <div className="bg-[#F4F4F5] flex flex-col px-8 py-12 justify-center items-center gap-1 mt-4 rounded-xl">
                  <Image
                    width={61}
                    height={50}
                    alt="logo"
                    src={"./logoWithoutText.svg"}
                  />
                  <h1 className="text-black">No Orders Yet?</h1>
                  <p className="text-sm font-normal text-center py-4">
                    🍕 You haven't placed any orders yet. Start exploring our
                    menu and satisfy your cravings!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
