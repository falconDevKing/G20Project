import { useState } from "react";
import { CheckCircle } from "lucide-react";
import G20Logo from "@/assets/generalAppAssets/G20_logo.png";
import HeroImage from "@/assets/generalAppAssets/ggp-hero.png";
import AboutImage from "@/assets/generalAppAssets/G20_Table.jpg";
import RequirementsImage from "@/assets/generalAppAssets/requirements.png";

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

export default function G20LandingAlt3() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="min-h-screen bg-[#0a0f24] text-[#dce5ff]">
      <header className="sticky top-0 z-50 border-b border-[#343f73] bg-[#11183a]">
        <div className="mx-auto flex max-w-[1320px] items-center justify-between px-4 py-4 sm:px-8">
          <a href="/" className="flex items-center gap-3">
            <img src={G20Logo} alt="G20 logo" className="h-12 w-12 object-contain" />
            <div>
              <p className="text-lg font-bold text-[#ffe0ad]">House of Greats</p>
              <p className="text-sm text-[#b9c8f0]">Energetic Variant</p>
            </div>
          </a>
          <div className="flex gap-2">
            <a href="/login" className="rounded-md border border-[#5a679d] bg-[#202b5b] px-4 py-2 text-sm font-semibold text-[#e1e9ff]">
              Login
            </a>
            <a href="/register" className="rounded-md border border-[#b10f2e] bg-[#d4183f] px-4 py-2 text-sm font-semibold text-white">
              Join the G20
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1320px] grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-12 lg:px-8">
        <section className="relative overflow-hidden rounded-2xl border border-[#434f86] lg:col-span-8">
          <img src={HeroImage} alt="Hero" className="h-[470px] w-full object-cover" />
          <div className="absolute inset-0 bg-[#0b1030]/65" />
          <div className="absolute inset-0 p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#ff7f95]">House of Greats</p>
            <h1 className="mt-3 max-w-2xl text-4xl font-bold text-[#ffe3b4] sm:text-5xl">Stand with the mandate of taking the Gospel to all Nations.</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#dce5ff]">
              The G20 is a select group of men and women committed to standing with Prophet Isaiah Macwealth in fulfilling the divine mandate of global Gospel
              advancement.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="/register" className="rounded-md border border-[#b10f2e] bg-[#d4183f] px-5 py-3 text-sm font-semibold text-white">
                Sign up
              </a>
              <a href="/login" className="rounded-md border border-[#5a679d] bg-[#202b5b] px-5 py-3 text-sm font-semibold text-[#e1e9ff]">
                Login
              </a>
            </div>
          </div>
        </section>

        <aside className="space-y-4 lg:col-span-4">
          <div className="rounded-2xl border border-[#434f86] bg-[#161f48] p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#ff7f95]">Quick Facts</p>
            <p className="mt-3 text-lg font-semibold text-[#ffe3b4]">Minimum annual commitment</p>
            <p className="text-2xl font-bold text-[#ff9cb0]">NGN 1,000,000</p>
          </div>
          <div className="rounded-2xl border border-[#434f86] bg-[#1d2148] p-5">
            <p className="text-lg font-semibold text-[#ffe3b4]">Why G20?</p>
            <ul className="mt-3 space-y-2">
              {["Purposeful", "Impactful", "Accountable"].map((i) => (
                <li key={i} className="flex items-center gap-2 text-[#dce5ff]">
                  <CheckCircle className="h-4 w-4 text-[#ff7f95]" />
                  {i}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-[#434f86] bg-[#151a3a] p-5">
            <img src={G20Logo} alt="Crest" className="mx-auto h-28 w-28 object-contain" />
          </div>
        </aside>

        <section className="grid grid-cols-1 gap-6 lg:col-span-12 lg:grid-cols-12">
          <div className="overflow-hidden rounded-2xl border border-[#434f86] lg:col-span-5">
            <img src={AboutImage} alt="About" className="h-full w-full object-cover" />
          </div>
          <div className="rounded-2xl border border-[#434f86] bg-[#151d44] p-6 lg:col-span-7">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#ff7f95]">Who we are</p>
            <h2 className="mt-3 text-4xl font-bold text-[#ffe3b4]">About G20</h2>
            <p className="mt-4 text-lg leading-8 text-[#dce5ff]">
              In this generation, the G20 represents a new company of giants, men and women who are strong and discerning, recognising their God-given advantage
              and positioned to advance the cause of the Gospel.
            </p>
            <p className="mt-4 text-lg leading-8 text-[#dce5ff]">
              A select group of men and women committed to standing with the Prophet in fulfilling the divine mandate of taking the Gospel to all nations.
            </p>
          </div>
        </section>

        <section className="lg:col-span-12">
          <div className="rounded-2xl border border-[#434f86] bg-[#141a3d] p-6">
            <h3 className="text-3xl font-bold text-[#ffe3b4]">Partnership Categories</h3>
            <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
              {categories.map((c) => (
                <div key={c} className="rounded-xl border border-[#4b578f] bg-[#1c2452] p-4 text-[#dce5ff]">
                  {c}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 lg:col-span-12 lg:grid-cols-12">
          <div className="overflow-hidden rounded-2xl border border-[#434f86] lg:col-span-4">
            <img src={RequirementsImage} alt="Requirements" className="h-full w-full object-cover" />
          </div>
          <div className="rounded-2xl border border-[#434f86] bg-[#141a3d] p-6 lg:col-span-8">
            <h3 className="text-3xl font-bold text-[#ffe3b4]">Membership Requirements</h3>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {requirements.map((r) => (
                <div key={r} className="flex gap-2 text-[#dce5ff]">
                  <CheckCircle className="mt-1 h-4 w-4 text-[#ff7f95]" />
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="lg:col-span-12">
          <div className="rounded-2xl border border-[#434f86] bg-[#151d44] p-6">
            <h3 className="text-3xl font-bold text-[#ffe3b4]">Benefits of Partnership</h3>
            <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
              {benefits.map((b) => (
                <div key={b} className="rounded-xl border border-[#4b578f] bg-[#1c2452] p-4 text-[#dce5ff]">
                  {b}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="lg:col-span-12">
          <div className="rounded-2xl border border-[#7d2f4a] bg-[#2b1630] p-6">
            <h3 className="text-3xl font-bold text-[#ffe3b4]">Frequently Asked Questions</h3>
            <div className="mt-4 space-y-2">
              {faq.map((item, idx) => (
                <div key={item.q} className="rounded-xl border border-[#9c4a69] bg-[#381f3e]">
                  <button className="flex w-full items-center justify-between px-4 py-3 text-left" onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}>
                    <span className="font-semibold text-[#ffe3b4]">{item.q}</span>
                    <span className="text-[#ff9cb0]">{openFaq === idx ? "-" : "+"}</span>
                  </button>
                  {openFaq === idx ? <p className="px-4 pb-4 text-[#dce5ff]">{item.a}</p> : null}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#343f73] bg-[#11183a]">
        <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-6 px-4 py-10 sm:grid-cols-3 sm:px-8">
          <div>
            <p className="text-lg font-semibold text-[#ffe3b4]">Contact</p>
            <p className="text-[#dce5ff]">info@g20partnership.org</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-[#ffe3b4]">Address</p>
            <p className="text-[#dce5ff]">Capital House, 47 Rushey Green, London, SE6 4AS</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-[#ffe3b4]">Phone</p>
            <p className="text-[#dce5ff]">+44 7840 303 710</p>
            <p className="text-[#dce5ff]">+44 7727 683 097</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
