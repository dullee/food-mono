import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

import logoImg from "@/public/logoH.svg";

export default function Header() {
  return (
    <div className="flex w-full justify-between md:px-22 md:h-17 bg-[#18181B]">
      <Image src={logoImg} alt="logo" />
      <div className="flex gap-3 items-center">
        <Link href={"/sign_up"}>
          <Button className={"bg-white text-black"}>Sign up</Button>
        </Link>
        <Link href={"/log_in"}>
          <Button className={"bg-[#EF4444]"}>Log in</Button>
        </Link>
      </div>
    </div>
  );
}
