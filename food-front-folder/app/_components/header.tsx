"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserIcon, ShoppingCart, MapPin, ChevronRight } from "lucide-react";
import logoImg from "@/public/logoH.svg";
import { useEffect, useState } from "react";

interface UserProfile {
  id: string;
  name: string;
  role: string;
}
export default function Header() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

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
            <div className="w-9 h-9 bg-[#F4F4F5] rounded-full flex text-black justify-center items-center">
              <ShoppingCart size={16} />
            </div>
            <div className="w-9 h-9 bg-[#EF4444] rounded-full flex text-white justify-center items-center">
              <UserIcon size={16} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
