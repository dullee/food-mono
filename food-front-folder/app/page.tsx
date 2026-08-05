import Image from "next/image";
import Header from "./_components/header";
import FoodMenu from "./_components/foodMenu";
import Footer from "./_components/footer";

export default function Home() {
  return (
    <div className="flex flex-col  items-center font-sans bg-[#404040]">
      <main className="flex w-full max-w-360 flex-col items-center px-16 sm:items-start">
        <Header/>
        <Image width={1440} height={570} alt="hero" src={"/BG.svg"} />
        <FoodMenu />
      </main>
      <Footer />
    </div>
  );
}
