import G20Crest from "@/assets/generalAppAssets/G20_logo.png";
import ProphetMinisteringPicture from "@/assets/generalAppAssets/GGP-hero.png";

import { GhostButton, PrimaryButton } from "../customIcons";

const Hero = () => {
  return (
    <div>
      {" "}
      {/* HERO */}
      <section className="relative overflow-hidden px-6 sm:px-16 lg:px-24">
        {/* background image */}
        <div className="absolute inset-0">
          <img src={ProphetMinisteringPicture} alt="" className="h-full w-full object-cover opacity-100" />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(197,160,72,0.22),transparent_45%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.06),transparent_45%)]" />
        </div>

        <div className="relative mx-auto  px-4 py-14 sm:px-6 sm:py-12 lg:px-8">
          <div className="mx-auto grid  grid-cols-1 items-center gap-10 lg:grid-cols-2">
            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-3 rounded-full bg-white/5 px-4 py-2 ring-1 ring-white/10">
                <span className="text-xs font-semibold tracking-[0.22em] text-gold-300 uppercase">House of Greats</span>
                <span className="h-1 w-1 rounded-full bg-white/30" />
                <span className="text-xs text-white/70">Annual Partnership</span>
              </div>

              <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl">Stand with the mandate of taking the Gospel to all Nations.</h1>

              <p className="mt-5 max-w-xl text-sm leading-7 text-white/70 sm:text-base">
                The G20 is a select group of men and women committed to standing with Prophet Isaiah Macwealth in fulfilling the divine mandate of global Gospel
                advancement, leading to the harvest of 1 billion souls and 3 million Jews conversion.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <div className="rounded-full bg-white/5 px-4 py-2 text-sm text-white/80 ring-1 ring-white/10">
                  Minimum annual commitment: <span className="font-semibold text-gold-300">₦1,000,000</span>
                </div>
                <div className="rounded-full bg-white/5 px-4 py-2 text-sm text-white/80 ring-1 ring-white/10">Conviction-led Partnership</div>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <PrimaryButton href="/register">Join the G20</PrimaryButton>
                <GhostButton href="#about">Learn more</GhostButton>
              </div>

              {/* small highlight cards */}
              <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  { title: "Purposeful", body: "Giving with clarity, intention, and meaning." },
                  { title: "Impactful", body: "High-capacity partnership for major Gospel projects." },
                  { title: "Accountable", body: "A clear personal record of your annual partnership." },
                ].map((c) => (
                  <div key={c.title} className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10 backdrop-blur">
                    <p className="text-sm font-semibold text-white">{c.title}</p>
                    <p className="mt-2 text-sm text-white/65">{c.body}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right crest + glow */}
            <div className="relative mx-auto w-full max-w-md">
              <div className="absolute -inset-10 rounded-full bg-[radial-gradient(circle,rgba(197,160,72,0.22),transparent_60%)] blur-2xl" />
              <div className="relative rounded-3xl bg-white/5 p-8 ring-1 ring-white/10 backdrop-blur">
                <div className="mx-auto grid place-items-center">
                  <img src={G20Crest} alt="G20 crest" className="h-48 w-48 object-contain" />
                </div>
                <div className="mt-6 text-center">
                  <p className="text-xs font-semibold tracking-[0.22em] text-gold-300 uppercase">Who we are</p>
                  <p className="mt-2 text-xl font-semibold">The House of Greats</p>
                  <p className="mt-3 text-sm text-white/70">
                    A community of giants in this generation, standing in strength and discernment to advance the cause of the Gospel.
                  </p>
                </div>

                <div className="mt-6 rounded-2xl bg-black/40 p-5 ring-1 ring-white/10">
                  <p className="text-sm italic text-gold-200">“These also are the chief of the mighty men whom David had...”</p>
                  <p className="mt-2 text-xs font-semibold text-white/60">1 Chronicles 11:10</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
