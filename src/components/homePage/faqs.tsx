import { useState } from "react";
import SectionShell from "./sectionShell";
import { cn } from "@/lib/utils";
import { ShieldAlert } from "../customIcons";

type FAQ = { q: string; a: string };

const faqs: FAQ[] = [
  {
    q: "What is G20?",
    a: "G20 is a higher-tier partnership community within the broader global vision, designed for men and women committed to bearing greater financial responsibility for major Gospel projects, kingdom expansion, and strategic impact.",
  },
  {
    q: "Who can become a G20 partner?",
    a: "Anyone with a heart for the Gospel who aligns with the mandate and can commit to the G20 annual partnership threshold can become a partner.",
  },
  {
    q: "Do I need to be a member of Gospel Pillars Ministry to become a G20 partner?",
    a: "No. G20 welcomes partners from different regions and backgrounds who believe in the vision and want to stand with the mandate.",
  },
  {
    q: "How much do I need to give to be a partner?",
    a: "G20 partnership is structured in annual categories, beginning from NGN 1,000,000 per year, so you can choose a level that matches your capacity and conviction.",
  },
  {
    q: "What happens to my partnership seed?",
    a: "Your giving supports major Gospel projects, media outreach, strategic kingdom assignments, and humanitarian impact connected to the wider vision.",
  },
  {
    q: "How often do I give: monthly or one-time?",
    a: "G20 is built around an annual commitment, but remittance can be fulfilled in scheduled payments through the platform based on the structure approved for your partnership.",
  },
  {
    q: "How do I make my partnership payments?",
    a: "You can remit through the official G20 platform using the available online payment options, and approved offline payments can also be logged for reconciliation.",
  },
  {
    q: "Will I receive updates on how my partnership is used?",
    a: "Yes. Partners receive regular updates, communication, and impact stories from the partnership team and the Prophet's office.",
  },
  {
    q: "Can I change or upgrade my partnership level?",
    a: "Absolutely. As your faith and financial capacity grow, you can review and move to a higher G20 category.",
  },
  {
    q: "What are the spiritual benefits of being a G20 partner?",
    a: "G20 partnership offers spiritual alignment with the mandate, dedicated prayers, kingdom impact, and the privilege of standing with a vision larger than yourself.",
  },
  {
    q: "Is my giving tax-deductible?",
    a: "This may vary by country or region. Kindly check with the appropriate authority in your location for clarity on the treatment of charitable or ministry giving.",
  },
  {
    q: "How can I get more information or assistance?",
    a: "You can reach the G20 support team through the official contact channels provided on the platform for guidance, payment help, or partnership enquiries.",
  },
];

const AccordionItem = ({ item, index, openIndex, onToggle }: { item: FAQ; index: number; openIndex: number | null; onToggle: (idx: number) => void }) => {
  const isOpen = openIndex === index;
  return (
    <div className="rounded-2xl border border-[#2e3a55] bg-[#111c31]">
      <button type="button" onClick={() => onToggle(index)} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left" aria-expanded={isOpen}>
        <span className="text-sm font-semibold text-[#f8f1e3]">{item.q}</span>
        <span
          className={cn(
            "grid h-6 w-6 place-items-center rounded-full border border-[#3b4863] text-[#d6e2f8] transition",
            isOpen ? "rotate-45 bg-[#1b2842]" : "bg-[#111c31]",
          )}
          aria-hidden="true"
        >
          +
        </span>
      </button>
      {isOpen ? <p className="px-5 py-4 pb-5 text-sm leading-6 text-[#cdd9f2]">{item.a}</p> : null}
    </div>
  );
};

const Faqs = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <SectionShell
      id="faq"
      eyebrow="Beware"
      title="Frequently asked questions"
      subtitle="Be security conscious. Always verify you are on the official platform before entering personal or payment details."
      className="bg-[#0c1423]"
    >
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-start gap-4 rounded-3xl border border-[#2e3a55] bg-[#111c31] p-6">
          <div className="text-[#d6b260]">
            <ShieldAlert />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#f8f1e3]">Be security conscious</p>
            <p className="mt-2 text-sm leading-6 text-[#cdd9f2]">
              If you receive a message that looks suspicious, even if the source has the same name as this community, verify that the page has not been
              duplicated, especially if you are being asked to provide personal or payment details.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {faqs.map((f, idx) => (
            <AccordionItem key={f.q} item={f} index={idx} openIndex={openFaq} onToggle={(i) => setOpenFaq((prev) => (prev === i ? null : i))} />
          ))}
        </div>
      </div>
    </SectionShell>
  );
};

export default Faqs;
