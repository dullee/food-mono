"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();

  return (
    <Button variant={"outline"} className={"rounded-md w-9"} onClick={() => router.back()}>
        <ChevronLeft/>
    </Button>
  );
}
