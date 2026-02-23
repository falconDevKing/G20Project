import { Link } from "react-router-dom";
import { Button } from "./ui/button";

interface BackButtonProps {
  lable: string;
  href: string;
  homeLable?: string;
  homeHref?: string;
}

export const BackButton = ({ lable, href, homeLable, homeHref }: BackButtonProps) => {
  return (
    <Button asChild variant="link2" size="sm" className="font-normal text-sm dark:text-[#1E1E1E]/80 tracking-tighter leading-tight w-full -mt-4 ">
      <div className=" flex flex-col py-2">
        <Link className=" hover:underline" to={href}>
          {lable}
        </Link>
        {homeHref && (
          <div className="hover:underline">
            <Link to={homeHref}>{homeLable}</Link>
          </div>
        )}
      </div>
    </Button>
  );
};
