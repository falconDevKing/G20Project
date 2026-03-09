import { useState } from "react";
import SectionShell from "./sectionShell";
import { cn } from "@/lib/utils";
import { ShieldAlert } from "../customIcons";

type FAQ = { q: string; a: string };

const faqs: FAQ[] = [
  {
    q: "What is the difference between GGP and G20?",
    a: "GGP is a monthly partnership structure focused on consistent kingdom advancement. G20 is a higher-tier annual partnership for those committed to bearing greater financial responsibility in funding major global Gospel projects.",
  },
  {
    q: "Who can become a G20 partner?",
    a: "Men and women who are aligned with the mandate, meet the requirements, and can commit at least NGN 1,000,000 annually with clarity and intention.",
  },
  {
    q: "Can I partner from outside Nigeria?",
    a: "Yes. International partners can join and remit in equivalent local currency through the platform's available options.",
  },
  {
    q: "Can I adjust my partnership commitment?",
    a: "Yes. As your capacity grows, you are encouraged to step up to higher levels of partnership with intentional review.",
  },
  {
    q: "Will I receive updates?",
    a: "Yes. Partners receive communications and updates from the Prophet's office and the partnership team.",
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
