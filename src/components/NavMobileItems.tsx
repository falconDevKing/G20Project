import { cn } from "@/lib/utils";
import { SheetClose } from "./ui/sheet";
// import { LogoutButton } from "./auth/logout-button";
// import { Button } from "./ui/button";
import { useLocation, Link } from "react-router-dom";
import { AdminViews } from "../constants/index";
// import { LogoutButton } from "./forms/logout-button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";

interface NavMobileItemsProp {
  name: string;
  route: string;
  icon: React.ElementType;
}

export const NavMobileItems = () => {
  const location = useLocation();
  const auth = useAppSelector((state) => state.auth);

  const permission_type = auth.userDetails.permission_type;
  const opsPermissionType = auth.userDetails.ops_permission_type;
  const isAdmin = ["division", "organisation"].includes(permission_type || "") || ["shepherd", "governor", "president"].includes(opsPermissionType || "");

  const SideBarLink = AdminViews;
  const filteredLinks = SideBarLink.filter((link) => link.name && (isAdmin ? true : !!link?.allowIndividual));
  const filteredAdminLinks = filteredLinks.filter((link) => link.name);

  return (
    <>
      {filteredAdminLinks.map((link: NavMobileItemsProp) => {
        const isActive = location.pathname === link.route;
        return (
          <SheetClose asChild key={link.route}>
            <Link
              to={link.route}
              key={link.name}
              className={cn("flex items-center px-4 py-3 rounded-lg transition-all duration-300 group", {
                "bg-GGP-darkGold text-white shadow-sm": isActive,
                "hover:bg-GGP-darkGold/5": !isActive,
              })}
            >
              {/* Icon */}
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
                <p className={cn("truncate max-w-[160px] text-white text-[16px] font-medium", { "text-white": isActive })}>{link.name}</p>
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
          </SheetClose>
        );
      })}
    </>
  );
};
