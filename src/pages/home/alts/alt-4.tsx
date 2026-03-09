import { useState } from "react";
import { CheckCircle } from "lucide-react";
import G20Logo from "@/assets/generalAppAssets/G20_logo.png";
import AboutImage from "@/assets/generalAppAssets/G20_Table.jpg";
import ProphetImage from "@/assets/generalAppAssets/prophet.png";
import RequirementsImage from "@/assets/generalAppAssets/requirements.png";

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

const categories = [
  "Category 1 - Bronze Honorary Member: NGN 1 million to NGN 2 million per year",
  "Category 2 - Silver Honorary Member: Above NGN 2 million to NGN 5 million per year",
  "Category 3 - Gold Honorary Member: Above NGN 5 million to NGN 10 million per year",
  "Category 4 - Diamond Honorary Member: Above NGN 10 million to NGN 25 million per year",
  "Category 5 - Platinum Honorary Member: Above NGN 25 million per year",
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

export default function G20LandingAlt4() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="min-h-screen bg-[#16171d] text-white">
      <header className="sticky top-0 z-50 border-b border-[#9e7724] bg-[#c79a3a]">
        <div className="mx-auto flex max-w-[1320px] items-center justify-between px-4 py-3 sm:px-8">
          <a href="/" className="flex items-center gap-3">
            <img src={G20Logo} alt="G20 logo" className="h-14 w-14 object-contain" />
            <span className="font-bold text-[#2a210f]">House of Greats</span>
          </a>
          <nav className="hidden gap-6 lg:flex">
            {[
              ["Home", "#"],
              ["About", "#about"],
              ["Categories", "#categories"],
              ["Benefits", "#benefits"],
              ["Contact", "#contact"],
            ].map(([label, href]) => (
              <a key={label} href={href} className="text-sm font-semibold text-[#2a210f] hover:opacity-80">
                {label}
              </a>
            ))}
          </nav>
          <div className="flex gap-2">
            <a href="/register" className="rounded-md border border-[#2a210f] bg-[#e9e9ea] px-4 py-2 text-sm font-semibold text-[#8f6a1f]">Give Now</a>
            <a href="/login" className="rounded-md border border-[#b40622] bg-[#e10628] px-4 py-2 text-sm font-semibold text-white">Login to Dashboard</a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1320px] space-y-10 px-4 py-8 sm:px-8">
        <section className="rounded-[2.2rem] border border-[#9e7724] bg-[#c79a3a] p-8 text-center">
          <h1 className="text-4xl font-bold text-[#fff4dc]">Your support is bringing purpose to countless lives.</h1>
          <p className="mx-auto mt-3 max-w-4xl text-lg text-[#fff4dc]">
            Through your generosity and commitment, you're making a global impact and helping advance the Gospel across nations.
          </p>
          <a href="/login" className="mt-6 inline-flex rounded-md border border-[#b40622] bg-[#e10628] px-6 py-3 font-semibold text-white">
            Login to Dashboard
          </a>
        </section>

        <section id="about" className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="overflow-hidden rounded-2xl border border-[#6f5624] bg-[#111217] lg:col-span-6">
            <img src={AboutImage} alt="About" className="h-full w-full object-cover" />
          </div>
          <div className="space-y-4 rounded-2xl border border-[#6f5624] bg-[#1c1e26] p-6 lg:col-span-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#f4dc74]">Who we are</p>
            <h2 className="text-5xl font-bold text-[#d4a43e]">About G20</h2>
            <p className="text-xl leading-8 text-[#f0f2f8]">
              The G20 is a select group of men and women committed to standing with Dr Isaiah Macwealth in fulfilling the divine mandate of taking the Gospel to all nations.
            </p>
            {[
              "These also are the chief of the mighty men whom David had, who strengthened themselves with him in his kingdom, with all Israel, to make him king, according to the word of the LORD concerning Israel...",
              "These be the names of the mighty men whom David had: ... Adino the Eznite; he lifted up his spear against eight hundred, whom he slew at one time.",
            ].map((q, idx) => (
              <blockquote key={idx} className="border-l-4 border-[#d4a43e] bg-[#241b0f] p-4 text-2xl italic text-[#f4dc74]">
                {q}
              </blockquote>
            ))}
          </div>
        </section>

        <section id="requirements" className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="overflow-hidden rounded-2xl border border-[#6f5624] bg-[#111217] lg:col-span-6">
            <img src={RequirementsImage} alt="Requirements" className="h-full w-full object-cover" />
          </div>
          <div className="rounded-2xl border border-[#6f5624] bg-[#1c1e26] p-6 lg:col-span-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#f4dc74]">Who should join</p>
            <h3 className="mt-2 text-5xl font-bold text-[#d4a43e]">Membership Requirements</h3>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {requirements.map((r) => (
                <div key={r} className="flex gap-2 text-xl leading-8 text-[#f0f2f8]">
                  <CheckCircle className="mt-1 h-5 w-5 text-[#f4dc74]" />
                  <span>{r}</span>
                </div>
              ))}
            </div>
            <a href="/register" className="mt-6 inline-flex rounded-md border border-[#b40622] bg-[#e10628] px-6 py-3 font-semibold text-white">
              Join now
            </a>
          </div>
        </section>

        <section id="categories" className="rounded-2xl border border-[#6f5624] bg-[#1c1e26] p-6">
          <h3 className="text-4xl font-bold text-[#d4a43e]">Partnership Categories</h3>
          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
            {categories.map((c) => (
              <div key={c} className="rounded-xl border border-[#6f5624] bg-[#241b0f] p-4 text-[#f0f2f8]">{c}</div>
            ))}
          </div>
        </section>

        <section id="benefits" className="rounded-2xl border border-[#6f5624] bg-[#111217] p-6">
          <h3 className="text-center text-5xl font-bold text-[#d4a43e]">Benefits of Partnership</h3>
          <div className="mx-auto mt-8 grid max-w-[1000px] grid-cols-1 gap-4 md:grid-cols-2">
            {benefits.map((b) => (
              <div key={b} className="flex gap-2 rounded-xl border border-[#6f5624] bg-[#1c1e26] p-4 text-[#f0f2f8]">
                <CheckCircle className="mt-1 h-5 w-5 text-[#f4dc74]" />
                <span className="text-lg">{b}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="overflow-hidden rounded-2xl border border-[#6f5624] bg-[#111217] lg:col-span-5">
            <img src={ProphetImage} alt="Prophet" className="h-full w-full object-cover" />
          </div>
          <div className="rounded-2xl border border-[#6f5624] bg-[#1c1e26] p-6 lg:col-span-7">
            <h3 className="text-5xl font-bold text-[#d4a43e]">YOU'RE WELCOME!</h3>
            <p className="mt-5 text-xl leading-9 text-[#f0f2f8]">
              On behalf of the Prophet, we welcome all partners to this community in the name of Jesus, and we thank you for being a partner with the Prophet.
              Because you are signed up for partnership, you will be receiving communication from the prophet's office.
            </p>
          </div>
        </section>

        <section id="faq" className="rounded-2xl border border-[#6f5624] bg-[#1c1e26] p-6">
          <h3 className="text-4xl font-bold text-[#d4a43e]">Frequently Asked Questions</h3>
          <div className="mt-4 space-y-2">
            {faq.map((item, idx) => (
              <div key={item.q} className="rounded-xl border border-[#6f5624] bg-[#241b0f]">
                <button className="flex w-full items-center justify-between px-4 py-3 text-left" onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}>
                  <span className="font-semibold text-[#f4dc74]">{item.q}</span>
                  <span className="text-[#f4dc74]">{openFaq === idx ? "-" : "+"}</span>
                </button>
                {openFaq === idx ? <p className="px-4 pb-4 text-[#f0f2f8]">{item.a}</p> : null}
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer id="contact" className="border-t border-[#6f5624] bg-[#111217]">
        <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-6 px-4 py-10 sm:grid-cols-3 sm:px-8">
          <div>
            <p className="text-lg font-semibold text-[#d4a43e]">Contact</p>
            <p className="text-[#f0f2f8]">info@globalgospelpartnership.org</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-[#d4a43e]">Address</p>
            <p className="text-[#f0f2f8]">Capital House, 47 Rushey Green, London, SE6 4AS</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-[#d4a43e]">Phone</p>
            <p className="text-[#f0f2f8]">+44 7840 303 710</p>
            <p className="text-[#f0f2f8]">+44 7727 683 097</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
