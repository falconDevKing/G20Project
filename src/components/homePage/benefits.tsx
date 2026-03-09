import React from "react";
import SectionShell from "./sectionShell";
import { CheckCircle, GhostButton, IconBox, PrimaryButton } from "../customIcons";

type Feature = { title: string; body: string; icon?: React.ReactNode };

const benefits: Feature[] = [
  {
    title: "Fulfilling the Kingdom mandate",
    body: "Play an active role in taking the Gospel to all nations through deliberate partnership.",
    icon: <CheckCircle className="h-5 w-5" />,
  },
  {
    title: "Create eternal value",
    body: "Your partnership translates into lasting spiritual impact and kingdom advancement.",
    icon: <CheckCircle className="h-5 w-5" />,
  },
  {
    title: "Build a lasting legacy",
    body: "Leave a footprint of faith, love, and generosity that outlives you.",
    icon: <CheckCircle className="h-5 w-5" />,
  },
  {
    title: "Personalised support",
    body: "Receive dedicated assistance for enquiries, guidance, and partner-related requests.",
    icon: <CheckCircle className="h-5 w-5" />,
  },
];

const Benefits = () => {
  return (
    <SectionShell
      eyebrow="Benefits"
      title="Benefits of signing up"
      subtitle="Partnership should be simple, clear, and well supported."
      className="bg-[#0a1220]"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {benefits.map((b) => (
          <div key={b.title} className="rounded-3xl border border-[#2e3a55] bg-[#111c31] p-6">
            <div className="flex items-start gap-4">
              <IconBox>{b.icon ?? <CheckCircle />}</IconBox>
              <div>
                <p className="text-sm font-semibold text-[#f0cf86]">{b.title}</p>
                <p className="mt-2 text-sm leading-6 text-[#d6e2f8]">{b.body}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <PrimaryButton href="/register">Sign up today</PrimaryButton>
        <GhostButton href="/login">Give Now</GhostButton>
      </div>
    </SectionShell>
  );
};

export default Benefits;
