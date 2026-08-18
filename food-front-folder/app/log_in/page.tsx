import Image from "next/image";
import Link from "next/link";
import bikeImg from "@/public/deliveryBike.jpg";
import BackButton from "../_components/backButton";
import LogInForm from "../_components/logInForm";

export default function Page() {
  return (
    <div className="flex flex-col  items-center">
      <main className="flex w-full max-w-360 flex-row justify-between items-center md:pl-25 ">
        <div className="w-full max-w-md flex flex-col gap-6">
          <div className="w-9 h-9">
            <BackButton />
          </div>

          <LogInForm />

          <div className="flex justify-center gap-2">
            <p>Dont have an account? </p>

            <span>
              <Link href={"/sign_up"} className="text-[#2563EB]">
                Sign up
              </Link>
            </span>
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
