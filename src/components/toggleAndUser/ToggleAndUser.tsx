import { useTheme } from "../themeProvider/theme-provider";
import { UserButton } from "../user-button";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

const ToggleAndUser = () => {
  const { theme, setTheme } = useTheme();

  const handleLightMode = () => {
    if (theme === "light") return null;
    setTheme("light");
  };

  const handleDarkMode = () => {
    if (theme === "dark") return null;
    setTheme("dark");
  };

  return (
    <div className="shrink-0 mb-10 sm:mb-0">
      <hr className="mb-4 border-t border-gray-100/10" />
      <UserButton />
      {/* Light Mode Button */}
      <div className="flex items-center py-3 gap-x-3">
        <div
          onClick={handleLightMode}
          className={cn(
            "h-10 w-10 rounded-xl flex justify-center items-center cursor-pointer transition-colors border-gray-700",
            theme === "light" ? "bg-GGP-darkGold text-white" : "border-2 dark:bg-muted text-gray-700 ",
          )}
        >
          <Sun size={22} />
        </div>

        {/* Dark Mode Button */}
        <div
          onClick={handleDarkMode}
          className={cn(
            "h-10 w-10 rounded-xl flex justify-center items-center cursor-pointer transition-colors border-gray-700",
            theme === "dark" ? "bg-GGP-darkGold text-white" : "border-2  dark:bg-muted text-gray-700",
          )}
        >
          <Moon size={18} />
        </div>
      </div>
    </div>
  );
};

export default ToggleAndUser;
