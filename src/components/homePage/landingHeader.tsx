import { useState } from "react";
import { Menu, X } from "lucide-react";
import { GhostButton, PrimaryButton } from "../customIcons";
import G20Crest from "@/assets/generalAppAssets/G20_logo.png";
import { OfflineBankDetails } from "./offlinePaymentDetails";

type NavItem = { label: string; href: string };

// Nav
const nav: NavItem[] = [
  { label: "About", href: "#about" },
  { label: "Categories", href: "#categories" },
  { label: "Requirements", href: "#requirements" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

const LandingHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div>
      <header className="sticky top-0 z-50 border-b border-[#29334a] bg-[#0f1728]/95 backdrop-blur">
        <div className="mx-auto flex min-h-[88px] max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-10">
          <a href="/" className="flex items-center gap-3">
            <div className="grid h-12 w-10 place-items-center rounded-xl sm:h-13 sm:w-12">
              <span className="text-xs font-bold tracking-wider text-gold-300">
                <img src={G20Crest} alt="G20 crest Logo" className="h-full w-full object-contain" />
              </span>
            </div>
            <div className="min-w-0 leading-tight">
              <p className="text-sm font-semibold text-[#f8f1e3] sm:text-md">House of Greats</p>
              <p className="text-xs text-[#b8c6e3] sm:text-sm">G20 Partnership Platform</p>
            </div>
          </a>

          <nav className="hidden items-center gap-7 text-md text-[#c9d5ef] lg:flex">
            {nav.map((n) => (
              <a key={n.href} href={n.href} className="hover:text-[#f6e8c3]">
                {n.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <OfflineBankDetails />
            <PrimaryButton href="/login">Login</PrimaryButton>
          </div>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#3c4863] bg-[#17253f] text-[#f8f1e3] lg:hidden"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileMenuOpen ? (
          <div className="border-t border-[#29334a] lgd:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6">
              <nav className="flex flex-col gap-2 text-sm text-[#c9d5ef]">
                {nav.map((n) => (
                  <a
                    key={n.href}
                    href={n.href}
                    className="rounded-2xl border border-[#2e3a55] bg-[#111c31] px-4 py-3 hover:text-[#f6e8c3]"
                    onClick={closeMobileMenu}
                  >
                    {n.label}
                  </a>
                ))}
              </nav>

              <div className="flex flex-col gap-3">
                <OfflineBankDetails fullWidthOnMobile />
                <GhostButton href="/login" fullWidthOnMobile onClick={closeMobileMenu}>
                  Login
                </GhostButton>
              </div>
            </div>
          </div>
        ) : null}
      </header>
    </div>
  );
};

export default LandingHeader;
