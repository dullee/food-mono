import { Soup, Timer } from "lucide-react";
import { Order } from "../../../types/order.js";
import Image from "next/image.js";

interface OrderProps {
  orders: Order[] | null;
}

export default function OrderElement({ orders }: OrderProps) {
  return (
    <div className="flex-1 overflow-y-auto bg-white rounded-2xl p-4">
      <h2 className="text-black">Order history</h2>
      {orders && orders.length > 0 ? (
        orders.map((order: any, index: number, array: any[]) => (
          <div key={order._id} className="flex flex-col gap-3 px-3 mt-4">
            <div className="flex justify-between items-center">
              <h1 className="text-black text-base">${order.totalPrice}</h1>
              <div className="flex rounded-full border px-2.5 py-1.5 text-xs text-black capitalize">
                {order.status}
              </div>
            </div>

            <div className="flex flex-col gap-3 text-xs font-medium">
              {order.foodOrderItems.map((foodItem: any) => (
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
              <div className="flex gap-2 text-[#71717A]">
                <Timer size={16} />
                <p>
                  {order?.createdAt?.replace(
                    /^(\d{4})-(\d{2})-(\d{2}).*/,
                    "$1/$2/$3",
                  )}
                </p>
              </div>
              <p className="overflow-y-clip max-h-4 text-[#71717A]">
                {order.address}
              </p>
            </div>
            {index !== array.length - 1 && (
              <div className="border-b-2 border-dashed border-gray-400 mb-5" />
            )}
          </div>
        ))
      ) : (
        <div className="bg-[#F4F4F5] flex flex-col px-8 py-12 justify-center items-center gap-1 mt-4 rounded-xl">
          <Image width={61} height={50} alt="logo" src="/logoWithoutText.svg" />
          <h1 className="text-black">No Orders Yet?</h1>
          <p className="text-sm font-normal text-center py-4">
            🍕 You haven't placed any orders yet. Start exploring our menu and
            satisfy your cravings!
          </p>
        </div>
      )}
    </div>
  );
}
