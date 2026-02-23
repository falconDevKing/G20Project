import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ReactNode } from "react";

interface FormTooltipProps {
  text: string;
}

interface GeneralTooltipProps {
  text: string;
  children: ReactNode;
}

export const GeneralTooltip: React.FC<GeneralTooltipProps> = ({ text, children }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex items-center cursor-pointer">{children}</span>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs">
          {text}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const FormTooltip = ({ text }: FormTooltipProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Info size={12} className=" text-blue-600 dark:text-GGP-darkGold" />
        </TooltipTrigger>
        <TooltipContent>{text}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default FormTooltip;
