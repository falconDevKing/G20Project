import { useState } from "react";
import { CheckCircle } from "lucide-react";
import G20Logo from "@/assets/generalAppAssets/G20_logo.png";
import HeroImage from "@/assets/generalAppAssets/ggp-hero.png";
import AboutImage from "@/assets/generalAppAssets/G20_Table.jpg";
import ProphetImage from "@/assets/generalAppAssets/prophet.png";
import RequirementsImage from "@/assets/generalAppAssets/requirements.png";
import BannerImage from "@/assets/generalAppAssets/shake.png";

export type LandingVariant = "alt1" | "alt2" | "alt3" | "alt4";

type Theme = {
  pageBg: string;
  headerBg: string;
  headerBorder: string;
  panel: string;
  panelAlt: string;
  panelBorder: string;
  title: string;
  body: string;
  muted: string;
  accent: string;
  accentSoft: string;
  primaryBtn: string;
  secondaryBtn: string;
  bannerBg: string;
  bannerText: string;
};

const themes: Record<LandingVariant, Theme> = {
  alt1: {
    pageBg: "bg-[#08090d]",
    headerBg: "bg-[#0d0d12]",
    headerBorder: "border-[#3f3420]",
    panel: "bg-[#121318]",
    panelAlt: "bg-[#18140f]",
    panelBorder: "border-[#5e4a23]",
    title: "text-[#f4de9f]",
    body: "text-[#e8dcc0]",
    muted: "text-[#c9b78a]",
    accent: "text-[#d6ad4b]",
    accentSoft: "bg-[#2a2112]",
    primaryBtn: "border-[#8f6f2b] bg-[#c79a3e] text-[#1b1308] hover:bg-[#d3ad5f]",
    secondaryBtn: "border-[#6a5324] bg-[#1a1711] text-[#f4de9f] hover:bg-[#262018]",
    bannerBg: "bg-[#b7882e]",
    bannerText: "text-[#1b1308]",
  },
  alt2: {
    pageBg: "bg-[#edf3fb]",
    headerBg: "bg-[#f8fbff]",
    headerBorder: "border-[#c9d8ec]",
    panel: "bg-[#ffffff]",
    panelAlt: "bg-[#f5f9ff]",
    panelBorder: "border-[#c7d8ee]",
    title: "text-[#12335d]",
    body: "text-[#264a74]",
    muted: "text-[#5f7ea5]",
    accent: "text-[#1e5a9f]",
    accentSoft: "bg-[#ebf3ff]",
    primaryBtn: "border-[#1e5a9f] bg-[#1e5a9f] text-white hover:bg-[#2a6bb8]",
    secondaryBtn: "border-[#8ea8c8] bg-white text-[#1e5a9f] hover:bg-[#eef5ff]",
    bannerBg: "bg-[#dbe7f7]",
    bannerText: "text-[#12335d]",
  },
  alt3: {
    pageBg: "bg-[#0d1020]",
    headerBg: "bg-[#131832]",
    headerBorder: "border-[#3b4369]",
    panel: "bg-[#171d38]",
    panelAlt: "bg-[#241a2f]",
    panelBorder: "border-[#4f567d]",
    title: "text-[#ffe2b0]",
    body: "text-[#d9e2ff]",
    muted: "text-[#b6c3ef]",
    accent: "text-[#ff6d82]",
    accentSoft: "bg-[#341f2f]",
    primaryBtn: "border-[#b10f2e] bg-[#d4183f] text-white hover:bg-[#e9224d]",
    secondaryBtn: "border-[#5d6896] bg-[#1a2142] text-[#dce6ff] hover:bg-[#25305f]",
    bannerBg: "bg-[#2e2140]",
    bannerText: "text-[#ffe2b0]",
  },
  alt4: {
    pageBg: "bg-[#14151c]",
    headerBg: "bg-[#c79a3a]",
    headerBorder: "border-[#a57a22]",
    panel: "bg-[#1c1e26]",
    panelAlt: "bg-[#181923]",
    panelBorder: "border-[#6f5624]",
    title: "text-[#d4a43e]",
    body: "text-[#f0f2f8]",
    muted: "text-[#d0d5e4]",
    accent: "text-[#f4dc74]",
    accentSoft: "bg-[#241b0f]",
    primaryBtn: "border-[#b40622] bg-[#e10628] text-white hover:bg-[#f11235]",
    secondaryBtn: "border-[#2d3040] bg-[#e9e9ea] text-[#8f6a1f] hover:bg-white",
    bannerBg: "bg-[#c79a3a]",
    bannerText: "text-[#fff7e6]",
  },
};

const aboutParagraphs = [
  "In this generation, the G20 represents a new company of giants, men and women who are strong and discerning, recognising their God-given advantage and positioned to advance the cause of the Gospel.",
  "A select group of men and women committed to standing with the Prophet in fulfilling the divine mandate of taking the Gospel to all nations.",
];

const quotes = [
  "These also are the chief of the mighty men whom David had, who strengthened themselves with him in his kingdom, with all Israel, to make him king, according to the word of the LORD concerning Israel.",
  "These be the names of the mighty men whom David had: ... Adino the Eznite; he lifted up his spear against eight hundred, whom he slew at one time.",
  "And it came to pass afterward, that he went throughout every city and village, preaching and shewing the glad tidings of the kingdom of God.",
  "In every generation, God raises men and women who stand with divine assignments.",
];

const categories = [
  "Category 1 - Bronze Honorary Member: NGN 1 million to NGN 2 million per year",
  "Category 2 - Silver Honorary Member: Above NGN 2 million to NGN 5 million per year",
  "Category 3 - Gold Honorary Member: Above NGN 5 million to NGN 10 million per year",
  "Category 4 - Diamond Honorary Member: Above NGN 10 million to NGN 25 million per year",
  "Category 5 - Platinum Honorary Member: Above NGN 25 million per year",
];

const requirements = [
  "Be a born again child of God with a clear testimony of salvation.",
  "Be a lover of Jesus Christ and his church on earth.",
  "Demonstrate love and passion for the growth and expansion of the ministry.",
  "Have joy and willingness in giving whenever opportunities arise.",
  "Carry a genuine burden for souls and for the spread of the Gospel.",
  "Love the vision and ministry of Prophet Isaiah Macwealth.",
  "Commit to sowing at least NGN 1,000,000 annually toward the ministry's mission.",
  "Maintain a life that is faithful, responsible, consistent, truthful, and pure.",
  "Have credible income sources to sustain the commitment.",
];

const benefits = [
  "Fulfilling the Kingdom mandate",
  "Create eternal value",
  "Build a lasting legacy",
  "Personalised support",
  "Gain global influence",
  "Recognition and awards",
];

const faq = [
  {
    q: "What is the difference between GGP and G20?",
    a: "GGP is monthly partnership. G20 is a higher-tier annual partnership for major Gospel projects.",
  },
  {
    q: "Who can become a G20 partner?",
    a: "Men and women aligned with the mandate who can commit at least NGN 1,000,000 annually.",
  },
  {
    q: "Can I partner from outside Nigeria?",
    a: "Yes. International partners can join and remit in equivalent local currency through available options.",
  },
];

const nav = [
  { label: "About", href: "#about" },
  { label: "Categories", href: "#categories" },
  { label: "Requirements", href: "#requirements" },
  { label: "Benefits", href: "#benefits" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

export default function LandingVariantTemplate({ variant }: { variant: LandingVariant }) {
  const t = themes[variant];
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className={`min-h-screen ${t.pageBg}`}>
      <header className={`sticky top-0 z-50 border-b ${t.headerBorder} ${t.headerBg}`}>
        <div className="mx-auto flex max-w-[1300px] items-center justify-between px-4 py-4 sm:px-8">
          <a href="/" className="flex items-center gap-3">
            <img src={G20Logo} alt="G20 logo" className="h-14 w-14 object-contain" />
            <div>
              <p className={`text-lg font-semibold ${t.title}`}>House of Greats</p>
              <p className={`text-sm ${t.muted}`}>G20 Partnership Platform</p>
            </div>
          </a>
          <nav className="hidden items-center gap-6 lg:flex">
            {nav.map((item) => (
              <a key={item.href} href={item.href} className={`text-sm font-semibold ${t.body} hover:${t.accent}`}>
                {item.label}
              </a>
            ))}
          </nav>
          <div className="flex gap-2">
            <a href="/login" className={`rounded-md border px-4 py-2 text-sm font-semibold ${t.secondaryBtn}`}>
              Login
            </a>
            <a href="/register" className={`rounded-md border px-4 py-2 text-sm font-semibold ${t.primaryBtn}`}>
              Sign up
            </a>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <img src={HeroImage} alt="Hero" className="h-[460px] w-full object-cover" />
        <div className="absolute inset-0 bg-[#0a0b10]/60" />
        <div className="absolute inset-0 mx-auto flex max-w-[1300px] items-center px-4 sm:px-8">
          <div className={`max-w-2xl rounded-2xl border ${t.panelBorder} ${t.panel} p-6`}>
            <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${t.accent}`}>House of Greats</p>
            <h1 className={`mt-3 text-4xl font-bold ${t.title}`}>Stand with the mandate of taking the Gospel to all Nations.</h1>
            <p className={`mt-4 text-base leading-7 ${t.body}`}>
              The G20 is a select group of men and women committed to standing with Prophet Isaiah Macwealth in fulfilling the divine mandate of global Gospel
              advancement.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="/register" className={`rounded-md border px-5 py-3 text-sm font-semibold ${t.primaryBtn}`}>
                Join the G20
              </a>
              <a href="#about" className={`rounded-md border px-5 py-3 text-sm font-semibold ${t.secondaryBtn}`}>
                Learn more
              </a>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-[1300px] space-y-12 px-4 py-12 sm:px-8">
        <section id="about" className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className={`overflow-hidden rounded-2xl border ${t.panelBorder} ${t.panel}`}>
            <img src={AboutImage} alt="About" className="h-full w-full object-cover" />
          </div>
          <div className={`rounded-2xl border ${t.panelBorder} ${t.panel} p-6`}>
            <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${t.accent}`}>Who we are</p>
            <h2 className={`mt-3 text-5xl font-bold ${t.title}`}>About G20</h2>
            {aboutParagraphs.map((p) => (
              <p key={p} className={`mt-5 text-lg leading-8 ${t.body}`}>
                {p}
              </p>
            ))}
          </div>
        </section>

        <section className={`rounded-2xl border ${t.panelBorder} ${t.panelAlt} p-6`}>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {quotes.map((q) => (
              <blockquote key={q} className={`rounded-xl border-l-4 border-[#d4a43e] ${t.accentSoft} p-4 text-lg italic ${t.accent}`}>
                {q}
              </blockquote>
            ))}
          </div>
        </section>

        <section id="categories" className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className={`rounded-2xl border ${t.panelBorder} ${t.panel} p-6`}>
            <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${t.accent}`}>Yearly commitment levels</p>
            <h2 className={`mt-3 text-4xl font-bold ${t.title}`}>Partnership Categories</h2>
            <div className="mt-6 space-y-4">
              {categories.map((c) => (
                <div key={c} className="flex gap-3">
                  <CheckCircle className={`mt-1 h-5 w-5 ${t.accent}`} />
                  <p className={`text-base ${t.body}`}>{c}</p>
                </div>
              ))}
            </div>
          </div>
          <div className={`overflow-hidden rounded-2xl border ${t.panelBorder} ${t.panel}`}>
            <img src={ProphetImage} alt="Prophet" className="h-full w-full object-cover" />
          </div>
        </section>

        <section id="requirements" className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className={`overflow-hidden rounded-2xl border ${t.panelBorder} ${t.panel}`}>
            <img src={RequirementsImage} alt="Requirements" className="h-full w-full object-cover" />
          </div>
          <div className={`rounded-2xl border ${t.panelBorder} ${t.panel} p-6`}>
            <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${t.accent}`}>Who should join</p>
            <h2 className={`mt-3 text-4xl font-bold ${t.title}`}>Membership Requirements</h2>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {requirements.map((r) => (
                <div key={r} className="flex gap-3">
                  <CheckCircle className={`mt-1 h-5 w-5 ${t.accent}`} />
                  <p className={`text-base ${t.body}`}>{r}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="benefits" className={`rounded-2xl border ${t.panelBorder} ${t.panel} p-6`}>
          <h2 className={`text-4xl font-bold ${t.title}`}>Benefits of Partnership</h2>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            {benefits.map((b) => (
              <div key={b} className={`rounded-xl border ${t.panelBorder} ${t.panelAlt} p-4`}>
                <p className={`text-lg font-semibold ${t.accent}`}>{b}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={`rounded-2xl border ${t.panelBorder} ${t.bannerBg} p-8 text-center`}>
          <img src={BannerImage} alt="Banner" className="mx-auto mb-4 h-20 w-auto object-contain" />
          <h3 className={`text-3xl font-bold ${t.bannerText}`}>Your support is bringing purpose to countless lives.</h3>
          <p className={`mx-auto mt-3 max-w-3xl text-base ${t.bannerText}`}>
            Through your generosity and commitment, you are helping advance the Gospel across nations and transform lives.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <a href="/login" className={`rounded-md border px-5 py-3 text-sm font-semibold ${t.primaryBtn}`}>
              Login to Dashboard
            </a>
            <a href="/register" className={`rounded-md border px-5 py-3 text-sm font-semibold ${t.secondaryBtn}`}>
              Sign up
            </a>
          </div>
        </section>

        <section id="faq" className={`rounded-2xl border ${t.panelBorder} ${t.panel} p-6`}>
          <h2 className={`text-4xl font-bold ${t.title}`}>Frequently asked questions</h2>
          <div className="mt-6 space-y-3">
            {faq.map((item, idx) => (
              <div key={item.q} className={`rounded-xl border ${t.panelBorder} ${t.panelAlt}`}>
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left"
                >
                  <span className={`text-base font-semibold ${t.body}`}>{item.q}</span>
                  <span className={`${t.accent}`}>{openFaq === idx ? "-" : "+"}</span>
                </button>
                {openFaq === idx ? <p className={`px-4 pb-4 ${t.muted}`}>{item.a}</p> : null}
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer id="contact" className={`border-t ${t.headerBorder} ${t.headerBg}`}>
        <div className="mx-auto grid max-w-[1300px] grid-cols-1 gap-6 px-4 py-10 sm:grid-cols-3 sm:px-8">
          <div>
            <p className={`text-xl font-semibold ${t.title}`}>Contact</p>
            <p className={`mt-2 ${t.body}`}>info@globalgospelpartnership.org</p>
          </div>
          <div>
            <p className={`text-xl font-semibold ${t.title}`}>Address</p>
            <p className={`mt-2 ${t.body}`}>Capital House, 47 Rushey Green, London, SE6 4AS</p>
          </div>
          <div>
            <p className={`text-xl font-semibold ${t.title}`}>Phone</p>
            <p className={`mt-2 ${t.body}`}>+44 7840 303 710</p>
            <p className={`${t.body}`}>+44 7727 683 097</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
