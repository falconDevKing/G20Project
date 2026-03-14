import SectionShell from "./sectionShell";
import { PrimaryButton } from "../customIcons";
import BannerPicture from "@/assets/generalAppAssets/requirements.png";
import { CheckCircle } from "lucide-react";
import { OfflineBankDetails } from "./offlinePaymentDetails";

const requirementsLeft: string[] = [
  "Be a born-again believer, transformed by the Spirit and committed to the Lordship of Christ.",
  "Be a lover of Jesus Christ and his church on earth",
  "Have a love and passion for the growth and expansion of the ministry",
  "Have joy and willingness in giving whenever opportunities arise",
  "Carry a genuine burden for souls and for the spread of the Gospel",
  "Love the vision and ministry of Prophet Isaiah Macwealth",
  "Commit to sowing at least NGN 1,000,000 annually toward the ministry's mission",
  "Maintain a life that is faithful, responsible, consistent, truthful, and pure",
  "Have credible income sources to sustain the commitment",
];

const Requirements = () => {
  return (
    <SectionShell
      id="requirements"
      eyebrow="Who should join"
      title="Membership Requirements"
      subtitle="G20 partnership is intentional. It is built on alignment, stewardship, and capacity."
      className="bg-[#0c1423]"
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="relative overflow-hidden rounded-3xl border border-[#2e3a55] bg-[#111c31]">
          <img src={BannerPicture} alt="Requirements graphic" className="mx-auto h-[260px] w-full object-cover sm:h-[360px] lg:max-h-[600px]" />
          <div className="absolute inset-0 bg-[#0b1120]/30" />
        </div>

        <div className="rounded-3xl border border-[#2e3a55] bg-[#111c31] p-5 sm:p-6">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-4">
              {requirementsLeft.map((r) => (
                <div key={r} className="flex gap-3">
                  <span className="pt-0.5 text-[#d2ae63]">
                    <CheckCircle />
                  </span>
                  <p className="text-sm text-[#d6e2f8] sm:text-md">{r}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-[#34415b] bg-[#1b2842] p-5">
            <p className="text-sm text-[#d6e2f8]">
              Minimum annual commitment: <span className="font-semibold text-[#f0cf86]">NGN 1,000,000</span>. Partnership is voluntary, and conviction matters.
            </p>
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <PrimaryButton href="/register" fullWidthOnMobile>
              Join now
            </PrimaryButton>
            <OfflineBankDetails fullWidthOnMobile />
          </div>
        </div>
      </div>
    </SectionShell>
  );
};

export default Requirements;
