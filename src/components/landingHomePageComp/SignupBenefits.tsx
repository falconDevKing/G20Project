import { ContainerFluid } from "@/components/containerFluid";
import { Dot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { VisitorOnlinePayment } from "../paymentHistoryTable/visitorsOnlinePayment";

export const SignupBenefits = () => {
  return (
    <section id="how-to-remit" className="relative bg-[#1B100E] text-white py-12 md:py-16 overflow-hidden scroll-mt-28">
      <ContainerFluid className=" max-w-[900px] mx-auto">
        <h2 className="text-center text-2xl md:text-4xl font-extrabold text-GGP-darkGold tracking-tight uppercase px-2 md:px-16 pb-4 ">
          BENEFITS OF SIGNING UP
        </h2>

        <ul>
          {Object.entries(benefits).map((benefit) => {
            const [key, details] = benefit;

            return (
              <li key={key} className="flex items-start gap-2 p-1 rounded text-lg">
                <Dot className="text-GGP-darkGold" size={36} />
                <div>
                  <span className="font-bold text-GGP-lightGold">{key}</span>: <span className="font-light">{details}</span>
                </div>
              </li>
            );
          })}
        </ul>

        {/* <div className="mt-12 flex justify-center">
          <Button className="bg-[#E7000B] dark:text-white p-4 px-12 text-xl" asChild size={"lg"}>
            <Link to="/register">Sign up Today!</Link>
          </Button>
        </div> */}

        <div className="pt-12 flex flex-row flex-wrap justify-center gap-4 w-[168px] mx-auto">
          <VisitorOnlinePayment position={"justify-center"} mode="red" />

          <div className="w-full flex justify-center">
            <Button className="bg-[#E7000B] text-white text-lg w-[168px]" asChild size={"lg"}>
              <Link to="/register">Sign up Today!</Link>
            </Button>
          </div>
        </div>
      </ContainerFluid>
    </section>
  );
};

const benefits: Record<string, string> = {
  "Personalised Support": "Enjoy a dedicated account manager who will assist with any enquiries, updates, or requests from the team.",
  "Profile Management": "Easily update your personal details and ensure your information remains accurate and up to date.",
  "Consistency Tracker": "Monitor your commitment throughout the year with a visual tracker that helps you stay consistent.",
  "Remission History": "Access a complete record of your remissions; from inception to date, all in one place.",
  "Offline Payment Logging": "Record and track your offline payments directly on the platform for seamless reconciliation.",
  "Automated Payment Control": "Manage your automated remissions — update payment amounts, change cards, or pause and resume payments at your convenience.",
};
