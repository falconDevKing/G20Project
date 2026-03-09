import { ContainerFluid } from "../containerFluid";
import HandShake from "../../assets/shake.png";
import { HowToRemitSection } from "./HowToRemit";
import { useAppSelector } from "@/redux/hooks";
import { CurrencyCode, GGPCategories } from "@/constants";
import BenefitsIcon from "../../assets/be.svg";
import { formatCamelCaseToCapitalisedSentence } from "@/lib/textUtils";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { VisitorOnlinePayment } from "../paymentHistoryTable/visitorsOnlinePayment";

export const Partnership = () => {
  const { locationCurrency, fallbackCurrency, showPayment } = useAppSelector((state) => state?.app);
  const partnershipDetails = GGPCategories[locationCurrency as CurrencyCode] || GGPCategories[fallbackCurrency as CurrencyCode] || GGPCategories["USD"];

  const benefits = [
    { name: "Fulfilling the Kingdom Mandate - As a partner, you play an active role in taking the Gospel to nations." },
    {
      name: "Sharing in the Prophet’s Reward - As a covenant partner, you share in the Prophet’s grace and blessings for remarkable testimonies.",
    },
    { name: "Create Eternal Value - Your partnership translates into lasting spiritual impact, accrued into your account." },
    { name: "⁠Build a Lasting Legacy - Your partnership creates a footprint of faith, love, and generosity." },
    {
      // name: "⁠Gain Global Influence - Your partnership drives a worldwide vision that shapes lives and nations, bringing tangible transformation to individuals and communities..",
      name: "⁠Gain Global Influence - Your partnership drives a worldwide vision that shapes lives and nations, bringing tangible transformation",
    },

    {
      name: "Enjoy Spiritual Covering  -  Your partnership places you under a covering of constant prayers, crowned by the Prophet’s monthly prayer.",
    },
    {
      name: "Special Birthday Celebration -  As a partner, you recive a special personalised birthday celebration and prayers as a way to appreciate you.",
    },
    {
      name: "Recognition and Awards  - Heaven records your impact, and we honour it too by recognising outstanding partners at our annual awards ceremony.",
    },
    // { name: "⁠Be Part of Impact Stories - See tangible results of transformed lives and communities." },
    // { name: "Partner ID for designated ministry lines" },
    // { name: "Emails with updates from the Prophet" },
    // { name: "Dedicated partner care & support" },
    // { name: "Access to in-app partner gifts (where applicable)" },
  ];

  type partnerDataData = {
    title: string;
    body: string | ReactNode;
  };

  const partnerData: partnerDataData[] = [
    {
      title: "Who is a GGP Partner?",
      body: (
        <p>
          A GGP Partner is one who has passion for kingdom advancement and has made a monthly covenant commitment towards global gospel expansion.
          <div className="py-2">By this partnership, he is enforcing the the will of God on earth, doing bigger things with God through their finances.</div>
          <div className="py-2">(See partnership categories to choose how you want to make a difference with the Prophet in spreading the Gospel)</div>
        </p>
      ),
    },
    {
      title: "Why GGP Partnership?",
      body: (
        <div>
          <p>
            <strong>Prophet Isaiah Macwealth</strong>, a seasoned philanthropist whose works over the years have touched countless lives, has through his
            leadership:
          </p>
          <ul style={{ listStyleType: "disc", paddingLeft: "20px", marginTop: "8px", marginBottom: "8px" }}>
            <li>Empowered thousands of families through charity fairs and outreach initiatives.</li>
            <li>Provided widows and orphans with food, clothing, and educational support.</li>
            <li>Brought sustainable relief and hope to communities in crisis.</li>
          </ul>
          <p>
            This same vision drives the <strong>Global Gospel Partnership (GGP)</strong>, making your partnership both eternal and practical.
          </p>
        </div>
      ),
    },
    // {
    //   title: "What Role do you play as a Partner?",
    //   body: (
    //     <div>
    //       <p>
    //         Through <strong>GGP</strong>, you become part of a proven global mandate that:
    //       </p>
    //       <ul style={{ listStyleType: "disc", paddingLeft: "20px", marginTop: "8px", marginBottom: "8px" }}>
    //         <li>Plants churches where none exist.</li>
    //         <li>Funds missions into territories others cannot reach.</li>
    //         <li>Sustains media projects that dominate global airwaves with the Gospel.</li>
    //         <li>Provides humanitarian relief and long-term solutions to communities in need.</li>
    //       </ul>
    //     </div>
    //   ),
    // },
    {
      title: "The Impact of Your Partnership",
      body: (
        <div>
          <p>Your monthly commitment directly supports:</p>
          <ul style={{ listStyleType: "disc", paddingLeft: "20px", marginTop: "8px", marginBottom: "8px" }}>
            <li>
              <strong>Church Planting &amp; Missions</strong> – establishing new churches and sending missions to reach nations with the Gospel of Jesus Christ.
            </li>
            <li>
              <strong>Media Outreach</strong> – dominating global airwaves through TV, satellite, and digital platforms, reaching millions with the Gospel.
            </li>
            <li>
              <strong>Charity Fairs</strong> – providing food, clothing, and care for widows, orphans, and the needy.
            </li>
            <li>
              <strong>Community Outreach</strong> – bringing hope, transformation, and dignity to those living in hardship through acts of kindness.
            </li>
            <li>
              <strong>Strengthen Existing Churches</strong> – supporting facility upgrade, equipments purchase for the better equipping of believers through
              teaching, training, and discipleship, within the ministry and several other churches in the body of Christ.
            </li>
          </ul>
        </div>
      ),
    },
  ];

  return (
    <section id="partnerships">
      <div className="bg-[#000000] min-h-fit">
        <section className="">
          <ContainerFluid className=" max-w-[1300px] p-3 ">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-10 ">
              {partnerData.map((item, i) => {
                const isLastOdd = partnerData.length % 2 === 1 && i === partnerData.length - 1; // 3rd item in your case
                return (
                  <div
                    key={i + "a"}
                    className={`rounded-2xl border border-white/10 h-64 bg-[#FFFBF2] dark:text-[#121212] p-9 ${isLastOdd ? "sm:col-span-2 h-fit" : "h-full"}`}
                  >
                    <h3 className="text-lg md:text-4xl font-bold tracking-tighter text-GGP-darkGold">{item.title}</h3>
                    <div className="mt-3  text-base leading-relaxed">{item.body}</div>
                  </div>
                );
              })}
            </div>
          </ContainerFluid>
        </section>
      </div>

      {/* About: 3 cards */}

      {/* Partnership Categories */}
      <section className="bg-[#1B100E] text-white h-fit pb-7">
        <ContainerFluid className="py-7 ">
          <h2 className="text-center text-2xl md:text-4xl font-bold uppercase [background-image:radial-gradient(ellipse_at_bottom,var(--tw-gradient-stops))] from-GGP-lightGold to-GGP-darkGold bg-clip-text text-transparent">
            Monthly Partnership Categories
          </h2>

          <div className="mt-8 grid md:grid-cols-2 max-w-[700px]  p-3 md:p-0 mx-auto gap-x-10 gap-y-6">
            {Object.entries(partnershipDetails).map(([title, data], index) => (
              <div className="flex flex-col lg:pl-7" key={index + "b"}>
                <div
                  className=" tracking-tighter px-2  rounded-sm bg-[radial-gradient(ellipse_at_bottom,var(--tw-gradient-stops))] 
                          from-GGP-lightGold to-GGP-darkGold text-[#1B100E] font-black  p-1 text-2xl mb-4"
                >
                  {formatCamelCaseToCapitalisedSentence(title)}
                </div>
                <div className=" flex flex-col space-y-1 uppercase">
                  {data.map((item, i) => (
                    <div className="flex items-center gap-x-2" key={index + i + "c"}>
                      <h1 className=" text-GGP-lightGold track">{item.rank}:</h1>
                      <p> {item.amount}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-12 flex flex-col flex-wrap justify-center gap-4 w-[168px] mx-auto">
            <VisitorOnlinePayment position={"justify-center"} mode="red" openPayment={showPayment || false} />

            <div className="w-full flex justify-center">
              <Button className="bg-[#E7000B] text-white text-lg w-[168px]" asChild size={"lg"}>
                <Link to="/register">Sign up Today!</Link>
              </Button>
            </div>
          </div>
        </ContainerFluid>
      </section>

      {/* Benefits */}
      <section className=" bg-[#121212] text-white py-4 md:py-0">
        <ContainerFluid>
          <div className=" text-white text-center space-y-2 ">
            <h2 className=" text-2xl md:text-5xl font-bold text-GGP-darkGold">Benefits of Partnership</h2>
            {/* <p>As a partner with the Prophet, you will receive:</p> */}
          </div>

          <div className="max-w-[700px] w-full mx-auto p-3 md:p-0 ">
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-1  md:pl-7 list-none md:py-12 py-7">
              {" "}
              {/* 2 per row */}
              {benefits.map((b) => (
                <li key={b.name} className="flex items-start gap-2 p-1 pb-7 rounded">
                  <img src={BenefitsIcon} alt="" className="h-5 w-5 mt-1" />
                  <div>
                    <span className="font-bold text-GGP-lightGold">{b.name.split(" - ")[0]}</span> -{" "}
                    <span className="font-light italic ">{b.name.split(" - ")[1]}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-12 lg:mb-24 flex justify-center">
            <Button className="bg-[#E7000B] dark:text-white p-4 px-12 text-xl" asChild size={"lg"}>
              <Link to="/register">Sign up Today!</Link>
            </Button>
          </div>
        </ContainerFluid>

        <div className="mx-8 lg:mx-16 pb-12">
          <img src={HandShake} className="min-w-full rounded-2xl" alt="partners-shake" />
        </div>
      </section>

      {/* How to Remit */}
      <HowToRemitSection locationCurrency={locationCurrency} fallbackCurrency={fallbackCurrency} />
    </section>
  );
};
