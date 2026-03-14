import SectionShell from "./sectionShell";
import { CheckCircle } from "lucide-react";

type PartnerBenefit = {
  title: string;
  body: string;
};

const partnerBenefits: PartnerBenefit[] = [
  {
    title: "Fulfilling the Kingdom mandate",
    body: "As a G20 partner, you play an active role in taking the Gospel to nations through a deliberate annual commitment.",
  },
  {
    title: "Sharing in the Prophet's reward",
    body: "As a covenant partner, you share in the grace, blessings, and testimonies tied to the global mandate you are helping to advance.",
  },
  {
    title: "Create eternal value",
    body: "Your partnership translates into lasting spiritual impact, with lives reached and kingdom work strengthened through your giving.",
  },
  {
    title: "Build a lasting legacy",
    body: "Your commitment creates a footprint of faith, love, and generosity that will continue to speak beyond this moment.",
  },
  {
    title: "Gain global influence",
    body: "Your partnership helps drive a worldwide vision that shapes lives and nations with tangible transformation.",
  },
  {
    title: "Enjoy spiritual covering",
    body: "Your partnership places you under a covering of consistent prayers, including dedicated prayers from the Prophet's office.",
  },
  {
    title: "Special birthday celebration",
    body: "Partners receive a special personalised birthday celebration and prayers as an expression of honour and appreciation.",
  },
  {
    title: "Recognition and awards",
    body: "Your impact is valued and celebrated, with outstanding partners recognised during annual honour moments.",
  },
];

const PartnerBenefits = () => {
  return (
    <SectionShell
      eyebrow="Why partner"
      title="Benefits of being a G20 partner"
      subtitle="G20 partnership is more than a giving level. It is a place of spiritual alignment, kingdom impact, and meaningful honour."
      className="bg-[#0c1423]"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {partnerBenefits.map((benefit) => (
          <div key={benefit.title} className="rounded-3xl border border-[#2e3a55] bg-[#111c31] p-5 sm:p-6">
            <div className="flex gap-4">
              <div className="pt-1 text-[#d2ae63]">
                <CheckCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-base sm:text-lg font-semibold text-[#f0cf86]">{benefit.title}</p>
                <p className="mt-2 text-md leading-6 text-[#d6e2f8]">{benefit.body}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
};

export default PartnerBenefits;
