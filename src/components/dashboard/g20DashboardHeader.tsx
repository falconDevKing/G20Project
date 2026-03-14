import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { ChevronDown, LogOut, Moon, Sun, User, LayoutDashboard } from "lucide-react";

import G20Logo from "@/assets/generalAppAssets/G20_logo.png";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/themeProvider/theme-provider";
import { useAppSelector } from "@/redux/hooks";
import { getFileUrl } from "@/services/storage";
import { logOutUser } from "@/services/auth";

export const G20DashboardHeader = ({ page }: { page?: string }) => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.userDetails);
  const { theme, toggleTheme } = useTheme();
  const [avatarUrl, setAvatarUrl] = useState("");

  const initials = `${user?.first_name?.[0] || ""}${user?.last_name?.[0] || ""}`.toUpperCase();

  useEffect(() => {
    const loadAvatar = async () => {
      if (!user?.image_url) {
        setAvatarUrl("");
        return;
      }

      const signedUrl = await getFileUrl(user.image_url);
      setAvatarUrl(signedUrl || "");
    };

    loadAvatar();
  }, [user?.image_url]);

  const handleLogout = async () => {
    await logOutUser();
    navigate("/login");
  };

  return (
    <header className="px-4 md:px-12 lg:px-24 py-4 bg-GGP-darkGold flex justify-between items-center border-b border-[#AE9956]">
      <Link to="/" className="shrink-0">
        <img src={G20Logo} alt="G20 Logo" className="h-14 md:h-16" />
      </Link>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-3 rounded-md bg-black/70 px-3 py-2 text-white">
            <Avatar className="h-10 w-10 border border-white/20">
              <AvatarImage src={avatarUrl} alt={user?.first_name} />
              <AvatarFallback className="font-semibold uppercase bg-white text-black">{initials}</AvatarFallback>
            </Avatar>
            <div className="text-left hidden sm:block">
              <div className="text-xs text-white/70">Unique Code</div>
              <div className="text-sm font-medium">{user?.unique_code || "-"}</div>
            </div>
            <ChevronDown size={16} />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          {page === "profile" ? (
            <DropdownMenuItem onClick={() => navigate("/dashboard")} className="cursor-pointer">
              <LayoutDashboard size={16} /> Go to Dashboard
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => navigate("/profile")} className="cursor-pointer">
              <User size={16} /> Go to Profile{" "}
            </DropdownMenuItem>
          )}

          <DropdownMenuItem onClick={toggleTheme} className="cursor-pointer">
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            Switch to {theme === "dark" ? "Light" : "Dark"} Mode
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
            <LogOut size={16} /> Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};
