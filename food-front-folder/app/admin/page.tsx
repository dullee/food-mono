"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Truck } from "lucide-react";
import { Pagination } from "@/components/ui/pagination";

import AdminOrderInfo from "./_components/orders/adminOrderInfo";
import AdminFoodMenu from "./_components/adminFoodMenu";
import { useRouter, useSearchParams } from "next/navigation";
import ProfileButton from "../_components/header/profileButton";
import { useState, useEffect, Suspense } from "react";

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: string;
}

// 1. Move the searchParams and main content logic into a child component
function AdminContent() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // useSearchParams is now safely encapsulated here
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "food";

  const handleTabChange = (tabName: string) => {
    router.push(`/admin?tab=${tabName}`);
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/user/me`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
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
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#F4F4F5] justify-center w-full">
      <div className="max-w-360 flex w-full gap-6 ">
        <div className="w-51.25 shrink-0 hidden md:block">
          <div className="fixed top-0 left-auto w-51.25 h-screen bg-white border-r border-gray-100 flex flex-col px-5 pt-9 gap-10">
            <div className="flex max-h-12">
              <Image
                alt="logo"
                width={165}
                height={44}
                src={"/logoHDark.svg"}
              />
            </div>

            <div className="flex flex-col gap-3">
              <Button
                variant={"ghost"}
                onClick={() => handleTabChange("food")}
                className={`py-2 px-6 gap-2.5 flex justify-start w-full ${
                  activeTab === "food"
                    ? "bg-black text-white hover:bg-black/90 hover:text-white"
                    : ""
                }`}
              >
                <LayoutDashboard size={20} />
                <span>Food menu</span>
              </Button>

              <Button
                variant={"ghost"}
                onClick={() => handleTabChange("orders")}
                className={`py-2 px-6 gap-2.5 flex justify-start w-full ${
                  activeTab === "orders"
                    ? "bg-black text-white hover:bg-black/90 hover:text-white"
                    : ""
                }`}
              >
                <Truck size={20} />
                <span>Orders</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="py-6 w-full flex flex-col gap-6 pr-10 min-w-0">
          <div className="flex justify-end w-full">
            {!loading && user && <ProfileButton user={user} />}
          </div>

          <div className="flex-1">
            {activeTab === "orders" ? <AdminOrderInfo /> : <AdminFoodMenu />}
          </div>

          <div className="mt-auto pt-4 flex justify-end!">
            <Pagination />
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. Wrap the child component inside <Suspense> in the default page export
export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminContent />
    </Suspense>
  );
}