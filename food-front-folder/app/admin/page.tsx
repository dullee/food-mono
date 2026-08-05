"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Truck } from "lucide-react";
import { Pagination } from "@/components/ui/pagination";
import { useState } from "react";
import AdminOrderInfo from "./_components/adminOrderInfo";
import AdminFoodMenu from "./_components/adminFoodMenu";

export default function Page() {
  const [selectedMenu, setSelectedMenu] = useState<string>("orders");

  return (
    <div className="flex min-h-screen bg-[#F4F4F5] justify-center">
      <div className="max-w-360 flex w-full relative gap-6">
        <div className="max-w-51.25 flex bg-white h-full w-full">
          <div className="fixed left-164 top-0 flex flex-col px-5 pt-9 gap-10">
            <div className="flex max-h-12">
              <Image alt="logo" width={165} height={44} src={"logoHDark.svg"} />
            </div>
            <div className="flex flex-col gap-6 items-center">
              <Button
                variant={"ghost"}
                onClick={() => setSelectedMenu("menu")}
                className={`py-2 px-6 gap-2.5 flex  ${selectedMenu === "menu" && "bg-black text-white"} `}
              >
                <LayoutDashboard /> Food menu
              </Button>
              <Button
                variant={"ghost"}
                onClick={() => setSelectedMenu("orders")}
                className={`py-2 px-6 gap-2.5 flex  ${selectedMenu === "orders" && "bg-black text-white"} `}
              >
                <Truck />
                <h2 className="w-full">Orders</h2>
              </Button>
              <div></div>
            </div>
          </div>
        </div>
        <div className="mt-6 mr-10 w-full flex flex-col gap-6">
          <div className="ml-auto border border-black w-9 h-9 rounded-full flex justify-center items-center">
            ?
          </div>
          <div>
            {selectedMenu === "orders" ? <AdminOrderInfo /> : <AdminFoodMenu />}

            <Pagination></Pagination>
          </div>
        </div>
      </div>
    </div>
  );
}
