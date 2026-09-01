import Header from "./_components/header/header";
import FoodMenu from "./_components/foodMenu";
import Footer from "./_components/footer";

export default function Home() {
  return (
    <div className="flex flex-col  items-center font-sans bg-[#1E1E1E]">
      <Header />
      <main className="flex bg-[#404040] w-full max-w-360 flex-col items-center mx-16 mt-17 sm:items-start">
        <img alt="hero" loading="eager" src={"/todaysOffer.jpg"} />

        <FoodMenu />
      </main>
      <Footer />
    </div>
  );
}
