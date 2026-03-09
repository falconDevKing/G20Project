import LandingHeader from "@/components/homePage/landingHeader";
import Hero from "@/components/homePage/hero";
import About from "@/components/homePage/about";
import Category from "@/components/homePage/category";
import Requirements from "@/components/homePage/requirements";
import Banner from "@/components/homePage/banner";
import Benefits from "@/components/homePage/benefits";
import Faqs from "@/components/homePage/faqs";
import Footer from "@/components/homePage/footer";

export default function G20LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <LandingHeader />

      <Hero />

      <About />

      <Category />

      <Requirements />

      <Banner />

      <Benefits />

      <Faqs />

      <Footer />
    </div>
  );
}
