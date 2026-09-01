"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Order } from "@/app/types/order.js";
import { STATUS_OPTIONS } from "./StateDropDownCell";

export function BatchStatusDialog({
  open,
  onOpenChange,
  isSaving,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isSaving: boolean;
  onSave: (status: Order["status"]) => void;
}) {
  const [selectedStatus, setSelectedStatus] = useState<Order["status"] | null>(
    null,
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) setSelectedStatus(null);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change Delivery State</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-3 py-4">
          {STATUS_OPTIONS.map((status) => {
            const isSelected = selectedStatus === status;
            return (
              <Button
                key={status}
                variant={"secondary"}
                disabled={isSaving}
                onClick={() => setSelectedStatus(status)}
                className={`w-full justify-center font-medium ${
                  isSelected
                    ? "border-[#EF4444] text-[#EF4444] bg-[#E11D48]/10"
                    : ""
                }`}
              >
                {status}
              </Button>
            );
          })}
        </div>
        <DialogFooter className="w-full flex gap-2">
          <Button
            className="w-full"
            disabled={!selectedStatus || isSaving}
            onClick={() => {
              if (selectedStatus) {
                onSave(selectedStatus);
                setSelectedStatus(null);
              }
            }}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
