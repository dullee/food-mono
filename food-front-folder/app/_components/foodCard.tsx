"use client";

import axios from "axios";
import { CldImage } from "next-cloudinary";
import { Alert } from "@/components/ui/alert";
import { Card, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Food } from "../types/food.js";

type FoodProps = {
  food: Food;
};

export default function FoodCard({ food }: FoodProps) {
  const [addedToCart, setAddedToCart] = useState<boolean>(false);
  const [showFoodDetail, setshowFoodDetail] = useState<boolean>(false);
  const [showAddedAlert, setShowAddedAlert] = useState<boolean>(false);
  const [orderAmount, setOrderAmount] = useState<number>(1);
  const [foodItem, setFoodItem] = useState<Food | null>(null);

  const duration: number = 1000;

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const res = await fetch("http://localhost:8000/food");

        if (!res.ok) throw new Error("Failed to fetch categories");

        const data = await res.json();
        setFoodItem(data[food._id]);
      } catch (error) {}
    };
    fetchFoods();
  }, []);

  function triggerAlert() {
    setShowAddedAlert(true);

    setTimeout(() => {
      setShowAddedAlert(false);
    }, duration);
  }

  async function addToCart() {
    try {
      if (!foodItem) {
        console.error(`Food item with ID ${food._id} not found locally.`);
        return;
      }

      await axios.post("http://localhost:8000/order", {
        ...foodItem,
      });
      triggerAlert();
      setAddedToCart(true);
      console.log("Food added successfully!");
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.error || error.message || "Unknown error";
      console.log("Error:", errorMsg);
    }
  }

  return (
    <>
      <Card className="flex p-4 max-w-100 w-full z-10">
        <div className="relative w-full h-50 overflow-hidden rounded-md">
          <CldImage
            alt={food?.foodName || "finger food"}
            src={food?.image || "/finger-food.jpg"}
            fill
            className="object-cover"
            onClick={() => setshowFoodDetail(true)}
          />
          <Button
            onClick={() => addToCart()}
            className={`absolute ${addedToCart ? "bg-black " : "bg-white"} bottom-5 right-5  cursor-pointer rounded-full w-11 h-11 text-[#EF4444]`}
          >
            {addedToCart ? <Check size={16} /> : <Plus size={16} />}
          </Button>
        </div>
        <div
          className="flex flex-col gap-2"
          onClick={() => setshowFoodDetail(true)}
        >
          <div className="flex justify-between">
            <h1 className="text-[#EF4444] text-[24px] font-semibold">
              {food?.foodName}
            </h1>
            <span className="text-[18px] font-semibold">${food?.price}</span>
          </div>
          <CardDescription className="text-black text-[14px] h-10">
            {food?.ingredients}
          </CardDescription>
        </div>
      </Card>
      {showFoodDetail && (
        <div className="fixed top-0 z-50 left-0 bg-black/50 w-screen h-screen flex justify-center items-center  border-red-600">
          <div
            className={
              " rounded-xl bg-white z-100 w-full max-w-206 h-103 opacity-100 flex gap-6 p-6"
            }
          >
            <div className="relative w-full max-w-94.25 h-full max-h-91 rounded-xl overflow-hidden">
              <CldImage
                fill
                alt={food?.foodName || "finger food"}
                src={food?.image || "/finger-foodItem.jpg"}
                className="object-cover"
              />
            </div>
            <div className="flex flex-col w-full h-full justify-between">
              <div className="flex flex-col">
                <Button
                  className={"ml-auto w-9 h-9"}
                  variant={"outline"}
                  onClick={() => setshowFoodDetail(false)}
                >
                  <X />
                </Button>

                <h1 className="text-[30px] pb-3 font-semibold text-[#EF4444]">
                  {food?.foodName}
                </h1>
                <p className="text-[16px]">{food?.ingredients}</p>
              </div>
              <div className="flex flex-col gap-6">
                <div className="flex ">
                  <div className="w-full">
                    <p className="text-[16px]">Total Price</p>
                    <h3 className="text-[24px] font-semibold">
                      ${food?.price}
                    </h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant={"outline"}
                      className={"w-11 h-11"}
                      onClick={() =>
                        setOrderAmount(orderAmount - (orderAmount > 1 ? 1 : 0))
                      }
                    >
                      <Minus />
                    </Button>
                    <h3 className="text-[18px] font-semibold">{orderAmount}</h3>
                    <Button
                      variant={"outline"}
                      className={"w-11 h-11 border-black"}
                      onClick={() => setOrderAmount(orderAmount + 1)}
                    >
                      <Plus />
                    </Button>
                  </div>
                </div>
                <Button className={"w-full"}>Add to card</Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showAddedAlert && (
        <div className="fixed w-screen h-screen top-28 left-0 z-100 flex justify-center">
          <Alert className="bg-black rounded-md border max-w-93 animate-toast text-white pl-4 pr-6 max-h-12 h-full gap-3 flex items-center">
            <Check size={16} />
            <p className="font-medium text-[20px]">
              Food is being added to the cart!
            </p>
          </Alert>
        </div>
      )}
    </>
  );
}
