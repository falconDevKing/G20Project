import { ContainerFluid } from "@/components/containerFluid";
import { Landmark, Globe2, MapPin, PhoneCall } from "lucide-react";
import MoneyBlur from "../../assets/mon.svg";
import { Link } from "react-router";
import { VisitorOnlinePayment } from "../paymentHistoryTable/visitorsOnlinePayment";
import { Button } from "../ui/button";

type RemitItem = {
  key: string;
  title: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  lines?: string[]; // for bank details list
  body?: string; // paragraph
  link?: string | React.ReactNode; // external link
  linkLabel?: string;
  phone?: string; // phone text
};

const locationAddress: Record<string, string> = {
  NGN: "at G20 Lounge, Ark of Light For All Nations",
  USD: "USA, at 609 Truman St, Arlington, TX 76011, United States",
  CAD: "Canada, at 2220 Midland Avenue, Scarborough, ON M1P 3E6, Canada",
  GBP: "UK, at Capital House, 47 Rushey Green, London. SE6 4AS",
  GHS: "Ghana, at Ring Road Central, opp. Provident Tower, same building as Ernest Chemist, Accra",
  ZAR: "South Africa, at 41 Nana Sita St, Pretoria Central, Pretoria, 0002",
  EUR: "UK, at Capital House, 47 Rushey Green, London. SE6 4AS",
  USDAF: "USA, at 609 Truman St, Arlington, TX 76011, United States",
};

const locationPhoneNumber: Record<string, string> = {
  NGN: "+234 906 671 0879",
  CAD: "+1 647-803-5088",
  USD: "+1 469-597-6952",
  GBP: "+44 7840 303 710, +44 7727 683 097",
  GHS: "+233 500 599002",
  ZAR: "+27 747 784040",
  EUR: "+44 7840 303 710, +44 7727 683 097",
  USDAF: "+1 469-597-6952",
};

const locationBankDetails: Record<string, string[]> = {
  NGN: ["Gospel Pillars Ministry HIP", "Account No.: 1012861782", "Bank: Zenith Bank"],
  CAD: [
    "Gospel Pillars International Church",
    "Account No.: 1022987",
    "Transit Number: 09847",
    "Institution Number: 003",
    "Institution Name: Royal Bank of Canada",
    "Interac: gospelpillarscanada@gmail.com",
  ],
  // USD: ["+1 469-597-6952"],
  GBP: [
    "GOSPEL PILLARS MINISTRY GGP",
    "Account No.: 56359656",
    "Sort Code: 23-05-80",
    "Bank: Metro Bank",
    "SWIFT BIC: MYMBGB2L",
    "IBAN: GB59MYMB23058056359656",
    // "Account Type: BUSINESS",
  ],
  GHS: ["Gospel Pillars Ministry", "Account No.: 6010726395", "Bank: Zenith Bank Ghana"],
  ZAR: ["The Members Gospel Pillars International Ministry", "Account No.: 10133389454", "Bank: Standard Bank"],
  USD: [
    "Isaiah Wealth Ministries",
    "Account No.: 0278339553",
    "Routing Number: 111900785",
    "Bank: Regions Bank",
    "SWIFT BIC: UPNBUS44",
    // "Account Type: BUSINESS",
    // "IBAN: GB59MYMB23058056359656",
  ],
  EUR: [
    "GOSPEL PILLARS MINISTRY GGP",
    "Account No.: 56359656",
    "Sort Code: 23-05-80",
    "Bank: Metro Bank",
    "SWIFT BIC: MYMBGB2L",
    "IBAN: GB59MYMB23058056359656",
    // "Account Type: BUSINESS",
  ],
  USDAF: [
    "Isaiah Wealth Ministries",
    "Account No.: 0278339553",
    "Routing Number: 111900785",
    "Bank: Regions Bank",
    "SWIFT BIC: UPNBUS44",
    // "Account Type: BUSINESS",
    // "IBAN: GB59MYMB23058056359656",
  ],
};

export function HowToRemitSection({ locationCurrency, fallbackCurrency }: { locationCurrency: string, fallbackCurrency: string }) {
  const remitItems: RemitItem[] = [
    {
      key: "bank",
      title: "Bank Payment Details",
      icon: Landmark,
      lines: locationBankDetails[locationCurrency] || locationBankDetails[fallbackCurrency],
    },
    {
      key: "online",
      title: "Online Payment",
      icon: Globe2,
      body: "Pay online through our website:",
      link: <div className="pt-6">
        <VisitorOnlinePayment position={"justify-center"} mode='red' />
      </div>
      ,
      // link: isNigeria ? (
      //   "https://gospelpillars.org/give"
      // ) : (
      //   <div className="pt-6">
      //     <VisitorOnlinePayment position={"justify-center"} />
      //   </div>
      // ),
      // linkLabel: "https://gospelpillars.org/give",
    },
    {
      key: "office",
      title: "Physical Office",
      icon: MapPin,
      body: `Visit us at the Global Partnership Office  ${locationAddress[locationCurrency] || locationAddress[fallbackCurrency]}. (8am – 5pm, Mondays to Fridays).`,
    },
    {
      key: "contact",
      title: "Contact",
      icon: PhoneCall,
      body: "For further assistance or clarifications, kindly reach us on",
      phone: locationPhoneNumber[locationCurrency] || locationPhoneNumber[fallbackCurrency],
    },
  ];


  return (
    <section id="how-to-remit" className="relative bg-[#CCA33D] py-12 md:py-16 overflow-hidden scroll-mt-28" style={{ backgroundImage: `url(${MoneyBlur})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>

      <div>
        <ContainerFluid className=" max-w-[900px] mx-auto" >
          <h2 className="text-center text-2xl md:text-4xl font-extrabold text-white tracking-tight uppercase px-2 md:px-16">How to Remit Your Partnership</h2>
          <p className="mt-2 text-center text-white/90">Kindly make your monthly payment to:</p>


          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 p-3 lg:p-0 gap-4">
            {remitItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.key} className="rounded-2xl bg-[#1E1E1E] text-white p-6 md:p-12 ">
                  <div className="flex flex-col items-center gap-2">
                    <Icon className="h-7 w-7 text-GGP-darkGold" />
                    <h3 className="text-lg text-center md:text-xl font-semibold text-GGP-lightGold">{item.title}</h3>
                  </div>

                  <div className="mt-4 text-sm text-white/85 text-center leading-relaxed">
                    {item.lines && (
                      <ul className="space-y-1 grid grid-cols-2">
                        {item.lines.map((line, idx) => (
                          <li key={idx + 1} className={[0, 5].includes(idx) ? "col-span-2" : "col-span-1"}>
                            {line.includes(":")
                              ? line.split(": ").map((splits, index) => {
                                return (
                                  <div key={index + "z"}>
                                    <div className={index === 0 ? "text-xs text-GGP-lightGold" : "text-md"}>{splits}</div>
                                  </div>
                                );
                              })
                              : line}
                          </li>
                        ))}
                      </ul>
                    )}

                    {item.body && <p>{item.body}</p>}

                    {typeof item.link === "string" && item.link && (
                      <p className="mt-1 z-20">
                        <Link target="_blank" to={item.link} className="underline text-sky-300 break-all">
                          {item.linkLabel ?? item.link}
                        </Link>
                      </p>
                    )}

                    {typeof item.link !== "string" && item.link}

                    {item.phone && <p className="mt-1">{item.phone}</p>}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-6  md:pt-12 flex flex-col flex-wrap justify-center gap-2 md:gap-4 w-[168px] mx-auto">
            <VisitorOnlinePayment position={"justify-center"} mode="red" />

            <div className="w-full flex justify-center">
              <Button className="bg-[#E7000B] text-white text-lg w-full md:w-[168px]" asChild size={"lg"}>
                <Link to="/register">Sign up Today!</Link>
              </Button>
            </div>
          </div>

          {/* <div className="pt-12 ">
            <VisitorOnlinePayment position={"justify-center"} />
          </div> */}
        </ContainerFluid>
      </div>
    </section>
  );
}
