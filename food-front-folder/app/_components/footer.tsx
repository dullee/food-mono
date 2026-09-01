import Image from "next/image";

import logo from "@/public/logo.svg";
import instaIcon from "@/public/instagramIcon.svg";
import faceIcon from "@/public/facebookIcon.svg";

export default function Footer() {
  return (
    <div className="flex flex-col w-screen items-center text-white bg-[#18181B] md:h-188.75 md:pt-15">
      <div className="w-full bg-[#EF4444]  md:h-23"></div>
      <div className="flex flex-col w-full max-w-360 md:px-22 md:pt-19">
        <div className="flex flex-row md:gap-55 md:pb-26">
          <div className="w-22 h-23.25 relative">
            <Image alt="logo" src={logo} fill />
          </div>
          <div className="flex  md:gap-28 flex-row">
            <div className="flex flex-col gap-4">
              <p className="text-[#71717A]">NOMNOM</p>
              <p>Home</p>
              <p>Contact us</p>
              <p>Delivery zone</p>
            </div>
            <div className="flex flex-row md:gap-14">
              <div className="flex flex-col md:gap-4">
                <p className="text-[#71717A]">MENU</p>
                <p>Appetizers</p>
                <p>Salads</p>
                <p>Pizzas</p>
                <p>Lunch favorites</p>
                <p>Main dishes</p>
              </div>
              <div className="flex flex-col md:gap-4 pt-10">
                <p>Side dish</p>
                <p>Brunch</p>
                <p>Desserts</p>
                <p>Beverages</p>
                <p>Fish & Sea foods</p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <p className="text-[#71717A]">FOLLOW US</p>
              <div className="flex gap-4">
                <Image alt="facebook" src={faceIcon} />
                <Image alt="instagram" src={instaIcon} />
              </div>
            </div>
          </div>
        </div>
        <div className="flex py-8 md:gap-12 border-t text-[#71717A] border-[#404040]">
          <p>Copy right 2024 © Nomnom LLC</p>

          <p>Privacy policy</p>
          <p>Terms and conditoin</p>
          <p>Cookie policy</p>
        </div>
      </div>
    </div>
  );
}
