import React from "react";
import { ContainerFluid } from "../containerFluid";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../ui/accordion";
import Conscious from "../../assets/cau.png";

type FaqItem = {
  id: string;
  question: string;
  answer: React.ReactNode;
};

const FAQItems: FaqItem[] = [
  {
    id: "1",
    question: "What is GGP?",
    answer:
      "Global Gospel Partnership (GGP) is a vision led by Prophet Isaiah MacWealth to advance the Gospel, plant churches, support missions, and provide humanitarian aid worldwide.",
  },
  {
    id: "2",
    question: "Who can become a GGP Partner?",
    answer: "Anyone with a heart for the Gospel… individuals, families, or organizations can partner by committing monthly financial support.",
  },
  {
    id: "3",
    question: "Do I need to be a member of Gospel Pillars Ministry to be a GGP Partner?",
    answer:
      "No. We have external partners around the world, including individuals, organizations, and church ministries, partnering with the Prophet’s global vision.",
  },
  {
    id: "4",
    question: "How much do I need to give to be a partner?",
    answer: "Partnership is structured in categories, allowing you to choose a monthly commitment that matches your faith and capacity.",
  },
  {
    id: "5",
    question: "What happens to my partnership seed?",
    answer:
      "Your giving supports missions, church planting, media outreach, and humanitarian initiatives, enabling you be a part of a team alleviating poverty and spreading hope around the world.",
  },
  {
    id: "6",
    question: "How often do I give… monthly or one-time?",
    answer: "Partnership is designed as a monthly commitment, though you may also give special one-time seeds.",
  },
  {
    id: "7",
    question: "How do I make my partnership payments?",
    answer:
      "You can give online via the GGP website, through your local Gospel Pillars Church branch, or via direct transfer (see details on the payment page).",
  },
  {
    id: "8",
    question: "Will I receive updates on how my partnership is used?",
    answer: "Yes. Partners receive regular reports, testimonies, and impact stories showing the results of their giving.",
  },
  {
    id: "9",
    question: "Can I change or upgrade my partnership level?",
    answer: "Absolutely. You can adjust your commitment at any time as your faith and capacity grows.",
  },
  {
    id: "10",
    question: "What are the spiritual benefits of being a GGP Partner?",
    answer: "Partnership connects you to the Prophet’s reward, opens doors of supernatural provision, and makes you a vital part of kingdom advancement.",
  },
  {
    id: "11",
    question: "Is my giving tax-deductible?",
    answer: "Yes it is. However this can vary by country/region. Kindly check with your region authority to get more GGP clarity.",
  },
  {
    id: "12",
    question: "How can I get more information or assistance?",
    answer: "You can reach the GGP support team via email, phone, or WhatsApp. Visit the Contact Us section for details.",
  },
];

export const FAQResources = () => {
  return (
    <section id="resources" className="relative py-12 md:py-16 scroll-mt-28 bg-[#0B0B0B] p-2 lg:pb-12">
      <div className="absolute inset-0  bg-[url('/src/assets/fa2.png')] bg-cover bg-center" />
      {/* Optional background image — replace url if you want the crowd image behind */}
      <div className="absolute inset-0  bg-black/85" />

      <ContainerFluid className="relative z-10">
        {/* Security notice */}
        <div className="mx-auto max-w-3xl text-center text-white">
          {/* <AlertTriangle className="mx-auto h-10 w-10 text-GGP-darkGold" /> */}
          <div className=" flex items-center justify-center">
            <img src={Conscious} className=" max-sm:h-20" alt="" />
          </div>

          <div className=" flex flex-col space-y-5 items-center ">
            <h3 className="mt-3 text-2xl md:text-3xl font-semibold">Be Security Conscious</h3>
            <p className="mt-2 text-sm text-white/80">
              If you receive a message that looks suspicious, even if the source has the same name as this community, verify that this page has not been
              duplicated, especially if you are being asked to provide personal or payment details.
            </p>
            <p className="mt-2 text-xl font-semibold">Beware!</p>
          </div>
        </div>

        <h2 className="mt-10 text-center text-2xl md:text-3xl font-bold text-white">Frequently Asked Questions</h2>

        <div className="mx-auto my-6 max-w-3xl">
          <Accordion type="multiple" className="w-full">
            {FAQItems.map((item) => (
              <AccordionItem key={item.id} value={item.id} className="border-none bg-[#1A1917] mb-6">
                <AccordionTrigger
                  className="
                    w-full rounded-md bg-white/5 px-4 py-3 text-left text-white
                    hover:no-underline data-[state=open]:bg-white/10
                    ring-1 ring-white/10
                  "
                >
                  {item.question}
                </AccordionTrigger>
                <AccordionContent
                  className="
                    rounded-b-md bg-white/5 px-4 pt-2 pb-4 text-sm text-white/90
                    ring-1 ring-t-0 ring-white/10
                  "
                >
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </ContainerFluid>
    </section>
  );
};
