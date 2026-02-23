import G20ParliamentTable from "@/assets/generalAppAssets/G20_Table.jpg";
import ProphetPortrait from "@/assets/generalAppAssets/prophet.png";

import SectionShell from "./sectionShell";
import { PrimaryButton } from "../customIcons";

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
    text: "And it came to pass afterward, that he went throughout every city and village, preaching and shewing the glad tidings of the kingdom of God: ... And certain women, ... Mary called Magdalene, ... And Joanna the wife of Chuza Herod's steward, and Susanna, and many others, which ministered unto him of their substance.",
    ref: "Luke 8: 1-3",
  },
  {
    text: "When the even was come, there came a rich man of Arimathaea, named Joseph, who also himself was Jesus’ disciple.",
    ref: "Matthew 27:57",
  },
  {
    text: "There came also Nicodemus ... and brought a mixture of myrrh and aloes, about an hundred pound weight.",
    ref: "John 19:39",
  },
];

const quotesPaul: Quote[] = [
  {
    text: "Then spake the Lord to Paul in the night by a vision, Be not afraid, but speak, and hold not thy peace: For I am with thee, and no man shall set on thee to hurt thee: for I have much people in this city. And he continued there a year and six months, teaching the word of God among them.",
    ref: "Acts 18:9-11",
  },
  {
    text: "I commend unto you Phebe our sister, ... for she hath been a succourer of many, and of myself also",
    ref: "Romans 16:1-2",
  },
  {
    text: "And a certain woman named Lydia, a seller of purple, of the city of Thyatira, ...: whose heart the Lord opened, that she attended unto the things which were spoken of Paul.",
    ref: "Acts 16:14",
  },
];

const images = {
  aboutImage: G20ParliamentTable,
  leaderPortrait: ProphetPortrait,
};

const About = () => {
  return (
    <div>
      {/* ABOUT (image + quotes, similar to your sample layout) */}
      <SectionShell
        id="about"
        eyebrow="Who we are"
        title="About G20"
        // subtitle="The G20 is a select group of men and women committed to standing with the Prophet in fulfilling the divine mandate of taking the Gospel to all nations."
        className="bg-black"
      >
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-start">
          {/* left image block */}
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-b from-gold-500/15 to-transparent blur-2xl" />
            <div className="relative overflow-hidden rounded-3xl bg-white/5 ring-1 ring-white/10">
              <img src={images.aboutImage} alt="G20 gathering" className="h-[360px] w-full object-cover opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              {/* <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-sm font-semibold text-white">A covenant-based partnership community</p>
                <p className="mt-2 text-sm text-white/70">Not a casual giving programme. A deliberate partnership for major Gospel impact.</p>
              </div> */}
            </div>

            {/* leader portrait chip */}
            {/* <div className="mt-5 flex items-center gap-4 rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
              <img src={images.leaderPortrait} alt="Dr Isaiah Macwealth" className="h-16 w-16 rounded-2xl object-cover" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white">Dr Isaiah Macwealth</p>
                <p className="text-sm text-white/65">Mandate: Taking the Gospel to all nations</p>
              </div>
            </div> */}
          </div>

          {/* right quotes */}
          <div className="h-full">
            <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 mb-6 h-full">
              <p className="text-md leading-7 text-white/90">
                In this generation, the G20 represents a new company of giants, men and women who are strong and discerning, recognising their God-given
                advantage and are positioned to advance the cause of the Gospel.
              </p>
              <p className="text-md leading-7 text-white/90 py-6">
                A select group of men and women committed to standing with the Prophet in fulfilling the divine mandate of taking the Gospel to all nations.
              </p>

              <div className="mt-5">
                <PrimaryButton href="/register">Sign up</PrimaryButton>
              </div>
            </div>
            {/* {quotesDavid.map((q) => (
              <div key={q.ref} className="relative overflow-hidden rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur">
                <div className="absolute left-0 top-0 h-full w-1 bg-gold-500/60" />
                <p className="text-sm leading-7 text-gold-200 italic">“{q.text}”</p>
                <p className="mt-3 text-xs font-semibold tracking-wide text-white/60">{q.ref}</p>
              </div>
            ))}

            <div className={"py-4"}>
              As David had mighty men who stood with him to fulfil God’s word, Jesus also had devoted men and women who laboured with to ensure His mission of
              reaching and saving the lost was accomplished.
            </div>

            {quotesJesus.map((q) => (
              <div key={q.ref} className="relative overflow-hidden rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur">
                <div className="absolute left-0 top-0 h-full w-1 bg-gold-500/60" />
                <p className="text-sm leading-7 text-gold-200 italic">“{q.text}”</p>
                <p className="mt-3 text-xs font-semibold tracking-wide text-white/60">{q.ref}</p>
              </div>
            ))} */}
          </div>
        </div>

        <div className=" mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-start">
          {quotesDavid.map((q) => (
            <div key={q.ref} className="relative overflow-hidden rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur min-h-[160px]">
              <div className="absolute left-0 top-0 h-full w-1 bg-gold-500/60" />
              <p className="text-sm leading-7 text-gold-200 italic">“{q.text}”</p>
              <p className="mt-3 text-xs font-semibold tracking-wide text-white/60">{q.ref}</p>
            </div>
          ))}

          <div className="relative rounded-3xl bg-gradient-to-b from-white/5 to-white/[0.03] p-8 ring-1 ring-white/10 backdrop-blur min-h-[160px]">
            <div className="absolute inset-0 bg-radial-gold opacity-20 pointer-events-none" />

            <p className="text-base leading-8 text-white/85">
              As <span className="font-semibold text-gold-300">David had mighty men</span> who stood with him to fulfil God’s word,
              <span className="font-semibold text-gold-300"> Jesus also had devoted men and women</span> who laboured with Him, ensuring His mission of reaching
              and saving the lost was accomplished, both during and beyond His time on earth.
            </p>
          </div>
          {quotesJesus.map((q) => (
            <div key={q.ref} className="relative overflow-hidden rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur min-h-[160px]">
              <div className="absolute left-0 top-0 h-full w-1 bg-gold-500/60" />
              <p className="text-sm leading-7 text-gold-200 italic">“{q.text}”</p>
              <p className="mt-3 text-xs font-semibold tracking-wide text-white/60">{q.ref}</p>
            </div>
          ))}
          <div className="relative rounded-3xl bg-gradient-to-b from-white/5 to-white/[0.03] p-8 ring-1 ring-white/10 backdrop-blur min-h-[160px]">
            <div className="absolute inset-0 bg-radial-gold opacity-20 pointer-events-none" />

            <p className="text-base leading-8 text-white/85">
              Even after his death, In every generation, God raises men and women{" "}
              <span className="font-semibold text-gold-300">who stand with divine assignments.</span>
            </p>

            <p className="text-xl text-right font-semibold text-gold-600">Will you be one of them?</p>
          </div>

          {quotesPaul.map((q) => (
            <div key={q.ref} className="relative overflow-hidden rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur min-h-[160px]">
              <div className="absolute left-0 top-0 h-full w-1 bg-gold-500/60" />
              <p className="text-sm leading-7 text-gold-200 italic">“{q.text}”</p>
              <p className="mt-3 text-xs font-semibold tracking-wide text-white/60">{q.ref}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 flex justify-center w-full">
          <PrimaryButton href="/register">Join the G20</PrimaryButton>
        </div>
      </SectionShell>
    </div>
  );
};

export default About;
