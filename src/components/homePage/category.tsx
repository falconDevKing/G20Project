import ProphetPortrait from "@/assets/generalAppAssets/prophet.png";
import { PrimaryButton } from "../customIcons";
import SectionShell from "./sectionShell";
import { CheckCircle } from "lucide-react";

type Category = { title: string; amount: string; subtitle?: string };

const categories: Category[] = [
  { title: "Category 1 – Bronze Honorary Member", amount: "₦1 million to ₦2 million per year", subtitle: "Entry level" },
  { title: "Category 2 – Silver Honorary Member", amount: "Above ₦2 million to ₦5 million per year" },
  { title: "Category 3 – Gold Honorary Member", amount: "Above ₦5 million to ₦10 million per year" },
  { title: "Category 4 – Diamond Honorary Member", amount: "Above ₦10 million to ₦25 million per year" },
  { title: "Category 5 – Platinum Honorary Member", amount: "Above ₦25 million per year", subtitle: "Highest level" },
];

const Category = () => {
  return (
    <div>
      {/* CATEGORY SECTION */}
      <SectionShell
        id="categories"
        eyebrow="Yearly commitment levels"
        title="Partnership Categories"
        subtitle="As you grow in financial capacity, you are encouraged to step up to higher levels of partnership within the House of Greats."
        className="bg-black"
      >
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-stretch">
          {/* left list */}
          <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur">
            <div className="space-y-5">
              {categories.map((c) => (
                <div key={c.title} className="flex gap-4">
                  <div className="pt-1 text-gold-300">
                    <CheckCircle />
                  </div>
                  <div className="min-w-0">
                    <p className="text-md font-semibold text-gold-300">{c.title}</p>
                    <p className="mt-1 text-md text-white/85">
                      {c.amount} {c.subtitle ? <span className="text-white/50">({c.subtitle})</span> : null}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-7 text-md text-white/80">
              Top 20 G20 partners by yearly amount will serve as executives of the House of Greats for the upcoming year.
            </p>

            <div className="mt-7">
              <PrimaryButton href="/register">Sign up</PrimaryButton>
            </div>
          </div>

          {/* right portrait */}
          <div className="relative overflow-hidden rounded-3xl bg-white/5 ring-1 ring-white/10">
            {/* <img src={ProphetPortrait} alt="Leader portrait" className="h-full w-full object-cover" /> */}
            <img src={ProphetPortrait} alt="Leader portrait" className="w-full  max-h-[560px] object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
            {/* <div className="absolute bottom-0 left-0 right-0 p-6">
              <p className="text-sm font-semibold text-white">Stewardship that carries weight</p>
              <p className="mt-2 text-sm text-white/70">Annual covenant partnership for major Gospel projects.</p>
            </div> */}
          </div>
        </div>
      </SectionShell>
    </div>
  );
};

export default Category;
