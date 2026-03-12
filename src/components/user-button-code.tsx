import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown, LogOut, Moon, Sun, User, LayoutDashboard } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import { getFileUrl } from "@/services/storage";
import { useEffect, useState } from "react";
import { useTheme } from "./themeProvider/theme-provider";
import { logOutUser } from "@/services/auth";

export const UserButtonCode = ({ position = "justify-between" }: { position?: string }) => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.userDetails);
  const { theme, toggleTheme } = useTheme();

  const getInitials = (surname: string, name: string) => {
    const firstInitial = surname?.trim()?.charAt(0).toUpperCase() || "";
    const lastInitial = name?.trim()?.charAt(0).toUpperCase() || "";
    return firstInitial + lastInitial;
  };

  const userInitials = getInitials(user?.first_name || "", user?.last_name || "");

  const filePath = user.image_url;
  const [fileUrlToUse, setFileUrlToUse] = useState<string>("");

  const handleLogout = async () => {
    await logOutUser();
    navigate("/login");
  };

  useEffect(() => {
    const updateFileUrl = async () => {
      const fileUrl = await getFileUrl(filePath as string);
      setFileUrlToUse(fileUrl || "");
    };

    if (filePath) {
      updateFileUrl();
    }
  }, [filePath]);

  return (
    <div className={`flex items-center ${position} rounded-md p-2 `}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-3 rounded-md bg-black/70 px-3 py-2 text-white dark:bg-G20-darkGold">
            <Avatar className="h-10 w-10 border border-white/20">
              <AvatarImage src={fileUrlToUse} alt={user?.first_name} />
              <AvatarFallback className="font-semibold uppercase bg-white text-black">{userInitials}</AvatarFallback>
            </Avatar>
            <div className="text-left hidden sm:block">
              <div className="text-xs text-white/70">Unique Code</div>
              <div className="text-sm font-medium">{user?.unique_code || "-"}</div>
            </div>
            <ChevronDown size={16} />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={() => navigate("/dashboard")} className="cursor-pointer">
            <LayoutDashboard size={16} /> Go to Dashboard
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => navigate("/profile")} className="cursor-pointer">
            <User size={16} /> Go to Profile{" "}
          </DropdownMenuItem>

          <DropdownMenuItem onClick={toggleTheme} className="cursor-pointer">
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            Switch to {theme === "dark" ? "Light" : "Dark"} Mode
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
            <LogOut size={16} /> Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {/* Avatar */}
      {/* <Link to="/profile">
        <div className="flex items-center gap-3">
          <Avatar className="h-16 w-16 ">
            <AvatarImage src={fileUrlToUse} alt={user?.first_name} />
            <AvatarFallback className="font-semibold uppercase bg-white text-black">{userInitials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-white font-semibold text-sm">Unique Partner Code</span>
            <span className="text-base font-normal tracking-tighter dark:max-sm:text-[#344054] text-[#344054]">{user?.unique_code}</span>
          </div>
        </div>
      </Link> */}
    </div>
  );
};
