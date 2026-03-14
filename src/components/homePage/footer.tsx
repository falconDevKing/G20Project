import { useAppSelector } from "@/redux/hooks";

type ContactCard = { title: string; lines: string[]; hrefs?: { label: string; href: string }[] };

const locationPhoneNumber: Record<string, string> = {
  NGN: "+234 906 671 0879",
  CAD: "+1 647-803-5088",
  USD: "+1 469-597-6952",
  GBP: "+44 7840 303 710, +44 7727 683 097",
  GHS: "+233 500 599002",
  ZAR: "+27 747 784040",
  EUR: "+44 7840 303 710, +44 7727 683 097",
  USDAF: "+1 469-597-6952",
};

const Footer = () => {
  const { locationCurrency, fallbackCurrency } = useAppSelector((state) => state?.app);
  const contacts: ContactCard[] = [
    {
      title: "Contact",
      lines: ["info@globalgospelpartnership.org"],
      hrefs: [{ label: "Email", href: "mailto:info@globalgospelpartnership.org" }],
    },
    {
      title: "Address",
      lines: ["Partnership Office,", "The Ark of Light for all Nations.", "Plot 11 Kudirat Abiola Way, Alausa, Ikeja, Lagos, Nigeria"],
    },
    {
      title: "Phone",
      lines: [],
      hrefs: (locationPhoneNumber[locationCurrency] || locationPhoneNumber[fallbackCurrency])
        .split(", ")
        .map((phone) => ({ label: `Call ${phone}`, href: `tel:${phone}` })),
    },
  ];

  return (
    <footer id="contact" className="border-t border-[#29334a] bg-[#0f1728] px-4 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl py-12 sm:py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {contacts.map((c) => (
            <div key={c.title} className="rounded-2xl border border-[#2e3a55] bg-[#111c31] p-5">
              <p className="text-lg font-semibold text-[#f8f1e3]">{c.title}</p>
              <div className="mt-4 space-y-2 text-sm text-[#c8d5ef]">
                {c.lines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>

              {c.hrefs?.length ? (
                <div className="mt-4 flex flex-col space-y-2">
                  {c.hrefs.map((h) => (
                    <a key={h.href} href={h.href} className="inline-flex text-sm font-semibold text-[#f0cf86] hover:text-[#f7deaa]">
                      {h.label}
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-[#29334a] pt-8 text-center text-sm text-[#9eb0d2]">
          {String.fromCharCode(169)} {new Date().getFullYear()}. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
