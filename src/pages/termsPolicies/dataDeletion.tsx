import React from "react";
import { useNavigate } from "react-router-dom";

const DataDeletion: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-GGP-dark text-GGP-lightWight flex justify-center px-4 py-10">
      <div className="w-full max-w-3xl bg-GGP-lightWight text-GGP-dark rounded-2xl shadow-lg border border-GGP-darkGold overflow-hidden">
        {/* Header */}
        <div className="bg-GGP-darkGold/10 border-b border-GGP-darkGold px-6 py-5">
          <h1 className="text-2xl md:text-3xl font-semibold text-GGP-dark">Global Gospel Partnership (GGP) App</h1>
          <h2 className="text-lg md:text-xl text-GGP-darkGold mt-2">User Data Deletion</h2>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-4 text-sm md:text-base leading-relaxed max-h-[70vh] overflow-y-auto">
          <p>
            In line with data protection requirements and platform policies, Global Gospel Partnership (GGP) provides a clear way for you to request deletion of
            your personal data from the GGP App.
          </p>

          <h3 className="text-md font-semibold text-GGP-darkGold">How to request deletion of your data</h3>
          <div>
            You can request deletion of your data by sending an email to <span className="font-medium">info@g20partnership.org</span> with the subject line{" "}
            <span className="italic font-medium">“Data Deletion Request”</span> and include:
            <ul className="list-disc list-inside mt-1 ml-4 space-y-1">
              <li>Your full name</li>
              <li>The email address linked to your GGP account</li>
              <li>Your partner code (if available)</li>
            </ul>
          </div>

          {/* <ul className="list-decimal list-inside mt-2 space-y-1">
            {/* <li>
              <span className="font-medium">In-app (where available):</span>
              Go to your profile or account settings and select the option to
              delete or close your account. Follow the instructions shown.
            </li> 
          <li>
            <span className="font-medium">By email:</span>
            Send an email to{" "}
            <span className="font-medium">info@g20partnership.org</span>{" "}
            with the subject line{" "}
            <span className="italic">“Data Deletion Request”</span> and include:
            <ul className="list-disc list-inside mt-1 ml-4 space-y-1">
              <li>Your full name</li>
              <li>The email address linked to your GGP account</li>
              <li>
                Your partner code (if available)
              </li>
            </ul>
          </li>
        </ul> */}

          <h3 className="text-md font-semibold text-GGP-darkGold mt-4">What happens when you request deletion?</h3>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>We will verify your identity using the information you provide.</li>
            <li>Your GGP account will be scheduled for deletion and removed from active use.</li>
            <li>
              Personal data associated with your account will be deleted or anonymised, except for information we are required to retain for legal, accounting,
              or regulatory reasons (for example, certain financial records).
            </li>
            <li>We will confirm by email once your request has been processed.</li>
          </ul>

          <p className="mt-4 text-sm">
            If you have any questions about how we handle your data, please see our <span className="font-medium">Privacy Policy</span> or contact us at{" "}
            <span className="font-medium">info@g20partnership.org</span>.
          </p>
        </div>

        {/* Footer */}
        <div className="border-t border-GGP-darkGold/40 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-3 bg-GGP-darkGold/5">
          <p className="text-xs text-GGP-dark/80">Global Gospel Partnership (GGP)</p>
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

export default DataDeletion;
