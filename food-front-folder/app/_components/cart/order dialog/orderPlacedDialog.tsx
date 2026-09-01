import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import type { Dispatch, SetStateAction } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface Props {
  placedOrder: boolean;
  setPlacedOrder: Dispatch<SetStateAction<boolean>>;
}

export default function OrderPlacedDialog({
  placedOrder,
  setPlacedOrder,
}: Props) {
  return (
    <Dialog open={placedOrder} onOpenChange={setPlacedOrder}>
      <DialogContent className="flex flex-col justify-center gap-6 w-full max-w-md items-center p-6 sm:rounded-2xl">
        <DialogHeader className="items-center text-center">
          <DialogTitle className="text-2xl font-bold">
            Your order has been successfully placed!
          </DialogTitle>
        </DialogHeader>
        <Image
          src="/orderPlaced.svg"
          width={156}
          height={265}
          alt="order placed"
        />
        <DialogFooter className="w-full sm:justify-center">
          <DialogClose
            render={
              <Button
                variant="secondary"
                type="button"
                onClick={() => setPlacedOrder(false)}
                className="w-full"
              >
                Back to Home
              </Button>
            }
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
