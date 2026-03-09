import { cn } from "@/lib/utils";

export const ArrowRight = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={cn("h-5 w-5", className)} fill="none" aria-hidden="true">
    <path d="M5 12h12m0 0-5-5m5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const CheckCircle = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={cn("h-5 w-5", className)} fill="none" aria-hidden="true">
    <path d="M9 12l2 2 4-4m7 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconBox = ({ children }: { children: React.ReactNode }) => (
  <span className="grid h-9 w-9 place-items-center rounded-xl border border-[#5b4a22] bg-[#2a2214] text-[#f0d486]">{children}</span>
);

export const ShieldAlert = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={cn("h-8 w-8", className)} fill="none" aria-hidden="true">
    <path d="M12 2l8 4v6c0 5-3.5 9.5-8 10-4.5-.5-8-5-8-10V6l8-4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    <path d="M12 8v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M12 16h.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

export const PrimaryButton = ({
  href,
  children,
  className = "",
  hideArrow = false,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  hideArrow?: boolean;
}) => (
  <a
    href={href}
    className={cn(
      "inline-flex items-center justify-center gap-2 rounded-full border border-[#8e6f2a] bg-[#c39a41] px-6 py-3 text-md font-semibold text-[#17120a]",
      "shadow-[0_10px_24px_rgba(20,16,8,0.45)]",
      "hover:bg-[#d2ab58] focus:outline-none focus:ring-2 focus:ring-[#d2ab58] focus:ring-offset-2 focus:ring-offset-[#0a0f1a]",
      className,
    )}
  >
    {children}
    {!hideArrow && <ArrowRight />}
  </a>
);

export const GhostButton = ({
  href,
  children,
  className = "",
  showArrow = false,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  showArrow?: boolean;
}) => (
  <a
    href={href}
    className={cn(
      "inline-flex items-center justify-center rounded-full px-6 py-3 text-md font-semibold gap-2",
      // "border border-[#4a5875] bg-[#182238] text-[#d6e2ff] hover:bg-[#202f4d]",
      "border border-[#c39a41] bg-[#182238] text-[#c39a41] hover:bg-[#202f4d]",
      "focus:outline-none focus:ring-2 focus:ring-[#6d7fa8] focus:ring-offset-2 focus:ring-offset-[#0a0f1a]",
      className,
    )}
  >
    {children}
    {showArrow && <ArrowRight />}
  </a>
);
