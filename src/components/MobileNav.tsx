import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NavMobileItems } from "./NavMobileItems";
import { Link } from "react-router-dom";
import Logo from "../../src/assets/G20_logo.png";
import { Menu } from "lucide-react";
import ToggleAndUser from "./toggleAndUser/ToggleAndUser";

export const MobileNav = () => {
  return (
    <section className="max-w-[264px] lg:hidden h-full overflow-y-scroll">
      <Sheet>
        <SheetTrigger asChild>
          {/* <img src={"/hamburger.svg"} className="cursor-pointer " width={35} height={35} alt="hamburger" /> */}
          <Menu size={32} className=" text-[#1E1E1E] max-md:dark:text-[#1E1E1E] dark:text-white" />
        </SheetTrigger>
        <SheetContent side="left" className=" border-none bg-[#1E1E1E] w-full text-GGP-dark">
          <Link to={"/"} className=" flex gap-1 items-center">
            <div className="rounded-md flex items-center justify-center">
              <img src={Logo} width={100} height={100} alt="Logo" />
            </div>
          </Link>
          <div className=" flex h-[calc(100vh-72px)] flex-col overflow-y-auto justify-between">
            <SheetClose asChild className="">
              <section className=" flex flex-col pt-4 gap-6 mb-4">
                <hr className=" h-[0.4px] opacity-25" />
                <NavMobileItems />
                <div className="px-5 mb-7">
                  <ToggleAndUser />
                </div>
              </section>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
};
