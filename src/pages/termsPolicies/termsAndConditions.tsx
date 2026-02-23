import { useNavigate } from "react-router-dom";

const TermsAndConditions = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-GGP-dark text-GGP-lightWight flex justify-center px-4 py-10">
      <div className="w-full max-w-4xl bg-GGP-lightWight text-GGP-dark rounded-2xl shadow-lg border border-GGP-darkGold overflow-hidden">
        {/* Header */}
        <div className="bg-GGP-darkGold/10 border-b border-GGP-darkGold px-6 py-5">
          <h1 className="text-2xl md:text-3xl font-semibold text-GGP-dark">
            Global Gospel Partnership (GGP) App
          </h1>

          {/* Title on a new separate line */}
          <h2 className="text-lg md:text-xl text-GGP-darkGold mt-2">
            Terms and Conditions
          </h2>

          <p className="mt-2 text-sm text-GGP-dark/80">
            Last updated: <span className="font-medium">30 April 2025</span>
          </p>
        </div>

        {/* Scrollable content */}
        <div className="max-h-[75vh] overflow-y-auto px-6 py-6 space-y-8 text-sm md:text-base leading-relaxed">
          {/* Intro */}
          <section>
            <p className="mb-3">
              These Terms and Conditions (“Terms”) govern your use of the Global
              Gospel Partnership mobile application, website, and related
              digital services (“GGP App”, “Service”). By accessing or using the
              GGP App, you agree to be bound by these Terms. If you do not
              agree, you must discontinue use of the Service.
            </p>
            <p>
              The GGP App is operated by:
            </p>
            <div className="mt-2 border-l-4 border-GGP-darkGold pl-4 text-sm">
              <p className="font-semibold">Isaiah Wealth Ministry</p>
              <p>UK Charity Number: 1150241</p>
              <p>Regional House</p>
              <p>28-34 Chapel Street</p>
              <p>Luton</p>
              <p>LU1 2SE</p>
              <p className="mt-1">Email: info@globalgospelpartnership.org</p>
              <p>Website: https://www.globalgospelpartnership.org</p>
            </div>
          </section>

          {/* 1. Acceptance of Terms */}
          <section>
            <h2 className="text-lg font-semibold text-GGP-darkGold mb-2">
              1. Acceptance of Terms
            </h2>
            <p>
              By using the GGP App, you confirm that you:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Have read and understood these Terms</li>
              <li>Are at least 13 years old</li>
              <li>Are legally capable of entering into a binding agreement</li>
              <li>Agree to comply with these Terms and all applicable laws</li>
            </ul>
            <p className="mt-2">
              If you are using the App on behalf of a church, division, chapter,
              or organisation, you confirm that you have authority to do so.
            </p>
          </section>

          {/* 2. About the GGP App */}
          <section>
            <h2 className="text-lg font-semibold text-GGP-darkGold mb-2">
              2. About the GGP App
            </h2>
            <p>
              The GGP App provides tools designed to support church and partner
              management, including:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Partner registration and profile management</li>
              <li>Division and chapter management</li>
              <li>Member care and engagement tracking</li>
              <li>Payment and donation processing</li>
              <li>Recurring remittance management</li>
              <li>Attendance and participation tracking</li>
              <li>Multi-campus and multi-division administration</li>
              <li>Notifications and communications</li>
            </ul>
            <p className="mt-2">
              Features may be added, removed, or updated from time to time to
              improve the Service.
            </p>
          </section>

          {/* 3. User Accounts */}
          <section>
            <h2 className="text-lg font-semibold text-GGP-darkGold mb-2">
              3. User Accounts
            </h2>
            <h3 className="font-medium mb-1">3.1 Registration</h3>
            <p>
              To access core features, you must create an account and provide
              accurate, up-to-date information.
            </p>
            <p className="mt-2">
              You agree to:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Keep your login credentials secure and confidential</li>
              <li>Not share your account with others</li>
              <li>Promptly update your details if they change</li>
            </ul>

            <h3 className="font-medium mt-4 mb-1">3.2 Account Termination</h3>
            <p>
              We may suspend or terminate your account, or restrict access to
              parts of the Service, if:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>You violate these Terms</li>
              <li>You misuse or attempt to interfere with the App</li>
              <li>Fraudulent or suspicious activity is detected</li>
              <li>We are required to do so by law or organisational policy</li>
            </ul>
            <p className="mt-2">
              You may request account deletion at any time by contacting us.
            </p>
          </section>

          {/* 4. Payments and Donations */}
          <section>
            <h2 className="text-lg font-semibold text-GGP-darkGold mb-2">
              4. Payments and Donations
            </h2>
            <p>
              The GGP App may facilitate:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>One-off donations and remittances</li>
              <li>Recurring monthly, quarterly, or yearly remittances</li>
              <li>Multi-currency giving</li>
              <li>Payment confirmations and receipts</li>
            </ul>

            <h3 className="font-medium mt-4 mb-1">
              4.1 Payment Providers
            </h3>
            <p>
              All financial transactions are processed securely through trusted
              third party providers, including:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Stripe for global card payments</li>
              <li>Paystack for Nigerian and certain African transactions</li>
            </ul>
            <p className="mt-2">
              We do not collect or store your full card number, CVV, or other
              sensitive payment details. These are handled by the relevant
              payment processor in accordance with its own security standards
              and privacy policy.
            </p>

            <h3 className="font-medium mt-4 mb-1">4.2 Refunds</h3>
            <p>
              Donations and remittances are generally voluntary and
              non-refundable. Refunds may be considered at the discretion of
              Global Gospel Partnership in cases such as:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Duplicate or accidental payments</li>
              <li>Technical errors resulting in incorrect charges</li>
            </ul>
            <p className="mt-2">
              Refund requests should be submitted within 14 days of the
              transaction to{" "}
              <span className="font-medium">
                info@globalgospelpartnership.org
              </span>
              .
            </p>
          </section>

          {/* 5. Acceptable Use */}
          <section>
            <h2 className="text-lg font-semibold text-GGP-darkGold mb-2">
              5. Acceptable Use
            </h2>
            <p>
              You agree that you will not use the GGP App to:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Engage in unlawful or fraudulent activity</li>
              <li>Attempt to hack, disrupt, or overload the Service</li>
              <li>Impersonate another person or misrepresent your identity</li>
              <li>Upload malicious code or harmful content</li>
              <li>Bypass or attempt to bypass access controls or permissions</li>
            </ul>
          </section>

          {/* 6. Organisational Structure and Permissions */}
          <section>
            <h2 className="text-lg font-semibold text-GGP-darkGold mb-2">
              6. Organisational Structure and Permissions
            </h2>
            <p>
              The GGP App follows a structured hierarchy that may include:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Organisation</li>
              <li>Division</li>
              <li>Region (where applicable)</li>
              <li>Chapter</li>
              <li>Partner</li>
            </ul>
            <p className="mt-2">
              Access to data and administrative actions is role-based and
              permission-controlled. You agree that you will not:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Access information outside your authorised scope</li>
              <li>Modify, falsify, or manipulate engagement or payment data</li>
              <li>Misuse administrative or elevated privileges</li>
            </ul>
          </section>

          {/* 7. Communications */}
          <section>
            <h2 className="text-lg font-semibold text-GGP-darkGold mb-2">
              7. Communications
            </h2>
            <p>
              By using the GGP App, you consent to receive communications
              related to the Service, which may include:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Account and security notifications</li>
              <li>Payment confirmations and receipts</li>
              <li>Service updates and important notices</li>
              <li>
                WhatsApp or email messages where you have provided contact
                details and given consent
              </li>
            </ul>
            <p className="mt-2">
              You may manage certain communication preferences within the App or
              by contacting us.
            </p>
          </section>

          {/* 8. Content Ownership */}
          <section>
            <h2 className="text-lg font-semibold text-GGP-darkGold mb-2">
              8. Content Ownership and Intellectual Property
            </h2>
            <p>
              All intellectual property rights in and to the GGP App are owned
              by or licensed to Global Gospel Partnership. This includes:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Logos, branding, and visual identity</li>
              <li>Designs, layouts, and user interface elements</li>
              <li>Software code, database structures, and APIs</li>
              <li>Text, graphics, and other materials supplied by GGP</li>
            </ul>
            <p className="mt-2">
              You may not copy, modify, adapt, distribute, sell, or reverse
              engineer any part of the GGP App without prior written
              permission.
            </p>
          </section>

          {/* 9. User Generated Content */}
          <section>
            <h2 className="text-lg font-semibold text-GGP-darkGold mb-2">
              9. User Generated Content
            </h2>
            <p>
              Certain features may allow you to submit content such as profile
              data, comments, notes, or chapter updates. You remain responsible
              for this content and confirm that:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>The content is accurate and lawful</li>
              <li>
                You have the right to provide it and it does not infringe the
                rights of others
              </li>
              <li>
                It is respectful and appropriate in a church and community
                context
              </li>
            </ul>
            <p className="mt-2">
              By submitting content, you grant Global Gospel Partnership a
              licence to use, store, display, and process that content for the
              purposes of operating and improving the Service.
            </p>
          </section>

          {/* 10. Privacy */}
          <section>
            <h2 className="text-lg font-semibold text-GGP-darkGold mb-2">
              10. Privacy and Data Protection
            </h2>
            <p>
              Your use of the GGP App is also governed by our Privacy Policy,
              which explains how we collect, use, share, and protect your
              personal data, as well as your rights under UK GDPR and other
              applicable laws.
            </p>
            <p className="mt-2">
              The Privacy Policy is incorporated by reference into these Terms.
              By agreeing to these Terms, you also agree to the Privacy Policy.
            </p>
          </section>

          {/* 11. Service Availability */}
          <section>
            <h2 className="text-lg font-semibold text-GGP-darkGold mb-2">
              11. Service Availability
            </h2>
            <p>
              We aim to keep the GGP App available and functioning reliably.
              However, we do not guarantee that the Service will be:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Free from interruptions or downtime</li>
              <li>Free from errors or defects</li>
              <li>
                Always accurate, particularly where data is entered or managed
                by multiple users
              </li>
            </ul>
            <p className="mt-2">
              We may temporarily suspend or limit access to the Service for
              maintenance, upgrades, security reasons, or operational needs.
            </p>
          </section>

          {/* 12. Limitation of Liability */}
          <section>
            <h2 className="text-lg font-semibold text-GGP-darkGold mb-2">
              12. Limitation of Liability
            </h2>
            <p>
              To the fullest extent permitted by law, Global Gospel Partnership
              shall not be liable for:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Indirect, incidental, or consequential losses</li>
              <li>Loss of data, income, goodwill, or business opportunities</li>
              <li>
                Any loss arising from the actions or failures of third party
                providers, including payment processors and hosting services
              </li>
            </ul>
            <p className="mt-2">
              Nothing in these Terms excludes or limits liability for fraud,
              death, or personal injury caused by negligence, or any liability
              which cannot be excluded under applicable law.
            </p>
          </section>

          {/* 13. Indemnity */}
          <section>
            <h2 className="text-lg font-semibold text-GGP-darkGold mb-2">
              13. Indemnity
            </h2>
            <p>
              You agree to indemnify and hold Global Gospel Partnership and its
              officers, staff, and volunteers harmless from any claims, damages,
              or losses arising from:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Your misuse of the GGP App</li>
              <li>Your breach of these Terms</li>
              <li>
                Any unauthorised access to the Service using your account or
                credentials
              </li>
            </ul>
          </section>

          {/* 14. Changes to the Terms */}
          <section>
            <h2 className="text-lg font-semibold text-GGP-darkGold mb-2">
              14. Changes to the Terms
            </h2>
            <p>
              We may update these Terms from time to time. When changes are
              made, we will revise the “Last updated” date at the top of this
              document and may provide additional notice within the App where
              appropriate.
            </p>
            <p className="mt-2">
              Your continued use of the GGP App following any update constitutes
              your acceptance of the revised Terms.
            </p>
          </section>

          {/* 15. Governing Law */}
          <section>
            <h2 className="text-lg font-semibold text-GGP-darkGold mb-2">
              15. Governing Law
            </h2>
            <p>
              These Terms are governed by the laws of the United Kingdom, without
              regard to conflict of law principles. Where you are based in
              another jurisdiction, applicable local laws may also apply to
              certain consumer rights.
            </p>
            <p className="mt-2">
              Any disputes arising out of or relating to these Terms or your use
              of the GGP App shall be subject to the jurisdiction of the
              appropriate courts of the United Kingdom.
            </p>
          </section>

          {/* 16. Contact */}
          <section>
            <h2 className="text-lg font-semibold text-GGP-darkGold mb-2">
              16. Contact Us
            </h2>
            <p>
              If you have any questions or concerns about these Terms, you can
              contact us at:
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

        {/* Footer actions (optional) */}
        <div className="border-t border-GGP-darkGold/40 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-3 bg-GGP-darkGold/5">
          <p className="text-xs text-GGP-dark/80">
            By continuing to use the GGP App you confirm that you agree to these
            Terms and Conditions.
          </p>
          {/* You can wire this button to close a modal or scroll */}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="px-4 py-2 text-xs md:text-sm rounded-full bg-GGP-darkGold text-GGP-dark font-medium hover:bg-GGP-lightGold transition"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );;
};

export default TermsAndConditions;
