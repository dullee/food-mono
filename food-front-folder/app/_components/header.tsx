"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import logoImg from "@/public/logoH.svg";
import { useEffect, useState } from "react";
import { ChevronRight, ShoppingCart } from "lucide-react";

import CartOverlay from "./cartOverlay";
import ProfileButton from "./profileButton";
import AddressButton from "./addressButton";

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  address: string;
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
              <AddressButton address={user.address} />
              <Button
                variant={"outline"}
                onClick={() => setShowCart(true)}
                className="w-9 h-9 cursor-pointer bg-[#F4F4F5] rounded-full flex text-black justify-center items-center"
              >
                <ShoppingCart size={16} />
              </Button>
              <ProfileButton user={user} />
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
