import G20ParliamentTable from "@/assets/generalAppAssets/G20_Table.jpg";

import SectionShell from "./sectionShell";
import { GhostButton, PrimaryButton } from "../customIcons";

type Quote = { text: string; ref: string };

const quotesDavid: Quote[] = [
  {
    text: "These also are the chief of the mighty men whom David had, who strengthened themselves with him in his kingdom, with all Israel, to make him king, according to the word of the LORD concerning Israel.",
    ref: "1 Chronicles 11:10",
  },
  {
    text: "These be the names of the mighty men whom David had: The Tachmonite that sat in the seat, chief among the captains; the same was Adino the Eznite: he lift up his spear against eight hundred, whom he slew at one time...",
    ref: "2 Samuel 23:8-22",
  },
];

const quotesJesus: Quote[] = [
  {
    text: "And it came to pass afterward, that he went throughout every city and village, preaching and shewing the glad tidings of the kingdom of God... and many others, which ministered unto him of their substance.",
    ref: "Luke 8:1-3",
  },
  {
    text: "When the even was come, there came a rich man of Arimathaea, named Joseph, who also himself was Jesus' disciple.",
    ref: "Matthew 27:57",
  },
  {
    text: "There came also Nicodemus ... and brought a mixture of myrrh and aloes, about an hundred pound weight.",
    ref: "John 19:39",
  },
];

const quotesPaul: Quote[] = [
  {
    text: "Then spake the Lord to Paul in the night by a vision, Be not afraid, but speak... for I have much people in this city.",
    ref: "Acts 18:9-11",
  },
  {
    text: "I commend unto you Phebe our sister ... for she hath been a succourer of many, and of myself also.",
    ref: "Romans 16:1-2",
  },
  {
    text: "A certain woman named Lydia... whose heart the Lord opened, that she attended unto the things which were spoken of Paul.",
    ref: "Acts 16:14",
  },
];

const About = () => {
  return (
    <SectionShell id="about" eyebrow="Who we are" title="About G20" className="bg-[#0c1423]">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-start">
        <div className="relative overflow-hidden rounded-3xl border border-[#2e3a55] bg-[#111c31]">
          <img src={G20ParliamentTable} alt="G20 gathering" className="h-[360px] w-full object-cover" />
          <div className="absolute inset-0 bg-[#0b1120]/30" />
        </div>

        <div className="rounded-3xl border border-[#2e3a55] bg-[#111c31] p-6">
          <p className="text-md leading-7 text-[#d3dff5]">
            In this generation, the G20 represents a new company of giants, men and women who are strong and discerning, recognising their God-given advantage
            and positioned to advance the cause of the Gospel.
          </p>
          <p className="text-md leading-7 text-[#d3dff5] py-6">
            A select group of men and women committed to standing with the Prophet in fulfilling the divine mandate of taking the Gospel to all nations.
          </p>

          <div className="mt-5 gap-4 flex flex-wrap">
            <PrimaryButton href="/register">Sign up</PrimaryButton>
            <GhostButton href="/paymentButton" className="hidden sm:inline-flex">
              Give now
            </GhostButton>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-start">
        {quotesDavid.map((q) => (
          <div key={q.ref} className="relative min-h-[160px] overflow-hidden rounded-3xl border border-[#34415b] bg-[#1b2842] p-6">
            <div className="absolute left-0 top-0 h-full w-1 bg-[#d0aa56]" />
            <p className="text-md leading-7 text-[#f0cf86]">"{q.text}"</p>
            <p className="mt-3 text-xs font-semibold tracking-wide text-[#bfcee9] italic">{q.ref}</p>
          </div>
        ))}

        <div className="relative min-h-[160px] rounded-3xl border border-[#34415b] bg-[#1b2842] p-8">
          <p className="text-base leading-8 text-[#dbe5f7]">
            As <span className="font-semibold text-[#f0cf86]">David had mighty men</span> who stood with him to fulfil God's word,
            <span className="font-semibold text-[#f0cf86]"> Jesus also had devoted men and women</span> who laboured with Him, ensuring His mission of reaching
            and saving the lost was accomplished.
          </p>
        </div>

        {quotesJesus.map((q) => (
          <div key={q.ref} className="relative min-h-[160px] overflow-hidden rounded-3xl border border-[#34415b] bg-[#1b2842] p-6">
            <div className="absolute left-0 top-0 h-full w-1 bg-[#d0aa56]" />
            <p className="text-md leading-7 text-[#f0cf86]">"{q.text}"</p>
            <p className="mt-3 text-xs font-semibold tracking-wide text-[#bfcee9] italic">{q.ref}</p>
          </div>
        ))}

        <div className="relative min-h-[160px] rounded-3xl border border-[#34415b] bg-[#1b2842] p-8">
          <p className="text-base leading-8 text-[#dbe5f7]">
            In every generation, God raises men and women <span className="font-semibold text-[#f0cf86]">who stand with divine assignments.</span>
          </p>
          <p className="text-xl text-right font-semibold text-[#f0cf86]">Will you be one of them?</p>
        </div>

        {quotesPaul.map((q) => (
          <div key={q.ref} className="relative min-h-[160px] overflow-hidden rounded-3xl border border-[#34415b] bg-[#1b2842] p-6">
            <div className="absolute left-0 top-0 h-full w-1 bg-[#d0aa56]" />
            <p className="text-md leading-7 text-[#f0cf86] ">"{q.text}"</p>
            <p className="mt-3 text-xs font-semibold tracking-wide text-[#bfcee9] italic">{q.ref}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 flex justify-center w-full gap-8">
        <PrimaryButton href="/register">Join the G20</PrimaryButton>
        <GhostButton href="/login" className="hidden sm:inline-flex">
          Give now
        </GhostButton>
      </div>
    </SectionShell>
  );
};

export default About;
