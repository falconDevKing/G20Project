// import ProphetPortrait from "@/assets/generalAppAssets/prophet.png";
import ProphetPortrait from "@/assets/heroImages/newProphetPortrait.jpeg";
import { GhostButton } from "../customIcons";
import SectionShell from "./sectionShell";
import { CheckCircle } from "lucide-react";
import { OfflineBankDetails } from "./offlinePaymentDetails";
import { useAppSelector } from "@/redux/hooks";
import { getResolvedG20Categories } from "@/lib/g20Categories";

type Category = { title: string; amount: string; subtitle?: string };

const Category = () => {
  const { locationCurrency, fallbackCurrency } = useAppSelector((state) => state.app);
  const categories: Category[] = getResolvedG20Categories({ locationCurrency, fallbackCurrency }).map((category, index) => ({
    title: `Category ${index + 1} - ${category.rank} Honorary Member`,
    amount: `${category.amount} per year`,
    subtitle: index === 0 ? "Entry level" : index === 4 ? "Highest level" : undefined,
  }));

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
                  <p className="text-md font-semibold text-[#f0cf86] sm:text-lg">{c.title}</p>
                  <p className="mt-1 text-sm text-[#d6e2f8] sm:text-lg">
                    {c.amount} {c.subtitle ? <span className="text-[#aebcda]">({c.subtitle})</span> : null}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-7 text-sm text-[#d6e2f8] sm:text-md">Top G20 partners will serve as executives of the House of Greats for the upcoming year.</p>

          <div className="mt-7 grid grid-cols-2 sm:flex gap-3 sm:flex-row sm:flex-wrap">
            <OfflineBankDetails showBg="gold" fullWidthOnMobile />
            <GhostButton href="/login" showArrow fullWidthOnMobile>
              Sign up
            </GhostButton>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-[#2e3a55] bg-[#111c31]">
          <img src={ProphetPortrait} alt="Leader portrait" className=" w-full object-cover sm:max-h-[600px]" />
          <div className="absolute inset-0 bg-[#0b1120]/30" />
        </div>
      </div>
    </SectionShell>
  );
};

export default Category;
