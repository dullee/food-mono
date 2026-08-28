"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserIcon, ShoppingCart, MapPin, ChevronRight, X } from "lucide-react";
import logoImg from "@/public/logoH.svg";
import { useEffect, useState } from "react";
import Router from "next/router.js";
import CartOverlay from "./cartOverlay";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: string;
}
export default function Header() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/user/me`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include", // Crucial to send the cookie up
          },
        );
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

  const handleLogout = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
      method: "POST",
      credentials: "include", // required so the browser sends the httpOnly cookie to clear
    });
    Router.push("/");
  };

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
                  <Button variant={"ghost"} onClick={handleLogout}>
                    Sign out
                  </Button>
                </PopoverContent>
              </Popover>
            </>
          )}
        </div>
      </div>
      {showCart && !loading && (
        <CartOverlay onClose={() => setShowCart(false)} userId={user?._id} />
      )}
    </>
  );
}
