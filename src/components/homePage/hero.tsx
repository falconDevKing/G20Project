import { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import { getBronzeMinimumValue } from "@/lib/g20Categories";

import G20Crest from "@/assets/heroImages/G20_logo.png";
import HOGCrest from "@/assets/heroImages/HOG_logo.png";
import MMWCrest from "@/assets/heroImages/MMW_logo.png";
// import HeroBackground from "@/assets/heroImages/G20 BANNER LEFT.jpeg";
import HeroBackgroundOne from "@/assets/heroImages/newBgPic2.jpeg";
import HeroBackgroundTwo from "@/assets/heroImages/newBgPic6.jpeg";
import HeroBackgroundThree from "@/assets/heroImages/newBgPic8.jpeg";
import HeroBackgroundFour from "@/assets/heroImages/newBgPic10.jpeg";
import HeroBackgroundFive from "@/assets/heroImages/newBgPic14.jpeg";
import HeroBackgroundSix from "@/assets/heroImages/newBgPic15.jpeg";
import HeroBackgroundSeven from "@/assets/heroImages/Prop 9.jpg";
import HeroBackgroundEight from "@/assets/heroImages/Prop 3.jpg";
import HeroBackgroundNine from "@/assets/heroImages/Prop 7.jpg";
import HeroBackgroundTen from "@/assets/heroImages/Prop 6.jpg";
import HeroBackgroundEleven from "@/assets/heroImages/newBgPic9.jpeg";

import { PrimaryButton } from "../customIcons";
import { OfflineBankDetails } from "./offlinePaymentDetails";

const heroImages = [
  // HeroBackground,
  HeroBackgroundOne,
  HeroBackgroundFour,
  HeroBackgroundThree,
  HeroBackgroundTwo,
  HeroBackgroundFive,
  HeroBackgroundSix,
  HeroBackgroundSeven,
  HeroBackgroundEight,
  HeroBackgroundNine,
  HeroBackgroundTen,
  HeroBackgroundEleven,
];

const crestImages = [G20Crest, HOGCrest, MMWCrest];

const Hero = () => {
  const { locationCurrency, fallbackCurrency } = useAppSelector((state) => state.app);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [crestImageIndex, setCrestImageIndex] = useState(0);
  const bronzeMinimumValue = getBronzeMinimumValue({ locationCurrency, fallbackCurrency });

  useEffect(() => {
    const imageRotationInterval = window.setInterval(() => {
      // setActiveImageIndex(() => Math.floor(Math.random() * heroImages.length));
      setActiveImageIndex((currentIndex) => (currentIndex + 1) % heroImages.length);
      setCrestImageIndex((currentIndex) => (currentIndex + 1) % crestImages.length);
    }, 5000);

    return () => window.clearInterval(imageRotationInterval);
  }, []);

  return (
    // <section className="relative overflow-hidden px-4 sm:px-6">
    <div className="relative overflow-hidden hidden xl:block">
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
        <div className="absolute inset-0 bg-[#0b1120]/40" />
      </div>

      <div className="relative mx-auto  py-10 sm:py-12 lg:py-14  flex flex-row">
        <div className="relative basis-1/12 hidden xl:flex"></div>

        <div className="ml-auto mr-0 grid grid-cols-1 items-center gap-8 xl:grid-cols-2 lg:gap-10 basis-9/12">
          <div>
            <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-[#3c4863] bg-[#17253f] px-4 py-2">
              <span className="text-xs font-semibold tracking-[0.22em] text-[#d6b260] uppercase">House of Greats</span>
              <span className="h-1 w-1 rounded-full bg-[#95a9d1]" />
              <span className="text-xs text-[#c8d6f3]">Annual Partnership</span>
            </div>

            <h1 className="mt-6 max-w-2xl text-3xl font-bold tracking-tight text-[#f8f1e3] sm:text-4xl lg:text-5xl">
              Stand with the mandate of taking the Gospel to all Nations.
            </h1>

            <p className="mt-5 w-full xl:max-w-xl text-base leading-7 text-[#d3ddf1] sm:text-md text-justify">
              The G20 is a select group of men and women committed to standing with Prophet Isaiah Macwealth in fulfilling the divine mandate of global Gospel
              advancement, leading to the harvest of 1 billion souls and 3 million Jews conversion.
            </p>

            <div className="w-full flex justify-end">
              <PrimaryButton href="/register" fullWidthOnMobile>
                Join the G20
              </PrimaryButton>
            </div>

            <div>
              {/* <div className="relative mx-auto w-full max-w-md my-6">
                <div className="relative rounded-3xl border border-[#2f3c57] bg-[#111c31] p-5 sm:p-6 lg:p-8">
                  <div className="w-full flex justify-center">
                    {crestImages.map((image, index) => (
                      <img
                        key={image}
                        src={image}
                        alt="G20 crest"
                        aria-hidden="true"
                        className={`h-32 w-32 object-contain transition-opacity duration-[1500ms] ease-in-out sm:h-40 sm:w-40 lg:h-48 lg:w-48 ${
                          index === crestImageIndex ? "" : "hidden"
                        }`}
                      />
                    ))}
                  </div>

                  <div className="mt-6 text-center">
                    <p className="text-xs font-semibold tracking-[0.22em] text-[#d6b260] uppercase">Who we are</p>
                    <p className="mt-2 text-lg font-semibold text-[#f8f1e3] sm:text-xl">The House of Greats</p>
                    <p className="mt-3 text-sm text-[#c9d6f0]">
                      A community of giants in this generation, standing in strength and discernment to advance the cause of the Gospel.
                    </p>
                  </div>

                  <div className="mt-6 rounded-2xl border border-[#34415b] bg-[#1b2842] p-4 sm:p-5 text-center">
                    <p className="text-sm italic text-[#f0cf86]">"These also are the chief of the mighty men whom David had..."</p>
                    <p className="mt-2 text-xs font-semibold text-[#b9c8e7]">1 Chronicles 11:10</p>
                  </div>
                </div>
              </div> */}

              <>
                {/* <div className="mt-6 flex flex-col gap-3 sm:hidden sm:flex-row sm:flex-wrap sm:items-center">
                  <div className="rounded-full border border-[#3c4863] bg-[#1a2945] px-4 py-2 text-sm text-[#d8e2f7]">
                    Minimum annual commitment: <span className="font-semibold text-[#f0cf86]">{bronzeMinimumValue}</span>
                  </div>
                  <div className="rounded-full border border-[#3c4863] bg-[#1a2945] px-4 py-2 text-sm text-[#d8e2f7]">Conviction-led Partnership</div>
                </div> */}

                <div className="mt-8 grid grid-cols-2 sm:hidden  gap-3 sm:flex-row sm:flex-wrap">
                  <PrimaryButton href="/register" fullWidthOnMobile>
                    Join the G20
                  </PrimaryButton>
                  {/* <OfflineBankDetails fullWidthOnMobile /> */}
                </div>
              </>
            </div>

            {/* <div className="hidden sm:grid grid-cols-2 my-6 gap-6 ">
              <div className="rounded-full border border-[#3c4863] bg-[#1a2945] px-4 py-2 text-sm text-[#d8e2f7]">
                Minimum annual commitment: <span className="font-semibold text-[#f0cf86]">{bronzeMinimumValue}</span>
              </div>
              <div className="rounded-full border border-[#3c4863] bg-[#1a2945] px-4 py-2 text-sm text-[#d8e2f7]">Conviction-led Partnership</div>

              <PrimaryButton href="/register" fullWidthOnMobile>
                Join the G20
              </PrimaryButton>
              <OfflineBankDetails fullWidthOnMobile className="w-full sm:w-full" />
            </div> */}

            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                { title: "Purposeful", body: "Giving with clarity, intention, and meaning." },
                { title: "Impactful", body: "High-capacity partnership for major Gospel projects." },
                { title: "Accountable", body: "A clear personal record of your annual partnership." },
              ].map((c) => (
                <div key={c.title} className="rounded-2xl border border-[#2f3c57] bg-[#111c31] p-4 sm:p-5">
                  <p className="text-sm font-semibold text-[#f8f1e3]">{c.title}</p>
                  <p className="mt-2 text-sm text-[#b9c8e7]">{c.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative ml-auto mr-0 w-full max-w-md hidden xl:block">
            <div className="relative rounded-3xl border border-[#2f3c57] bg-[#111c31] p-5 sm:p-6 lg:p-8 lg:px-4">
              <div className="w-full flex justify-center">
                {crestImages.map((image, index) => (
                  <img
                    key={image}
                    src={image}
                    alt="G20 crest"
                    aria-hidden="true"
                    className={`h-32 w-32 object-contain transition-opacity duration-[1500ms] ease-in-out sm:h-40 sm:w-40 lg:h-48 lg:w-48 ${
                      index === crestImageIndex ? "" : "hidden"
                    }`}
                  />
                ))}
              </div>
              {/* <img src={G20Crest} alt="G20 crest" className="h-48 w-48 object-contain" /> */}

              <div className="mt-6 text-center">
                <p className="text-xs font-semibold tracking-[0.22em] text-[#d6b260] uppercase">Who we are</p>
                <p className="mt-2 text-lg font-semibold text-[#f8f1e3] sm:text-xl">The House of Greats</p>
                <p className="mt-3 text-sm text-[#c9d6f0]">
                  A community of giants in this generation, standing in strength and discernment to advance the cause of the Gospel.
                </p>
              </div>

              <div className="mt-6 rounded-2xl border border-[#34415b] bg-[#1b2842] p-4 sm:p-5">
                <p className="text-sm italic text-[#f0cf86]">"These also are the chief of the mighty men whom David had..."</p>
                <p className="mt-2 text-xs font-semibold text-[#b9c8e7]">1 Chronicles 11:10</p>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="relative basis-2/12 py-10 px-6  flex-col justify-evenly hidden xl:flex"> */}
        <div className="relative basis-2/12 py-32 px-8 flex-col justify-evenly hidden xl:flex text-center ">
          {/* <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <div className="rounded-full border border-[#3c4863] bg-[#1a2945] px-4 py-2 text-sm text-[#d8e2f7]">
              Minimum annual commitment: <span className="font-semibold text-[#f0cf86]">{bronzeMinimumValue}</span>
            </div>
            <div className="rounded-full border border-[#3c4863] bg-[#1a2945] px-4 py-2 text-sm text-[#d8e2f7]">Conviction-led Partnership</div>
          </div>
          <div className="mt-8 grid grid-cols-2 sm:flex  gap-3 sm:flex-row sm:flex-wrap">
            <PrimaryButton href="/register" fullWidthOnMobile>
              Join the G20
            </PrimaryButton>
            <OfflineBankDetails fullWidthOnMobile />
          </div> */}
          <div className="rounded-full  bg-[#1a2945] px-4 py-2 text-sm text-[#d8e2f7] border border-[#c39a41]">
            Conviction-led <br /> Partnership
          </div>

          <div className="rounded-full  bg-[#1a2945] px-4 py-2 text-sm text-[#d8e2f7] border border-[#c39a41]">
            Minimum Annual Commitment: <span className="font-semibold text-[#f0cf86]">{bronzeMinimumValue}</span>
          </div>

          {/* <PrimaryButton href="/register" fullWidthOnMobile className="w-full sm:w-full">
            Join the G20
          </PrimaryButton> */}
          <OfflineBankDetails fullWidthOnMobile className="w-full sm:w-full" />
        </div>
      </div>
    </div>
  );
};

export default Hero;
