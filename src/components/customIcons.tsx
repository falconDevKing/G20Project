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
  <span className="grid h-9 w-9 place-items-center rounded-xl bg-gold-500/10 text-gold-400 ring-1 ring-gold-500/20">{children}</span>
);

export const ShieldAlert = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={cn("h-8 w-8", className)} fill="none" aria-hidden="true">
    <path d="M12 2l8 4v6c0 5-3.5 9.5-8 10-4.5-.5-8-5-8-10V6l8-4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    <path d="M12 8v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M12 16h.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

export const PrimaryButton = ({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) => (
  <a
    href={href}
    className={cn(
      "inline-flex items-center justify-center gap-2 rounded-full bg-gold-500 px-6 py-3 text-md font-semibold text-black",
      "shadow-[0_14px_40px_rgba(197,160,72,0.25)]",
      "hover:bg-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-500/60 focus:ring-offset-2 focus:ring-offset-black",
      className,
    )}
  >
    {children}
    <ArrowRight />
  </a>
);

export const GhostButton = ({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) => (
  <a
    href={href}
    className={cn(
      "inline-flex items-center justify-center rounded-full px-6 py-3 text-md font-semibold",
      "text-gold-200 ring-1 ring-gold-500/25 hover:bg-white/5",
      "focus:outline-none focus:ring-2 focus:ring-gold-500/60 focus:ring-offset-2 focus:ring-offset-black",
      className,
    )}
  >
    {children}
  </a>
);
