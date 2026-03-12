import { AdminViews } from "../constants/index";
import { cn } from "@/lib/utils";
import { useLocation, Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";

import Logo from "../../src/assets/G20_logo.png";
import ToggleAndUser from "./toggleAndUser/ToggleAndUser";

export const SideBar = () => {
  const location = useLocation();
  const auth = useAppSelector((state) => state.auth);

  const permission_type = auth.userDetails.permission_type;
  const opsPermissionType = auth.userDetails.ops_permission_type;
  const isAdmin =
    ["chapter", "division", "organisation"].includes(permission_type || "") || ["shepherd", "governor", "president"].includes(opsPermissionType || "");
  const isChapterAdmin = permission_type === "chapter";

  // const [search, setSearch] = useState("");
  const SideBarLink = AdminViews;
  const filteredLinks = SideBarLink.filter((link) => link.name && (isAdmin ? true : !!link?.allowIndividual));
  const filteredAdminLinks = filteredLinks.filter((link) => link.name && (isChapterAdmin ? !!link?.allowChapter : true));

  return (
    <section className="fixed top-0 left-0 lg:w-[312px] w-full h-screen flex flex-col justify-between bg-[#1E1E1E] px-6 py-2 max-lg:hidden border-r dark border-gray-100/10 z-20">
      {/* Logo */}
      <Link to={"/"} className="flex items-center gap-3 p-2 z-80">
        <img src={Logo} alt="GGP Logo" className="h-[80px] w-auto" />
      </Link>

      {/* <hr className="mb-4 border-t border-gray-100/10" /> */}

      {/* Search Bar */}
      {/* <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          type="search"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg bg-transparent border border-gray-100/10 text-white placeholder:text-gray-100/65 focus:outline-none focus:ring-1 focus:ring-GGP-darkGold"
        />
        </div>
      */}

      {/* Navigation Links */}
      <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-1">
        {filteredAdminLinks.map((link) => {
          const isActive = location.pathname === link.route;
          return (
            <div key={link.name}>
              <Link
                to={link.route}
                className={cn("flex items-center px-4 py-2 rounded-lg transition-all duration-300 group", {
                  "bg-GGP-darkGold text-white shadow-sm": isActive,
                  "hover:bg-GGP-darkGold/5": !isActive,
                })}
              >
                {link.name === "Personal View" ? (
                  <ChevronLeft className={cn("h-6 w-6 text-GGP-darkGold", { "text-white": isActive })} />
                ) : (
                  <link.icon
                    className={cn("h-6 w-6 text-GGP-darkGold", {
                      "text-white": isActive,
                    })}
                  />
                )}

                {/* Label + Chevron */}
                <div className="flex flex-1 items-center justify-between ml-4">
                  <p className={cn("truncate max-w-[160px] text-white text-[15px] font-medium", { "text-white": isActive })}>{link.name}</p>

                  {link.name === "Personal View" ? (
                    <link.icon
                      className={cn("h-6 w-6 text-GGP-darkGold ml-4", {
                        "text-white": isActive,
                      })}
                    />
                  ) : (
                    <ChevronRight
                      className={cn("h-5 w-5 text-GGP-darkGold", {
                        "text-white": isActive,
                      })}
                    />
                  )}
                </div>
              </Link>
            </div>
          );
        })}
        {/* <div className="text-white flex items-center py-7 gap-x-3"> */}
        {/* Logout + Theme Switch */}
        <div className="mt-auto">
          <ToggleAndUser />
        </div>
      </div>
    </section>
  );
};
