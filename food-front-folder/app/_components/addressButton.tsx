"use client";
import { Button } from "@/components/ui/button";
import { MapPin, ChevronRight } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  address: string;
};

export default function AddressButton({ address }: Props) {
  return (
    <>
      <Dialog>
        <DialogTrigger
          render={
            <Button
              variant={"secondary"}
              className=" h-9 rounded-full flex text-xs gap-1 px-3 py-2 text-[#EF4444] justify-center items-center"
            >
              <MapPin size={16} />
              {address ? (
                address
              ) : (
                <>
                  <span>Delivery address:</span>
                  <span className="text-[#71717A]">Add location</span>
                </>
              )}

              <ChevronRight size={16} className="text-[#71717A]" />
            </Button>
          }
        />
        <DialogContent>
          <Field>
            <FieldLabel htmlFor="address" className="text-base font-bold">
              Please write your delivery address!
            </FieldLabel>
            <Textarea
              id="address"
              placeholder="Please share your complete address"
              rows={4}
            />
            <div className="flex justify-end gap-4">
              <DialogClose
                render={
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                }
              />

              <Button type="submit">Deliver Here</Button>
            </div>
          </Field>
        </DialogContent>
      </Dialog>
    </>
  );
}
