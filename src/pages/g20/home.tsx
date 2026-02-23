import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Logo from "../../assets/G20_logo.png";
import G20Table from "../../assets/G20_Table.jpg";
import Prophet from "../../assets/prophet.png";
import Requirements from "../../assets/requirements.png";
import { Link } from "react-router";
import { Footer } from "@/components/landingHomePageComp/footer";
import { cn } from "@/lib/utils";

export type G20LandingProps = {
  images?: {
    about?: string;
    categories?: string;
    requirements?: string;
  };
};

const RequirementItem: React.FC<{ text: string }> = ({ text }) => (
  <li className="flex items-start gap-3">
    <CheckCircle className="mt-1 h-5 w-5 flex-none text-[#f0e783]" />
    <span>{text}</span>
  </li>
);

const categories = [
  { title: "Category 1 – Bronze Honorary Member", amount: "₦1 million to ₦2 million per year (Entry level)" },
  { title: "Category 2 – Silver Honorary Member", amount: "Above ₦2 million to ₦5 million per year" },
  { title: "Category 3 – Gold Honorary Member", amount: "Above ₦5 million to ₦10 million per year" },
  { title: "Category 4 – Diamond Honorary Member", amount: "Above ₦10 million to ₦25 million per year" },
  { title: "Category 5 – Platinum Honorary Member", amount: "Above ₦25 million per year (Highest level)" },
];

const requirements = [
  "Be a Global Gospel Partner of Isaiah Wealth Ministries",
  "Be a faithful tither",
  "Demonstrate love and passion for the growth and expansion of the ministry",
  "Have joy and willingness in giving whenever opportunities arise",
  "Carry a genuine burden for souls and for the spread of the Gospel",
  "Be a spiritual son or daughter of Dr Isaiah Macwealth, showing loyalty and shared vision",
  "Commit to sowing at least ₦1,000,000 annually toward the ministry’s mission",
  "Maintain a life that is faithful, responsible, consistent, truthful, and pure",
  "Have credible income sources to sustain the commitment",
];

const KJVQuote: React.FC<{ verse: string; refText: string }> = ({ verse, refText }) => (
  <blockquote className="border-l-4 border-[#cc9e35] pl-4 italic text-[#f0e783]">
    <p>“{verse}”</p>
    <span className="mt-1 block text-xs tracking-wide text-[#FAF5EC]">{refText}</span>
  </blockquote>
);

const images = {
  about: G20Table,
  categories: Prophet,
  requirements: Requirements,
};

const Section: React.FC<{
  id: string;
  title: string;
  ctaHref: string;
  children: React.ReactNode;
  kicker?: string;
  imageSrc?: string;
  imageAlt?: string;
  imageLeft?: boolean;
  imageSizing?: string;
}> = ({ id, title, kicker, children, imageSrc, imageAlt, imageLeft, ctaHref, imageSizing }) => (
  <section id={id} className="py-8 md:py-12 bg-[#1E1E1E] text-[#FAF5EC]">
    <div className="container mx-auto px-4">
      <div
        className={`grid items-center gap-10 md:gap-12 lg:gap-16 ${imageLeft ? "lg:grid-cols-[1.1fr_1fr]" : "lg:grid-cols-[1fr_1.1fr]"} ${id === "requirements" ? "grid-rows-[auto_auto] lg:grid-rows-none" : ""}`}
      >
        {imageLeft && (
          <motion.div
            className={`${id === "requirements" ? "order-2 lg:order-1" : ""}`}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="shadow-xl border-0 overflow-hidden rounded-2xl bg-[#160807]">
              <CardContent className="p-0">
                <img src={imageSrc} alt={imageAlt} className={cn("w-full object-fill opacity-90", imageSizing)} />
              </CardContent>
            </Card>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className={`${id === "requirements" ? "order-1 lg:order-2" : ""} space-y-5`}
        >
          {kicker && <p className="uppercase tracking-widest text-xs md:text-sm text-[#f0e783]">{kicker}</p>}
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight text-[#cc9e35]">{title}</h2>
          <div className="prose max-w-none prose-p:leading-relaxed prose-headings:mt-6 prose-headings:mb-3 prose-invert">{children}</div>
          <div className="pt-2">
            <Link to={ctaHref} className=" flex gap-1 items-center">
              <Button asChild size="lg" className="rounded-2xl bg-[#cc9e35] hover:bg-[#f0e783] text-[#160807]">
                <a href={ctaHref} aria-label={`${title} – Sign up`}>
                  Sign up
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </Link>
          </div>
        </motion.div>

        {!imageLeft && (
          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <Card className="shadow-xl border-0 overflow-hidden rounded-2xl bg-[#160807]">
              <CardContent className="p-0">
                <img src={imageSrc} alt={imageAlt} className={cn("w-full object-fill opacity-90", imageSizing)} />
                {/* <img src={imageSrc} alt={imageAlt} className="w-full h-[260px] md:h-[360px] object-cover opacity-90" /> */}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  </section>
);

const G20Landing: React.FC<G20LandingProps> = () => {
  const signupHref = "/g20-registration";

  return (
    <main className="font-sans bg-[#1E1E1E] text-[#FAF5EC] pt-12">
      <div>
        <img src={Logo} alt="Logo" width="180" height="180" className="mx-auto" />
      </div>

      {/* About */}
      <Section
        id="about"
        title="About G20"
        kicker="Who we are"
        imageSrc={images?.about}
        imageAlt="About G20"
        ctaHref={signupHref}
        imageSizing={"h-[240px] md:h-[360px] lg:h-[480px]"}
        imageLeft
      >
        <p>
          The G20 is a select group of men and women committed to standing with <strong>Dr Isaiah Macwealth</strong> in fulfilling the divine mandate of taking
          the Gospel to all nations.
        </p>
        <KJVQuote
          verse="These also are the chief of the mighty men whom David had, who strengthened themselves with him in his kingdom, with all Israel, to make him king, according to the word of the LORD concerning Israel."
          refText="1 Chronicles 11:10"
        />
        <KJVQuote
          verse="These be the names of the mighty men whom David had: ... Adino the Eznite; he lifted up his spear against eight hundred, whom he slew at one time."
          refText="2 Samuel 23:8-22"
        />
        <KJVQuote
          verse="When the even was come, there came a rich man of Arimathaea, named Joseph, who also himself was Jesus’ disciple."
          refText="Matthew 27:57"
        />
        <KJVQuote verse="There came also Nicodemus ... and brought a mixture of myrrh and aloes, about an hundred pound weight." refText="John 19:39" />
        <p>
          In this generation, the G20 represents a new company of giants — men and women who are strong and discerning; recognising their God-given advantage
          and are strategically positioned to advance the cause of the Gospel.
        </p>
      </Section>

      {/* Categories */}
      <Section
        id="categories"
        title="Partnership Categories"
        kicker="Yearly commitment levels"
        imageSrc={images?.categories}
        imageAlt="G20 partnership categories"
        ctaHref={signupHref}
        imageSizing={"h-[420px] lg:h-[680px]"}
      >
        <p>As you grow in financial capacity, you are encouraged to step up to higher levels of partnership within the House of Greats (HOG) Parliament.</p>
        <ul className="mt-6 space-y-3">
          {categories.map((c) => (
            <li key={c.title} className="flex items-start gap-3">
              <CheckCircle className="mt-1 h-5 w-5 flex-none text-[#f0e783]" />
              <div>
                <div className="font-medium text-[#cc9e35] pb-2">{c.title}</div>
                <div className="text-sm text-[#FAF5EC]">{c.amount}</div>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-[#f0e783]">
          Top 20 G20 partners by yearly amount will serve as executives of the House of Greats (HOG) Parliament for the upcoming year.
        </p>
      </Section>

      {/* Requirements */}
      <Section
        id="requirements"
        title="Membership Requirements"
        kicker="Who should join"
        imageSrc={images?.requirements}
        imageAlt="G20 membership requirements"
        ctaHref={signupHref}
        imageLeft
        imageSizing={"h-[480px] lg:h-[480px] object-contain"}
      >
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mt-2">
          {requirements.map((r) => (
            <RequirementItem key={r} text={r} />
          ))}
        </ul>
      </Section>

      {/* <div id="signup" className="py-12 bg-[#160807]" /> */}
      <Footer />
    </main>
  );
};

export default G20Landing;
