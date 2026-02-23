import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ContainerFluidProps {
  children: ReactNode;
  className?: string;
}

export const ContainerFluid = ({ children, className }: ContainerFluidProps) => {
  return <div className={cn("max-w-[1900px] mx-auto md:px-2 lg:px-4 2xl:px-7", className)}>{children}</div>;
};
