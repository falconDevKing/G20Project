import { LogOut } from "lucide-react";
import { LogoutButton } from "../forms/logout-button";
import { Link } from "react-router";

import G20Logo from "@/assets/generalAppAssets/G20_Logo.png";
import { UserButtonCode } from "../user-button-code";

const DashboardHeader = () => {
  return (
    <div className="px-4 lg:px-24 py-4 bg-GGP-darkGold flex justify-between items-center">
      <img src={G20Logo} alt="G20 Logo" className="h-20" />
      <div className="flex items-center gap-4">
        <Link to="/profile">
          <UserButtonCode position={"justify-end"} />
        </Link>
        <div className="bg-black rounded-md p-4">
          <LogoutButton className="flex items-center gap-2">
            <LogOut className="h-5 w-5 text-white cursor-pointer hover:text-gray-200" />
            <span className="hidden lg:block">Log out</span>
          </LogoutButton>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
