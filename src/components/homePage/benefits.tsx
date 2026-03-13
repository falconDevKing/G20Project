import React from "react";
import SectionShell from "./sectionShell";
import { CheckCircle, GhostButton, IconBox, PrimaryButton } from "../customIcons";

type Feature = { title: string; body: string; icon?: React.ReactNode };

const benefits: Feature[] = [
  {
    title: "Personalised support",
    body: "Enjoy dedicated assistance for enquiries, updates, and partner-related requests from the team.",
    icon: <CheckCircle className="h-5 w-5" />,
  },
  {
    title: "Profile management",
    body: "Update your personal details easily and keep your information accurate and current.",
    icon: <CheckCircle className="h-5 w-5" />,
  },
  {
    title: "Consistency tracker",
    body: "Monitor your commitment through the year with a visual tracker that helps you stay consistent.",
    icon: <CheckCircle className="h-5 w-5" />,
  },
  {
    title: "Remission history",
    body: "Access a complete record of your remissions from the beginning, all in one place.",
    icon: <CheckCircle className="h-5 w-5" />,
  },
  {
    title: "Offline payment logging",
    body: "Record and track offline payments directly on the platform for easier reconciliation.",
    icon: <CheckCircle className="h-5 w-5" />,
  },
  {
    title: "Automated payment control",
    body: "Manage recurring remissions by updating amounts, changing cards, or pausing and resuming payments when needed.",
    icon: <CheckCircle className="h-5 w-5" />,
  },
];

const Benefits = () => {
  return (
    <SectionShell
      eyebrow="Benefits"
      title="Benefits of signing up"
      subtitle="Your G20 account gives you the tools to stay organised, consistent, and well supported."
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
        <GhostButton href="/paymentButton">Give Now</GhostButton>
      </div>
    </SectionShell>
  );
};

export default Benefits;
