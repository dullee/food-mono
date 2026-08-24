"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserIcon, ShoppingCart, MapPin, ChevronRight, X } from "lucide-react";
import logoImg from "@/public/logoH.svg";
import { useEffect, useState } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
}
export default function Header() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCart, setShowCart] = useState(false);
  const [activeCartButton, setActiveCartButton] = useState<string>("cart");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:8000/user/me", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // Crucial to send the cookie up
        });
        if (!response.ok) {
          setUser(null);
          return;
        }
        const data = await response.json();

        setUser(data.user);
      } catch (err) {
        console.error("Auth check failed:", err);
        setUser(null); // Clear state if token is missing or expired
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <>
      <div className="flex w-full justify-between px-22 h-17 bg-[#18181B]">
        <Image src={logoImg} alt="logo" width={146} height={44} />
        <div className="flex gap-3 items-center">
          {!user && (
            <>
              <Link href={"/sign_up"}>
                <Button className={"bg-white text-black"}>Sign up</Button>
              </Link>
              <Link href={"/log_in"}>
                <Button className={"bg-[#EF4444]"}>Log in</Button>
              </Link>
            </>
          )}
          {user && (
            <>
              <div className=" h-9 bg-[#F4F4F5] rounded-full flex text-xs gap-1 px-3 py-2 text-[#EF4444] justify-center items-center">
                <MapPin size={16} />
                <span>Delivery address:</span>
                <span className="text-[#71717A]">Add location</span>
                <ChevronRight size={16} className="text-[#71717A]" />
              </div>
              <Button
                variant={"outline"}
                onClick={() => setShowCart(true)}
                className="w-9 h-9 cursor-pointer bg-[#F4F4F5] rounded-full flex text-black justify-center items-center"
              >
                <ShoppingCart size={16} />
              </Button>
              <Popover>
                <PopoverTrigger
                  render={
                    <Button className="w-9 h-9 bg-[#EF4444] rounded-full flex text-white justify-center items-center">
                      <UserIcon size={16} />
                    </Button>
                  }
                />
                <PopoverContent
                  className={"flex flex-col items-center p-4 w-full"}
                >
                  <h1 className="font-bold text-[20px]">{user.email}</h1>
                  <Button variant={"ghost"}>Sign out</Button>
                </PopoverContent>
              </Popover>
            </>
          )}
        </div>
      </div>
      {showCart && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/30 text-white w-screen h-screen">
          <div className="w-full max-w-md h-full bg-[#404040] p-8 gap-6 flex flex-col rounded-2xl shadow-xl relative">
            <div className="flex justify-between items-center">
              <div className="flex gap-3">
                <ShoppingCart />
                <h2 className="text-lg font-bold">Order details</h2>
              </div>

              <Button
                variant={"outline"}
                onClick={() => setShowCart(false)}
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
            </div>
          </div>
        </div>
      )}
    </>
  );
}
