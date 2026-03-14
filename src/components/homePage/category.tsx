// import ProphetPortrait from "@/assets/generalAppAssets/prophet.png";
import ProphetPortrait from "@/assets/heroImages/newProphetPortrait.jpeg";
import { GhostButton } from "../customIcons";
import SectionShell from "./sectionShell";
import { CheckCircle } from "lucide-react";
import { OfflineBankDetails } from "./offlinePaymentDetails";

type Category = { title: string; amount: string; subtitle?: string };

const categories: Category[] = [
  { title: "Category 1 - Bronze Honorary Member", amount: "NGN 1 million to NGN 2 million per year", subtitle: "Entry level" },
  { title: "Category 2 - Silver Honorary Member", amount: "Above NGN 2 million to NGN 5 million per year" },
  { title: "Category 3 - Gold Honorary Member", amount: "Above NGN 5 million to NGN 10 million per year" },
  { title: "Category 4 - Diamond Honorary Member", amount: "Above NGN 10 million to NGN 25 million per year" },
  { title: "Category 5 - Platinum Honorary Member", amount: "Above NGN 25 million per year", subtitle: "Highest level" },
];

const Category = () => {
  return (
    <SectionShell
      id="categories"
      eyebrow="Yearly commitment levels"
      title="Partnership Categories"
      subtitle="As you grow in financial capacity, you are encouraged to step up to higher levels of partnership within the House of Greats."
      className="bg-[#0a1220]"
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-stretch">
        <div className="rounded-3xl border border-[#2e3a55] bg-[#111c31] p-5 sm:p-6">
          <div className="space-y-5">
            {categories.map((c) => (
              <div key={c.title} className="flex gap-4">
                <div className="pt-1 text-[#d2ae63]">
                  <CheckCircle />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#f0cf86] sm:text-md">{c.title}</p>
                  <p className="mt-1 text-sm text-[#d6e2f8] sm:text-md">
                    {c.amount} {c.subtitle ? <span className="text-[#aebcda]">({c.subtitle})</span> : null}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-7 text-sm text-[#d6e2f8] sm:text-md">Top G20 partners will serve as executives of the House of Greats for the upcoming year.</p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <OfflineBankDetails showBg="gold" fullWidthOnMobile />
            <GhostButton href="/login" showArrow fullWidthOnMobile>
              Sign up
            </GhostButton>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-[#2e3a55] bg-[#111c31]">
          <img src={ProphetPortrait} alt="Leader portrait" className="h-[280px] w-full object-cover sm:h-[420px] lg:max-h-[560px]" />
          <div className="absolute inset-0 bg-[#0b1120]/30" />
        </div>
      </div>
    </SectionShell>
  );
};

export default Category;
