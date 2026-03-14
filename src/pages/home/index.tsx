import LandingHeader from "@/components/homePage/landingHeader";
import Hero from "@/components/homePage/hero";
import About from "@/components/homePage/about";
import Category from "@/components/homePage/category";
import PartnerBenefits from "@/components/homePage/partnerBenefits";
import Requirements from "@/components/homePage/requirements";
import Banner from "@/components/homePage/banner";
import Benefits from "@/components/homePage/benefits";
import Faqs from "@/components/homePage/faqs";
import Footer from "@/components/homePage/footer";
import MobileHero from "@/components/homePage/mobileHero";
import TabletHero from "@/components/homePage/tabletHero";

export default function G20LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0f1a] text-[#f4f7ff]">
      <LandingHeader />

      <MobileHero />

      <TabletHero />

      <Hero />

      <About />

      <Category />

      <PartnerBenefits />

      <Requirements />

      <Banner />

      <Benefits />

      <Faqs />

      <Footer />
    </div>
  );
}
