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
  _id: string;
  onAddressUpdated: () => void;
};

export default function AddressButton({
  address,
  _id,
  onAddressUpdated,
}: Props) {
  const [addressInput, setAddressInput] = useState(address || "");
  const [savedAddress, setSavedAddress] = useState(address);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    if (!addressInput.trim()) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          _id: _id,
          address: addressInput,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update address");
      }
      setSavedAddress(addressInput);
      onAddressUpdated()
    } catch (error) {
      console.error("Error updating address:", error);
    } finally {
      setIsOpen(false);
    }
  };

  return (
    <>
      <Dialog>
        <DialogTrigger
          render={
            <Button
              onClick={() => setIsOpen(true)}
              variant={"secondary"}
              className=" h-9 rounded-full flex text-xs gap-1 px-3 py-2 text-[#EF4444] justify-center items-center"
            >
              <MapPin size={16} />
              {savedAddress ? (
                savedAddress
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
        {isOpen && (
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <Field>
                <FieldLabel htmlFor="address" className="text-base font-bold">
                  Please write your delivery address!
                </FieldLabel>
                <Textarea
                  id="addressInput"
                  placeholder="Please share your complete address"
                  rows={4}
                  value={addressInput}
                  onChange={(e) => setAddressInput(e.target.value)}
                />
                <div className="flex justify-end gap-4">
                  <DialogClose
                    onClick={() => setIsOpen(false)}
                    render={
                      <Button type="button" variant="outline">
                        Cancel
                      </Button>
                    }
                  />

                  <Button type="submit">Deliver Here</Button>
                </div>
              </Field>
            </form>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
