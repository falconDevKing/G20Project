import SectionShell from "./sectionShell";
import { PrimaryButton } from "../customIcons";
import BannerPicture from "@/assets/generalAppAssets/requirements.png";
import { CheckCircle } from "lucide-react";

const requirementsLeft: string[] = [
  "Be a Global Gospel Partner",
  "Be a faithful tither",
  "Demonstrate love and passion for the growth and expansion of the ministry",
  "Have joy and willingness in giving whenever opportunities arise",
  "Carry a genuine burden for souls and for the spread of the Gospel",
  "Be a spiritual son or daughter, showing loyalty and shared vision",
  "Commit to sowing at least ₦1,000,000 annually toward the ministry’s mission",
  "Maintain a life that is faithful, responsible, consistent, truthful, and pure",
  "Have credible income sources to sustain the commitment",
];

const Requirements = () => {
  return (
    <div>
      {/* REQUIREMENTS SECTION */}
      <SectionShell
        id="requirements"
        eyebrow="Who should join"
        title="Membership Requirements"
        subtitle="G20 partnership is intentional. It is built on alignment, stewardship, and capacity."
        className="bg-black"
      >
        {/* <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-stretch"> */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* left image card */}
          <div className="relative overflow-hidden rounded-3xl">
            <div className="bg-white/5 ring-1 ring-white/10 max-w-max mx-auto">
              <img src={BannerPicture} alt="Requirements graphic" className="object-cover max-h-[600px] mx-auto" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
            </div>
            {/* <img src={BannerPicture} alt="Requirements graphic" className="h-full w-full object-contain" /> */}
          </div>

          {/* right requirements list */}
          <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur">
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-4">
                {requirementsLeft.map((r) => (
                  <div key={r} className="flex gap-3">
                    <span className="pt-0.5 text-gold-300">
                      <CheckCircle />
                    </span>
                    <p className="text-md text-white/75">{r}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 rounded-2xl bg-black/40 p-5 ring-1 ring-white/10">
              <p className="text-sm text-white/75">
                Minimum annual commitment: <span className="font-semibold text-gold-300">₦1,000,000</span>. Partnership is voluntary, and conviction matters.
              </p>
            </div>

            <div className="mt-7">
              <PrimaryButton href="/register">Join now</PrimaryButton>
            </div>
          </div>
        </div>
      </SectionShell>
    </div>
  );
};

export default Requirements;
