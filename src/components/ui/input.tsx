import * as React from "react";

import { cn } from "@/lib/utils";
import { useLocation } from "react-router";

type updatedInputProps = React.ComponentProps<"input"> & {
  allowDark?: boolean;
};

const Input = React.forwardRef<HTMLInputElement, updatedInputProps>(({ className, type, allowDark = true, ...props }, ref) => {
  const location = useLocation();
  const isAuthPage =
    location.pathname === "/register" ||
    location.pathname === "/login" ||
    location.pathname === "/forgot-password" ||
    location.pathname === "/reset-password" ||
    location.pathname === "/g20-registration" ||
    location.pathname === "/g20-partners" ||
    location.pathname === "/verifyEmail";
  return (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-GGP-darkGold file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        isAuthPage && "dark:text-[#1E1E1E]",
        allowDark && !isAuthPage ? "dark:border-input/50 dark:text-white dark:bg-transparent" : "bg-white",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
