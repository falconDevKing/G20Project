import { useNavigate } from "react-router-dom";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-GGP-dark text-GGP-lightWight flex justify-center px-4 py-10">
      <div className="w-full max-w-4xl bg-GGP-lightWight text-GGP-dark rounded-2xl shadow-lg border border-GGP-darkGold overflow-hidden">
        {/* Header */}
        <div className="bg-GGP-darkGold/10 border-b border-GGP-darkGold px-6 py-5">
          <h1 className="text-2xl md:text-3xl font-semibold text-GGP-dark">
            Global Gospel Partnership (GGP) App
          </h1>

          <h2 className="text-lg md:text-xl text-GGP-darkGold mt-2">
            Privacy Policy
          </h2>

          <p className="mt-2 text-sm text-GGP-dark/80">
            Last updated: <span className="font-medium">30 April 2025</span>
          </p>
        </div>

        {/* Content */}
        <div className="max-h-[75vh] overflow-y-auto px-6 py-6 space-y-8 text-sm md:text-base leading-relaxed">
          {/* Intro */}
          <section>
            <p className="mb-3">
              This Privacy Policy explains how Global Gospel Partnership
              (“GGP”, “we”, “us”, or “our”) collects, uses, stores, and shares
              your information when you use the Global Gospel Partnership mobile
              application, website, and related digital services (together, the
              “GGP App”).
            </p>
            <p className="mb-3">
              By using the GGP App, you agree to the practices described in this
              Privacy Policy. If you do not agree, you should stop using the
              Service.
            </p>

            {/* <div className="mt-3 border-l-4 border-GGP-darkGold pl-4 text-sm">
              <p className="font-semibold">Global Gospel Partnership (GGP)</p>
              <p>UK Charity Number: 1150241</p>
              <p>Regional House</p>
              <p>28-34 Chapel Street</p>
              <p>Luton</p>
              <p>LU1 2SE</p>
              <p className="mt-1">Email: info@globalgospelpartnership.org</p>
              <p>Website: https://www.globalgospelpartnership.org</p>
            </div> */}
          </section>

          {/* 1. Information We Collect */}
          <section>
            <h2 className="text-lg font-semibold text-GGP-darkGold mb-2">
              1. Information We Collect
            </h2>
            <p>We collect the following categories of information:</p>

            <h3 className="font-medium mt-3 mb-1">1.1 Personal Information</h3>
            <p>
              Information you provide when you register or update your profile,
              such as:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Full name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Date of birth</li>
              <li>Country, city, or region</li>
              <li>Password or authentication data</li>
              <li>Partner code or membership identifiers</li>
            </ul>

            <h3 className="font-medium mt-3 mb-1">
              1.2 Partnership and Organisational Information
            </h3>
            <p>
              Information relating to your connection with GGP, such as:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Division, region, and chapter details</li>
              <li>Role or leadership assignments</li>
              <li>Engagement, attendance, and participation records</li>
            </ul>

            <h3 className="font-medium mt-3 mb-1">1.3 Financial Information</h3>
            <p>
              When you give or remit through the GGP App, we collect information
              about:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Donation or remittance amounts</li>
              <li>Payment history and currency</li>
              <li>Recurring payment preferences</li>
              <li>Payment reference or transaction IDs</li>
            </ul>
            <p className="mt-2">
              We do not store your full card number, CVV, or bank account
              credentials. These are processed by our payment providers.
            </p>

            <h3 className="font-medium mt-3 mb-1">
              1.4 Technical and Usage Information
            </h3>
            <p>When you use the GGP App, we may automatically collect:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>IP address and approximate location</li>
              <li>Device type, operating system, and browser</li>
              <li>App version and usage logs</li>
              <li>Pages or screens visited and actions taken</li>
              <li>Error reports and diagnostic information</li>
            </ul>

            <h3 className="font-medium mt-3 mb-1">
              1.5 Communication Information
            </h3>
            <p>We may also collect information about:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Emails and messages you send to us</li>
              <li>WhatsApp or SMS communications (where used)</li>
              <li>Your notification and communication preferences</li>
            </ul>
          </section>

          {/* 2. How We Use Your Information */}
          <section>
            <h2 className="text-lg font-semibold text-GGP-darkGold mb-2">
              2. How We Use Your Information
            </h2>
            <p>We use your information for the following purposes:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>To create and manage your GGP account</li>
              <li>To place you in the correct division, region, and chapter</li>
              <li>
                To process donations, remittances, and recurring payments and
                generate receipts
              </li>
              <li>
                To track engagement, attendance, and participation where
                applicable
              </li>
              <li>
                To send confirmations, reminders, updates, and service
                notifications
              </li>
              <li>
                To support church administration and partner care across GGP
                structures
              </li>
              <li>
                To maintain the security of the Service and detect or prevent
                fraud
              </li>
              <li>
                To analyse usage and improve the performance and experience of
                the GGP App
              </li>
              <li>
                To comply with legal, financial, and regulatory obligations
              </li>
            </ul>
          </section>

          {/* 3. Legal Basis */}
          <section>
            <h2 className="text-lg font-semibold text-GGP-darkGold mb-2">
              3. Legal Basis for Processing (UK GDPR)
            </h2>
            <p>We process your personal data under one or more of the following bases:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>
                <span className="font-medium">Consent:</span> where you give
                clear consent for a specific purpose, such as receiving
                WhatsApp messages.
              </li>
              <li>
                <span className="font-medium">Contract:</span> where processing
                is necessary to provide the GGP App and related services you
                have requested.
              </li>
              <li>
                <span className="font-medium">Legitimate Interests:</span> for
                internal administration, security, analytics, and improving the
                Service, where these interests are not overridden by your
                rights.
              </li>
              <li>
                <span className="font-medium">Legal Obligation:</span> where we
                must retain certain financial or transactional records to comply
                with applicable laws.
              </li>
            </ul>
          </section>

          {/* 4. Sharing Information */}
          <section>
            <h2 className="text-lg font-semibold text-GGP-darkGold mb-2">
              4. How We Share Your Information
            </h2>
            <p>
              We do not sell your personal data. We may share your information
              with:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>
                <span className="font-medium">Authorised GGP personnel:</span>{" "}
                leaders and admins with appropriate permissions in your division
                or chapter, for partner care and administration.
              </li>
              <li>
                <span className="font-medium">Service providers:</span> such as
                hosting providers, email services, analytics tools, and other
                technical partners used to operate the GGP App.
              </li>
              <li>
                <span className="font-medium">Payment processors:</span> Stripe
                and Paystack, which handle card and bank payments in line with
                their own security and privacy standards.
              </li>
              <li>
                <span className="font-medium">Legal and regulatory bodies:</span>{" "}
                where we are required to do so by law, regulation, court order,
                or to protect our rights or the rights of others.
              </li>
            </ul>
          </section>

          {/* 5. Payment Processors */}
          <section>
            <h2 className="text-lg font-semibold text-GGP-darkGold mb-2">
              5. Payment Processors
            </h2>
            <p>
              When you give or remit through the GGP App, your payment is
              processed by trusted third party providers:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Stripe for global card payments</li>
              <li>Paystack for Nigerian and certain African transactions</li>
            </ul>
            <p className="mt-2">
              These providers receive the information necessary to process your
              payment, such as card details or bank information. They do not
              share your full card number or CVV with us. Your use of their
              services is also governed by their own terms and privacy policies.
            </p>
          </section>

          {/* 6. International Transfers */}
          <section>
            <h2 className="text-lg font-semibold text-GGP-darkGold mb-2">
              6. International Data Transfers
            </h2>
            <p>
              Your information may be transferred to and stored on servers
              located outside the United Kingdom or the country where you are
              based, for example where we use international cloud or payment
              providers.
            </p>
            <p className="mt-2">
              Where data is transferred outside the UK or European Economic
              Area, we take steps to ensure that appropriate safeguards are in
              place, such as Standard Contractual Clauses or equivalent legal
              protections.
            </p>
          </section>

          {/* 7. Security */}
          <section>
            <h2 className="text-lg font-semibold text-GGP-darkGold mb-2">
              7. Data Security
            </h2>
            <p>
              We use a range of technical and organisational measures to protect
              your information, including:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Encryption in transit where appropriate</li>
              <li>Role-based access controls and permissions</li>
              <li>Secure hosting with reputable cloud providers</li>
              <li>Authentication and logging for administrative access</li>
            </ul>
            <p className="mt-2">
              However, no method of transmission or storage is completely
              secure. We cannot guarantee absolute security, but we work to
              reduce risk as far as reasonably possible.
            </p>
          </section>

          {/* 8. Retention */}
          <section>
            <h2 className="text-lg font-semibold text-GGP-darkGold mb-2">
              8. Data Retention
            </h2>
            <p>
              We retain your information only for as long as necessary for the
              purposes set out in this Policy, including:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Maintaining your account and partner history</li>
              <li>Providing reports and records for church administration</li>
              <li>Complying with legal, tax, and accounting obligations</li>
              <li>Handling disputes or resolving issues</li>
            </ul>
            <p className="mt-2">
              Where information is no longer needed, we will delete or anonymise
              it in line with our retention practices.
            </p>
          </section>

          {/* 9. Your Rights */}
          <section>
            <h2 className="text-lg font-semibold text-GGP-darkGold mb-2">
              9. Your Rights
            </h2>
            <p>
              Under UK data protection law and other applicable regulations, you
              may have the right to:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Request access to the personal data we hold about you</li>
              <li>Request correction of inaccurate or incomplete data</li>
              <li>Request deletion of your data in certain circumstances</li>
              <li>Object to or request restriction of certain processing</li>
              <li>
                Withdraw consent where processing is based on your consent
              </li>
              <li>Request a copy of your data in a portable format</li>
            </ul>
            <p className="mt-2">
              To exercise any of these rights, please contact us using the
              details in the “Contact Us” section below. We may need to verify
              your identity before completing your request.
            </p>
          </section>

          {/* 10. Children */}
          <section>
            <h2 className="text-lg font-semibold text-GGP-darkGold mb-2">
              10. Children’s Privacy
            </h2>
            <p>
              The GGP App is not intended for children under the age of 13. We
              do not knowingly collect personal data from children under this
              age. If you believe a child has provided us with personal
              information, please contact us so that we can remove it.
            </p>
          </section>

          {/* 11. Third Party Links */}
          <section>
            <h2 className="text-lg font-semibold text-GGP-darkGold mb-2">
              11. Third Party Links and Services
            </h2>
            <p>
              The GGP App may contain links to third party websites or services.
              We are not responsible for the privacy practices or content of
              those third parties. You should review their privacy policies
              separately.
            </p>
          </section>

          {/* 12. Changes */}
          <section>
            <h2 className="text-lg font-semibold text-GGP-darkGold mb-2">
              12. Changes to This Privacy Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. When we make
              changes, we will revise the “Last updated” date at the top of this
              page and may provide additional notice within the App where
              appropriate.
            </p>
            <p className="mt-2">
              Your continued use of the GGP App after any changes are made
              constitutes your acceptance of the updated Privacy Policy.
            </p>
          </section>

          {/* 13. Contact */}
          <section>
            <h2 className="text-lg font-semibold text-GGP-darkGold mb-2">
              13. Contact Us
            </h2>
            <p>
              If you have any questions, concerns, or requests relating to this
              Privacy Policy or how we handle your data, you can contact us at:
            </p>
            <div className="mt-2 border-l-4 border-GGP-darkGold pl-4 text-sm">
              <p className="font-semibold">Global Gospel Partnership (GGP)</p>
              <p>Capital House</p>
              <p>47 Rushey Green</p>
              <p>London</p>
              <p>SE6 4AS</p>
              <p className="mt-1">Email: info@globalgospelpartnership.org</p>
              <p>Website: https://www.globalgospelpartnership.org</p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="border-t border-GGP-darkGold/40 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-3 bg-GGP-darkGold/5">
          <p className="text-xs text-GGP-dark/80">
            By continuing to use the GGP App you acknowledge that you have read and understood this Privacy Policy.
          </p>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="px-4 py-2 text-xs md:text-sm rounded-full bg-GGP-darkGold text-GGP-dark font-medium hover:bg-GGP-lightGold transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
