import Banner from "../components/home/Banner";
import FeaturedCars from "../components/home/FeaturedCars";
import WhyChooseUs from "../components/home/WhyChooseUs";
import HowItWorks from "../components/home/HowItWorks";
import StatsBar from "../components/home/StatsBar";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <Banner />
      <StatsBar />
      <FeaturedCars />
      <WhyChooseUs />
      <HowItWorks />
    </div>
  );
}
