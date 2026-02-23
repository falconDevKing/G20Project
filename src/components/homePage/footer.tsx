type ContactCard = { title: string; lines: string[]; hrefs?: { label: string; href: string }[] };

const contacts: ContactCard[] = [
  {
    title: "Contact",
    lines: ["info@globalgospelpartnership.org"],
    hrefs: [{ label: "Email", href: "mailto:info@globalgospelpartnership.org" }],
  },
  {
    title: "Address",
    lines: ["Capital House, 47 Rushey Green, London, SE6 4AS"],
  },
  {
    title: "Phone",
    lines: [], //["+44 7840 303 710", "+44 7727 683 097"],
    hrefs: [
      { label: "Call +44 7840 303 710", href: "tel:+447840303710" },
      { label: "Call +44 7727 683 097", href: "tel:+447727683097" },
    ],
  },
];

const Footer = () => {
  return (
    <div>
      {" "}
      {/* FOOTER CONTACT (matches your simple black footer) */}
      <footer id="contact" className="border-t border-white/10 bg-black px-24">
        <div className="mx-auto  px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            {contacts.map((c) => (
              <div key={c.title}>
                <p className="text-lg font-semibold text-white">{c.title}</p>
                <div className="mt-4 space-y-2 text-sm text-white/70">
                  {c?.lines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>

                {c.hrefs?.length ? (
                  <div className="flex flex-col mt-4 space-y-2">
                    {c.hrefs.map((h) => (
                      <a key={h.href} href={h.href} className="inline-flex text-sm font-semibold text-gold-300 hover:text-gold-200">
                        {h.label}
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>

          <div className="mt-12 border-t border-white/10 pt-8 text-center text-sm text-white/50">© {new Date().getFullYear()}. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
