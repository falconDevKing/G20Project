import { useEffect, useState } from "react";

import G20Crest from "@/assets/generalAppAssets/G20_logo.png";
import HeroBackgroundOne from "@/assets/generalAppAssets/GGP-hero.png";
import HeroBackgroundTwo from "@/assets/generalAppAssets/Prop2.jpg";
import HeroBackgroundThree from "@/assets/generalAppAssets/Prop3.jpg";
import HeroBackgroundFour from "@/assets/generalAppAssets/gp-bg.webp";
import HeroBackgroundFive from "@/assets/generalAppAssets/Prop 4.jpg";
import HeroBackgroundSix from "@/assets/generalAppAssets/Prop 5.jpg";
import HeroBackgroundSeven from "@/assets/generalAppAssets/Prop 6.jpg";
import HeroBackgroundEight from "@/assets/generalAppAssets/Prop 7.jpg";
import HeroBackgroundNine from "@/assets/generalAppAssets/Prop 8.jpg";
import HeroBackgroundTen from "@/assets/generalAppAssets/Prop 9.jpg";

import { GhostButton, PrimaryButton } from "../customIcons";

const heroImages = [
  HeroBackgroundOne,
  HeroBackgroundTwo,
  HeroBackgroundThree,
  HeroBackgroundFour,
  HeroBackgroundFive,
  HeroBackgroundSix,
  HeroBackgroundSeven,
  HeroBackgroundEight,
  HeroBackgroundNine,
  HeroBackgroundTen,
];

const Hero = () => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const imageRotationInterval = window.setInterval(() => {
      setActiveImageIndex((currentIndex) => (currentIndex + 1) % heroImages.length);
    }, 3000);

    return () => window.clearInterval(imageRotationInterval);
  }, []);

  return (
    <section className="relative overflow-hidden px-6 sm:px-16 lg:px-24">
      <div className="absolute inset-0">
        {heroImages.map((image, index) => (
          <img
            key={image}
            src={image}
            alt=""
            aria-hidden="true"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1500ms] ease-in-out ${
              index === activeImageIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-[#0b1120]/35" />
      </div>

      <div className="relative mx-auto px-4 py-14 sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-3 rounded-full border border-[#3c4863] bg-[#17253f] px-4 py-2">
              <span className="text-xs font-semibold tracking-[0.22em] text-[#d6b260] uppercase">House of Greats</span>
              <span className="h-1 w-1 rounded-full bg-[#95a9d1]" />
              <span className="text-xs text-[#c8d6f3]">Annual Partnership</span>
            </div>

            <h1 className="mt-6 text-4xl font-bold tracking-tight text-[#f8f1e3] sm:text-5xl ">Stand with the mandate of taking the Gospel to all Nations.</h1>

            <p className="mt-5 max-w-xl text-sm leading-7 text-[#d3ddf1] sm:text-base">
              The G20 is a select group of men and women committed to standing with Prophet Isaiah Macwealth in fulfilling the divine mandate of global Gospel
              advancement, leading to the harvest of 1 billion souls and 3 million Jews conversion.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="rounded-full border border-[#3c4863] bg-[#1a2945] px-4 py-2 text-sm text-[#d8e2f7]">
                Minimum annual commitment: <span className="font-semibold text-[#f0cf86]">NGN 1,000,000</span>
              </div>
              <div className="rounded-full border border-[#3c4863] bg-[#1a2945] px-4 py-2 text-sm text-[#d8e2f7]">Conviction-led Partnership</div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <PrimaryButton href="/register">Join the G20</PrimaryButton>
              <GhostButton href="/paymentButton" className="hidden sm:inline-flex">
                Give now
              </GhostButton>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                { title: "Purposeful", body: "Giving with clarity, intention, and meaning." },
                { title: "Impactful", body: "High-capacity partnership for major Gospel projects." },
                { title: "Accountable", body: "A clear personal record of your annual partnership." },
              ].map((c) => (
                <div key={c.title} className="rounded-2xl border border-[#2f3c57] bg-[#111c31] p-5">
                  <p className="text-sm font-semibold text-[#f8f1e3]">{c.title}</p>
                  <p className="mt-2 text-sm text-[#b9c8e7]">{c.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div className="relative rounded-3xl border border-[#2f3c57] bg-[#111c31] p-8">
              <div className="mx-auto grid place-items-center">
                <img src={G20Crest} alt="G20 crest" className="h-48 w-48 object-contain" />
              </div>
              <div className="mt-6 text-center">
                <p className="text-xs font-semibold tracking-[0.22em] text-[#d6b260] uppercase">Who we are</p>
                <p className="mt-2 text-xl font-semibold text-[#f8f1e3]">The House of Greats</p>
                <p className="mt-3 text-sm text-[#c9d6f0]">
                  A community of giants in this generation, standing in strength and discernment to advance the cause of the Gospel.
                </p>
              </div>

              <div className="mt-6 rounded-2xl border border-[#34415b] bg-[#1b2842] p-5">
                <p className="text-sm italic text-[#f0cf86]">"These also are the chief of the mighty men whom David had..."</p>
                <p className="mt-2 text-xs font-semibold text-[#b9c8e7]">1 Chronicles 11:10</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
