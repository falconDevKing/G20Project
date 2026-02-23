import { ReactNode } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Socials } from "./Socials";
import { BackButton } from "./BackButton";
import { Header } from "./header";
import { CarouselOverlay } from "./CarouselOverlay";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface CardWrapperProps {
  children: ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtenHref: string;
  showSocials?: boolean;
  titleImg?: string;
  tradeMark?: string;
  homeLable?: string;
  homeHref?: string;
  isRegister?: boolean;
}

export const CardWrapper = ({
  children,
  headerLabel,
  backButtenHref,
  backButtonLabel,
  tradeMark,
  titleImg,
  showSocials,
  homeLable,
  homeHref,
  isRegister = false,
}: CardWrapperProps) => {
  return (
    <section className=" min-h-screen w-full flex flex-col lg:flex-row relative bg-[#1E1E1E]">
      {/* LEFT IMAGE (only visible on desktop) */}
      <div className="relative 2xl:w-4/6 w-4/6 hidden lg:block">
        <CarouselOverlay />
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white">
          <small className="text-sm">{tradeMark}</small>
        </div>
      </div>

      {/* RIGHT FORM */}
      <div
        className={cn(
          "w-full flex justify-center items-center p-4 lg:absolute lg:right-[10%] lg:top-1/2 lg:-translate-y-1/2  lg:w-[660px] lg:mt-0",
          `mt-${isRegister ? 0 : 32}`,
        )}
      >
        <Card className="rounded-lg bg-white w-full max-w-md sm:max-w-lg md:max-w-[640px] max-h-full md:max-h-[80vh] overflow-auto my-6 lg:my-0">
          <CardHeader>
            <div className="flex items-center justify-center -mt-4">
              <Link to="/" className="w-[126px]">
                {titleImg && <img src={titleImg} alt="Logo" />}
              </Link>
            </div>
            <Header lable={headerLabel} />
          </CardHeader>

          <CardContent className="space-y-6">{children}</CardContent>

          {showSocials && (
            <CardFooter className="justify-center">
              <Socials />
            </CardFooter>
          )}

          <CardFooter className="justify-center">
            <BackButton homeHref={homeHref} homeLable={homeLable} lable={backButtonLabel} href={backButtenHref} />
          </CardFooter>
        </Card>
      </div>
    </section>
  );
};
