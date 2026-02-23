import React, { useCallback, useState } from "react";
import { ContainerFluid } from "../containerFluid";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import Logo from "../../assets/G20_logo.png";
import { VisitorOnlinePayment } from "../paymentHistoryTable/visitorsOnlinePayment";

const landingPageLinks = [
  { name: "home", link: "#home" },
  { name: "about", link: "#about" },
  { name: "partnerships", link: "#partnerships" },
  { name: "resources", link: "#resources" },
  { name: "contact", link: "#contact" },
];

export const LandingNavbar = () => {
  const [open, setOpen] = useState(false);

  const handleAnchorNav = useCallback(
    (hash: string) => (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
      e.preventDefault();
      const id = hash.startsWith("#") ? hash.slice(1) : hash;
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      setOpen(false); // close sheet after scroll
    },
    [],
  );

  return (
    <nav className="sticky top-0 z-40 bg-GGP-darkGold/95 backdrop-blur lg:px-8">
      <ContainerFluid className="py-2 lg:py-0">
        <div className="flex items-center justify-between">
          <Link to="/history" className="flex items-center gap-3 pl-2">
            <img src={Logo} alt="GGP Logo" className="h-[108px] w-auto" />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-x-6">
            {landingPageLinks.map((item) => (
              <a key={item.link} href={item.link} onClick={handleAnchorNav(item.link)} className="text-xl font-medium text-white capitalize hover:opacity-80">
                {item.name}
              </a>
            ))}
            <VisitorOnlinePayment />
            <Button className="bg-[#E7000B] hover:bg-[#E7000B]/90 text-lg" size="lg2" variant="destructive" asChild>
              <Link to="/login" >Login to Dashboard</Link>
            </Button>
          </div>

          {/* Mobile nav (Sheet) */}
          <div className="md:hidden pr-3">
            <div className="flex items-center gap-2">
              {/* <Button size="lg2" className="bg-[#E7000B] hover:bg-[#E7000B]/90" asChild>
                <Link target="_blank" to="/login">
                  Login to Dashboard
                </Link>
              </Button> */}

              <Sheet open={open} onOpenChange={setOpen}>

                <div className="flex align-middle gap-2">
                  <div className="mb-1">
                    <Button size={"lg2"} className="w-full h-10 max-h-10 bg-[#E7000B] hover:bg-[#E7000B]/90 text-md" asChild>
                      <Link to="/login" className="text-lg text-white">Login</Link>
                    </Button>
                  </div>


                  <SheetTrigger asChild>
                    <button aria-label="Open menu" className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-[#E7000B] text-white">
                      <Menu size={22} />
                    </button>
                  </SheetTrigger>
                </div>

                <SheetContent side="left" className="w-[85vw] sm:w-[360px] bg-[#1E1E1E] text-white border-none">
                  <div className="mt-8 flex flex-col gap-4">
                    {landingPageLinks.map((item) => (
                      <a
                        key={item.link}
                        href={item.link}
                        onClick={handleAnchorNav(item.link)}
                        className="text-lg capitalize px-2 py-2 rounded hover:bg-white/10"
                      >
                        {item.name}
                      </a>
                    ))}

                    <VisitorOnlinePayment />
                    <div className="pt-1">
                      <Button size={"lg2"} className="w-full bg-[#E7000B] hover:bg-[#E7000B]/90 text-md" asChild>
                        <Link to="/login" className="text-lg text-white">Login to Dashboard</Link>
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </ContainerFluid>
    </nav>
  );
};
