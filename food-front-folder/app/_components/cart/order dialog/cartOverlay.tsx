"use client";

import { X, ShoppingCart, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Order } from "../../../types/order";
import Image from "next/image";
import { Food } from "../../../types/food";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import OrderElement from "./orderElement";
import OrderPlacedDialog from "./orderPlacedDialog";

type CartOverlayProps = {
  onClose: () => void;
  userObj: UserProp | null;
};

interface CartItem {
  food: Food;
  quantity: number;
}

interface UserProp {
  email: string;
  address: string;
  role: string;
  _id: string;
}

const CART_KEY = "food_cart";

export default function CartOverlay({ onClose, userObj }: CartOverlayProps) {
  const [activeCartButton, setActiveCartButton] = useState<string>("cart");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [placedOrder, setPlacedOrder] = useState(false);
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
        `${process.env.NEXT_PUBLIC_API_URL}/order/${userObj?._id}`,
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

    if (!userObj || userObj === null) {
      setLoading(false);
      return;
    }

    setDeliveryAddress(userObj.address);

    fetchOrders();
  }, [userObj]);

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
    if (!userObj) {
      alert("Please log in to add items to your cart.");
      return;
    }

    if (cartItems.length === 0) return;

    try {
      const payload = {
        user: userObj._id,
        address: deliveryAddress,
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
      setPlacedOrder(true);
      setCartItems([]);
      await fetchOrders();
      setActiveCartButton("order");
    } catch (error: any) {
      console.error("Error creating order:", error.message || error);
    }
  };

  const updateAdress = async (newAddress: string) => {
    setDeliveryAddress(newAddress);
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.food.price * item.quantity,
    0,
  );

  return (
    <>
      {/* 1. ORDER PLACED SUCCESS DIALOG */}
      <OrderPlacedDialog
        placedOrder={placedOrder}
        setPlacedOrder={setPlacedOrder}
      />
      {/* 2. CART & ORDER HISTORY SIDEBAR DIALOG */}
      <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="fixed right-0 top-0 left-auto translate-x-0 translate-y-0 h-full w-full max-w-133.75 bg-[#404040] p-8 gap-6 flex flex-col rounded-l-2xl rounded-r-none border-none shadow-xl [&>button:last-child]:hidden outline-none">
          {/* Header */}
          <div className="flex justify-between items-center text-white">
            <div className="flex gap-3 items-center">
              <ShoppingCart />
              <h2 className="text-lg font-bold">Order details</h2>
            </div>

            <Button
              variant="outline"
              onClick={onClose}
              className="bg-[#404040] border-gray-600 text-white hover:bg-neutral-700 w-9 h-9 p-0"
            >
              <X size={16} />
            </Button>
          </div>

          {/* Tab Buttons */}
          <div className="grid grid-cols-2 gap-2 p-1 rounded-full bg-white">
            <Button
              onClick={() => setActiveCartButton("cart")}
              className={`w-full rounded-full transition-colors ${
                activeCartButton === "cart"
                  ? "bg-[#EF4444] text-white hover:bg-red-600"
                  : "bg-white text-black hover:bg-gray-100"
              }`}
            >
              Cart
            </Button>
            <Button
              onClick={() => setActiveCartButton("order")}
              className={`w-full rounded-full transition-colors ${
                activeCartButton === "order"
                  ? "bg-[#EF4444] text-white hover:bg-red-600"
                  : "bg-white text-black hover:bg-gray-100"
              }`}
            >
              Order
            </Button>
          </div>

          {/* Main Content Box */}
          <div className="font-bold text-xl h-full flex flex-col justify-between gap-5 text-[#71717A] overflow-hidden">
            {!loading && activeCartButton === "cart" && (
              <>
                {/* Scrollable Cart Items Container */}
                <div className="flex-1 p-4 bg-white rounded-2xl overflow-y-auto pr-1 flex flex-col gap-5">
                  <h2 className="text-black">My cart</h2>
                  {cartItems.length === 0 ? (
                    <div className="bg-[#F4F4F5] flex flex-col px-8 py-12 justify-center items-center gap-1 rounded-xl">
                      <Image
                        width={61}
                        height={50}
                        alt="logo"
                        src="/logoWithoutText.svg"
                      />
                      <h1 className="text-black">Your cart is empty</h1>
                      <p className="text-sm font-normal text-center py-4">
                        Hungry? 🍔 Add some delicious dishes to your cart and
                        satisfy your cravings!
                      </p>
                    </div>
                  ) : (
                    <>
                      {cartItems.map(
                        (item: any, index: number, array: any[]) => (
                          <div
                            key={item.food._id}
                            className="flex flex-col gap-5"
                          >
                            <div className="flex gap-2.5">
                              <div className="w-31 h-30 shrink-0 relative rounded-xl overflow-hidden">
                                <Image
                                  src={item.food.image || "/finger-food.jpg"}
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
                                    onClick={() =>
                                      removeCartItem(item.food._id)
                                    }
                                    className="border border-red-500 text-red-500 w-9 h-9 p-0"
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
                                      className="p-2.5 h-auto"
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
                                      className="p-2.5 h-auto"
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
                        ),
                      )}
                      <div className="flex flex-col gap-2 pt-2 text-[#71717A]">
                        <h1 className="text-sm font-semibold">
                          Delivery location
                        </h1>
                        <textarea
                          placeholder="Please share your complete address"
                          className="border border-gray-300 rounded-lg h-20 p-2 text-sm font-normal outline-none focus:border-red-500"
                          value={deliveryAddress}
                          onChange={(e) => updateAdress(e.target.value)}
                        />
                      </div>
                    </>
                  )}
                </div>

                {cartItems.length > 0 && (
                  <div className="pt-4 p-4 gap-4 bg-white rounded-2xl flex-col flex mt-auto shrink-0 text-sm font-normal text-black">
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
                      variant="destructive"
                      className="bg-[#EF4444] text-white hover:bg-red-600 font-bold py-3 w-full"
                      onClick={createOrder}
                    >
                      Checkout
                    </Button>
                  </div>
                )}
              </>
            )}

            {!loading && activeCartButton === "order" && (
              <OrderElement orders={orders} />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
