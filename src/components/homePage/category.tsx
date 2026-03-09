import ProphetPortrait from "@/assets/generalAppAssets/prophet.png";
import { GhostButton, PrimaryButton } from "../customIcons";
import SectionShell from "./sectionShell";
import { CheckCircle } from "lucide-react";

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
        <div className="rounded-3xl border border-[#2e3a55] bg-[#111c31] p-6">
          <div className="space-y-5">
            {categories.map((c) => (
              <div key={c.title} className="flex gap-4">
                <div className="pt-1 text-[#d2ae63]">
                  <CheckCircle />
                </div>
                <div className="min-w-0">
                  <p className="text-md font-semibold text-[#f0cf86]">{c.title}</p>
                  <p className="mt-1 text-md text-[#d6e2f8]">
                    {c.amount} {c.subtitle ? <span className="text-[#aebcda]">({c.subtitle})</span> : null}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-7 text-md text-[#d6e2f8]">Top G20 partners will serve as executives of the House of Greats for the upcoming year.</p>

          <div className="mt-7 gap-4 flex flex-wrap">
            <PrimaryButton href="/register" hideArrow>
              Give Now
            </PrimaryButton>
            <GhostButton href="/login" className="hidden sm:inline-flex" showArrow>
              Sign up
            </GhostButton>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-[#2e3a55] bg-[#111c31]">
          <img src={ProphetPortrait} alt="Leader portrait" className="w-full max-h-[560px] object-cover" />
          <div className="absolute inset-0 bg-[#0b1120]/30" />
        </div>
      </div>
    </SectionShell>
  );
};

export default Category;
