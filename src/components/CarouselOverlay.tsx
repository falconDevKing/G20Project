import React, { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ArrowLeft, ArrowRight } from "lucide-react";

const carouselItems = [
  {
    captionText: "Welcome to House of Greats (G20)",
    subCaptionText:
      "Thank you for choosing to stand with the Prophet in advancing the Gospel to all Nations. As a valued partner, you are part of a global vision that is touching nations and transforming lives.",
    pictureStyle: "fill",
    role: "Prophet Isaiah Macwealth",
    church: "Senior Pastor - Gospel Pillars Intl. Church",
    // image: "/images/GlobeWithHands.svg",
    // image: "/images/G20_Table.jpg",
    image: "/auth/G20 BANNER LEFT TEXT.jpeg",
    // image: "/auth/newG20ParliamentTable.jpeg",
  },
  {
    captionText: "Together with the Prophet, Reaching the Nations",
    subCaptionText: "One Vision. One Mission. One Partnership.",
    pictureStyle: "cover",

    image: "/images/GlobeWithHands.svg",
  },
  {
    captionText: "Through G20, you become part of a proven global mandate that:",
    subCaptionText: (
      <div>
        <ul style={{ listStyleType: "disc", paddingLeft: "20px", marginTop: "8px", marginBottom: "8px" }}>
          <li>Plants churches where none exist.</li>
          <li>Funds missions into territories others cannot reach.</li>
          <li>Sustains media projects that dominate global airwaves with the Gospel.</li>
          <li>Provides humanitarian relief and long-term solutions to communities in need.</li>
        </ul>
      </div>
    ),
    pictureStyle: "cover",
    image: "/auth/newBgPic9.jpeg",
    // image: "/auth/newG20ParliamentTable.jpeg",
  },
  // {
  //   captionText: "Empower thousands of families through charity fairs and outreach initiatives.",
  //   pictureStyle: "cover",
  //   image: "/images/Charity 1.svg",
  // },
  {
    captionText: "Through this platform, you will:",
    subCaptionText: (
      <div>
        <ul style={{ listStyleType: "disc", paddingLeft: "20px", marginTop: "8px", marginBottom: "8px" }}>
          <li>Receive regular updates and reports.</li>
          <li>Stay connected with the Prophet’s mission.</li>
          <li>See how your partnership is making a tangible global impact.</li>
        </ul>
      </div>
    ),
    pictureStyle: "cover",
    image: "/auth/newBgPic7.jpeg",
  },
  {
    captionText: "Join Prophet Isaiah Macwealth, a seasoned philanthropist to:",
    subCaptionText: (
      <div>
        <ul style={{ listStyleType: "disc", paddingLeft: "20px", marginTop: "8px", marginBottom: "8px" }}>
          <li>Empower thousands of families through charity fairs and outreach initiatives.</li>
          <li>Provide widows and orphans with food, clothing, and educational support, and</li>
          <li>Bring sustainable relief and hope to communities in crisis.</li>
        </ul>
      </div>
    ),
    pictureStyle: "cover",
    image: "/auth/AuthSuit1.jpeg",
    // image: "/auth/AuthSuit2.jpeg",
  },
  {
    captionText: "Join Prophet Isaiah MacWealth in taking the Gospel to all nations of the earth.",
    pictureStyle: "fill",
    image: "/images/Globe.svg",
    // image: "/images/Globe.svg",
  },

  // old
  // {
  //   text: "“You cannot earn beyond the value you create. Whose problem are you solving?”",
  //   author: "Prophet Isaiah MacWealth",
  //   role: "Senior Pastor",
  //   church: "Gospel Pillars Intl. Church",
  //   image: "/images/prophet-login.png",
  // },
  // {
  //   text: "“You cannot earn beyond the value you create. Whose problem are you solving?”",
  //   author: "Prophet Isaiah MacWealth",
  //   role: "Senior Pastor",
  //   church: "Gospel Pillars Intl. Church",
  //   image: "/images/prophet-register.png",
  // },
  // {
  //   text: "“You cannot earn beyond the value you create. Whose problem are you solving?”",
  //   author: "Prophet Isaiah MacWealth",
  //   role: "Senior Pastor",
  //   church: "Gospel Pillars Intl. Church",
  //   image: "/images/prophet-login2.png",
  // },
];

export const CarouselOverlay = () => {
  const autoplay = React.useRef(Autoplay({ delay: 4000, stopOnInteraction: false }));

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [autoplay.current]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  return (
    <div className="relative w-full h-full overflow-y-hidden">
      {/* Slides */}
      <div className="overflow-hidden w-full h-full" ref={emblaRef}>
        <div className="flex h-full">
          {carouselItems.map((item, index) => (
            <div key={index + "a"} className="relative min-w-full h-full mask-gradient">
              <img src={item.image} alt="" className={`absolute inset-0 w-full h-full object-${item.pictureStyle || "cover"}`} />
              <div className="absolute bottom-0 left-0 w-full h-3/4 bg-gradient-to-t dark:from-[#121212] from-[#121212] to-transparent" />
              <div className="absolute bottom-12 left-14 text-white w-full max-w-[541px] z-10">
                <p className="text-4xl font-medium mb-5">{item.captionText}</p>
                <h6 className="text-md font-medium mb-2">{item.subCaptionText}</h6>
                <p className="text-md">{item.role}</p>
                <p className="text-md">{item.church}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4 z-20">
          <button
            onClick={scrollPrev}
            className="w-14 h-14 rounded-full bg-transparent border flex items-center dark:border-white/50 justify-center text-white hover:bg-G20-darkGold/50"
          >
            <ArrowLeft size={20} />
          </button>
          <button
            onClick={scrollNext}
            className="w-14 h-14 rounded-full bg-transparent border flex items-center dark:border-white/50 justify-center text-white hover:bg-G20-darkGold/50"
          >
            <ArrowRight size={20} />
          </button>
        </div>
      </div>

      {/* Navigation Buttons */}
    </div>
  );
};
