import { GhostButton, PrimaryButton } from "../customIcons";
import G20Crest from "@/assets/generalAppAssets/G20_logo.png";

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
  return (
    <div>
      {" "}
      {/* Top nav */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur px-24">
        <div className="mx-auto flex h-24  items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="/" className="flex items-center gap-3">
            <div className="grid h-13 w-12 place-items-center rounded-xl">
              {/* <div className="grid h-13 w-12 place-items-center rounded-xl bg-white/5  ring-white/10"> */}
              <span className="text-xs font-bold tracking-wider text-gold-300">
                <img src={G20Crest} alt="G20 crest Logo" className="object-contain" />
              </span>
            </div>
            <div className="leading-tight">
              <p className="text-md font-semibold">House of Greats</p>
              <p className="text-sm text-white/60">G20 Partnership Platform</p>
            </div>
          </a>

          <nav className="hidden items-center gap-7 text-md text-white/70 md:flex">
            {nav.map((n) => (
              <a key={n.href} href={n.href} className="hover:text-white">
                {n.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <GhostButton href="/login" className="hidden sm:inline-flex">
              Login
            </GhostButton>
            <PrimaryButton href="/register">Sign up</PrimaryButton>
          </div>
        </div>
      </header>
    </div>
  );
};

export default LandingHeader;
