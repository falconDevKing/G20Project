import * as React from "react";
import { cn } from "@/lib/utils";



const AuthInput = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-GGP-darkGold file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-[#1E1E1E] bg-white",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
AuthInput.displayName = "AuthInput";

export { AuthInput };
