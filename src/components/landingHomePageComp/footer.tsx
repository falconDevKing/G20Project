import { ContainerFluid } from "@/components/containerFluid";
import { Mail, Phone, MapPin } from "lucide-react";
import { useFont } from "@/hooks/useFont";
import { useAppSelector } from "@/redux/hooks";
// import Logo from "@/assets/G20_logo.png";

const locationAddress: Record<string, string> = {
  NGN: "G20 Lounge, Ark of Light For All Nations",
  USD: "609 Truman St, Arlington, TX 76011, United States",
  CAD: "2220 Midland Avenue, Scarborough, ON M1P 3E6, Canada",
  GBP: "Capital House, 47 Rushey Green, London. SE6 4AS",
  GHS: "Ring Road Central, opp. Provident Tower, same building as Ernest Chemist, Accra",
  ZAR: "41 Nana Sita St, Pretoria Central, Pretoria, 0002",
  EUR: "Capital House, 47 Rushey Green, London. SE6 4AS",
  USDAF: "609 Truman St, Arlington, TX 76011, United States",
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

export const Footer = () => {
  const { locationCurrency, fallbackCurrency } = useAppSelector((state) => state?.app);
  const { setFont } = useFont("garamond");

  const changeFont = () => {
    setFont((p) => (p === "garamond" ? "inter" : "garamond"));
  };

  const CONTACT = {
    email: "info@globalgospelpartnership.org",
    address: locationAddress[locationCurrency] || locationAddress[fallbackCurrency],
    phone: locationPhoneNumber[locationCurrency] || locationPhoneNumber[fallbackCurrency],
  };

  return (
    <footer id="contact" className="bg-[#0B0B0B] text-white pt-7 md:pt-12 pb-8">
      <ContainerFluid>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-10 items-start">
          {/* Left: Contact / Address / Phone */}
          <div className="space-y-6 p-3 pb-0">
            <div>
              <h4 className="text-xl font-semibold">Contact</h4>
              <p className="mt-2 text-white/80 flex items-center gap-2">
                <Mail className="h-5 w-5 hidden lg:block" />
                {CONTACT.email}
              </p>
            </div>

            <div>
              <h4 className="text-xl font-semibold">Address</h4>
              <p className="mt-2 text-white/80 flex items-start gap-2 max-w-[720px]">
                <MapPin className="h-7 w-7  hidden lg:block" />
                {CONTACT.address}
              </p>
            </div>

            <div>
              <h4 className="text-xl font-semibold">Phone Number</h4>
              <p className="mt-2 text-white/80 flex items-center gap-2">
                <Phone className="h-5 w-5 hidden lg:block" />
                {CONTACT.phone}
              </p>
            </div>
          </div>

          {/* Right: Newsletter card */}
          {/* <div className="md:justify-self-end w-full max-lg:max-w-[462.48px] max-w-full p-3">
            <div className="rounded-md bg-[#FB2C36] p-5 md:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
              <p className="text-white font-semibold">Sign Up to Our Newsletter</p>
              <form
                className="mt-3 flex gap-3 "
                onSubmit={(e) => {
                  e.preventDefault();
                  //   For later!
                }}
              >
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  className="h-11 w-full  bg-white px-3 text-[#1E1E1E] placeholder-[#6B7280] outline-none focus:ring-2 focus:ring-white/70"
                />
                <button
                  type="submit"
                  className="h-11 whitespace-nowrap border border-white px-4 text-sm font-medium text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/70"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div> */}
        </div>

        {/* Divider */}
        <hr className="mt-10 border-t border-white/30" />

        {/* Bottom row */}
        <div className="mt-4 flex items-center justify-center">
          {/* If you want the logo above footer text, uncomment:
          <img src={Logo} alt="GGP Logo" className="h-8 w-auto mr-3" />
          */}
          <p className="text-sm text-white/70" onClick={changeFont}>
            © {new Date().getFullYear()}. All rights reserved.
          </p>
        </div>
      </ContainerFluid>
    </footer>
  );
};
