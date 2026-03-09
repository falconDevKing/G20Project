import * as React from "react";

import { cn } from "@/lib/utils";
import { useLocation } from "react-router";

type updatedInputProps = React.ComponentProps<"textarea"> & {
  allowDark?: boolean;
};

function Textarea({ className, allowDark = true, ...props }: updatedInputProps) {
  const location = useLocation();
  const isAuthPage =
    location.pathname === "/register" ||
    location.pathname === "/login" ||
    location.pathname === "/forgot-password" ||
    location.pathname === "/reset-password" ||
    location.pathname === "/verifyEmail";
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-GGP-darkGold file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        isAuthPage && "dark:text-[#1E1E1E]",
        allowDark && !isAuthPage ? "dark:border-input/50 dark:text-white dark:bg-transparent" : "bg-white",
        className,
      )}
      {...props}
    />
  );
}

const AuthTextArea = React.forwardRef<HTMLInputElement, React.ComponentProps<"textarea">>(({ className,  ...props }) => {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex w-full rounded-md border border-input bg-white text-black px-3 py-2 text-sm ring-offset-GGP-darkGold file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
});

AuthTextArea.displayName = "AuthTextArea";
export { Textarea, AuthTextArea };

