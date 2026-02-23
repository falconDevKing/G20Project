// import { ContainerFluid } from "./containerFluid";
import { MobileNav } from "./MobileNav";
import { UserButtonCode } from "./user-button-code";

export const MobileNavbar = () => {
  return (
    <div className="md:fixed lg:hidden bg-GGP-darkGold md:bg-transparent left-0 z-50 w-full h-[70px] px-6 py-12 flex items-center md:items-end md:justify-end md:-translate-x-7 ">
      <div className="flex items-center justify-between w-full md:w-auto md:gap-6 lg:hidden">
        <div>
          <UserButtonCode />
        </div>

        <div className="lg:hidden">
          <MobileNav />
        </div>
      </div>
    </div>
  );
};

export const DesktopNavbar = () => {
  return (
    <div className="hidden lg:flex py-2 w-full justify-end">
      <UserButtonCode position={"justify-end"} />
    </div>
  );
};
