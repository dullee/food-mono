import Image from "next/image";
import Link from "next/link";
import bikeImg from "@/public/deliveryBike.jpg";

import BackButton from "../_components/backButton";

import MultiStepSignup from "../_components/multiStepSignUp";

export default function SignUp() {
  return (
    <div className="flex flex-col  items-center">
      <main className="flex w-full max-w-360 flex-row justify-between items-center md:pl-25 ">
        <div className="w-full max-w-md flex flex-col gap-6">
          <div className="w-9 h-9">
            <BackButton />
          </div>

          <MultiStepSignup />

          <div className="flex justify-center gap-2">
            <p>Already have an account? </p>

            <span><Link href={"/log_in"} className="text-[#2563EB]">Log in</Link></span>


          </div>
        </div>
        <Image
          loading="eager"
          className="p-5 max-sm:hidden"
          src={bikeImg}
          alt="delivery worker on bike"
        />
      </main>
    </div>
  );
}
