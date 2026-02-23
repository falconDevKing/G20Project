import React, { useEffect, useState } from "react";
import { CheckCircle2, Copy, Mail, Phone, Building2, Building, Quote, BookmarkCheck, Banknote } from "lucide-react";
import { G20PartnerRowType } from "@/supabase/modifiedSupabaseTypes";
import { useParams } from "react-router-dom";

import Logo from "../../assets/G20_logo.png";
import { ContainerFluid } from "@/components/containerFluid";
import { cn } from "@/lib/utils";
import { findDivisionDetails } from "@/services/payment";
import { fetchG20User } from "@/services/auth";
import { CapitaliseText } from "@/lib/textUtils";
import { useAppSelector } from "@/redux/hooks";
import { numberWithCurrencyFormatter } from "@/lib/numberUtils";

const InfoRow = ({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) => {
  return (
    <div className="rounded-2xl border p-4 text-black">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <div className="mt-1 flex items-center gap-2">
        {icon}
        <p className="font-medium break-words">{label === "Amount" ? numberWithCurrencyFormatter("NGN", +value) : value}</p>
      </div>
    </div>
  );
};

const InfoBadge = ({ label, value }: { label: string; value: boolean }) => {
  return (
    <div className="rounded-2xl border p-4">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <div className="mt-1">
        <span
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium",
            value ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700",
          )}
        >
          <span className={cn("h-2 w-2 rounded-full", value ? "bg-emerald-600" : "bg-red-400")} />
          {value ? "No" : "Yes"}
        </span>
      </div>
    </div>
  );
};

const G20User = () => {
  const { id } = useParams<{ id: string }>();
  const appStateLoading = useAppSelector((state) => state.app.loading);

  const [loading, setLoading] = useState(false);
  const [partner, setPartner] = useState<G20PartnerRowType | null>(null);

  const onCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // no-op
    }
  };

  useEffect(() => {
    const getUserCall = async (id: string) => {
      setLoading(true);
      const partnerData = await fetchG20User(id);
      setPartner(partnerData);
      setLoading(false);
    };

    if (id) {
      getUserCall(id);
    }
  }, [id, appStateLoading]);

  return (
    <div className="p-12 text-white">
      <ContainerFluid>
        <div className="py-4">
          <img src={Logo} alt="Logo" width="100" height="100" className="mx-auto" />
        </div>

        {/* Verified card */}
        {partner && !loading && (
          <section className="mx-auto max-w-3xl print:max-w-full">
            <div className="rounded-3xl border bg-white p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-emerald-100 flex items-center justify-center">
                    <CheckCircle2 className="h-7 w-7 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Partner status</p>
                    <h2 className="text-xl font-semibold text-emerald-700">Verified</h2>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-black">
                  <span className="font-mono text-xs sm:text-sm rounded-lg bg-emerald-100 px-2 py-1">{partner.unique_code}</span>
                  <button
                    onClick={() => onCopy(partner.unique_code || "")}
                    className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm hover:bg-slate-50"
                  >
                    <Copy className="h-4 w-4" /> Copy code
                  </button>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoRow label="Name" value={`${partner.first_name || ""} ${partner.last_name || ""}`} />
                <InfoRow label="Email" value={partner.email} icon={<Mail className="h-4 w-4" />} />
                <InfoRow label="Phone Number" value={partner.phone_number || ""} icon={<Phone className="h-4 w-4" />} />
                <InfoBadge label="Remitted" value={partner.remitted === "Yes"} />
                <InfoRow label="G20 Category" value={partner.g20_category || ""} icon={<BookmarkCheck className="h-4 w-4" />} />
                <InfoRow label="Amount" value={partner.amount || ""} icon={<Banknote className="h-4 w-4" />} />

                <InfoRow
                  label="Division"
                  value={findDivisionDetails(partner?.division_id || "")?.divisionName || ""}
                  icon={<Building2 className="h-4 w-4" />}
                />
                <InfoRow label="Chapter" value={CapitaliseText(partner?.chapter_id || "")} icon={<Building className="h-4 w-4" />} />
                <InfoBadge label="forced to remit" value={partner.forced === "No"} />
              </div>

              {partner.motivation && (
                <blockquote className="mt-6 rounded-2xl border bg-slate-50 p-4 text-slate-700">
                  <div className="flex items-start gap-2">
                    <Quote className="mt-0.5 h-4 w-4" />
                    <p className="italic">{partner.motivation}</p>
                  </div>
                </blockquote>
              )}

              <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <p>
                  Scan the QR in your welcome mail to land here with your details prefilled. Keep your code safe for partner meetings and verification at
                  events.
                </p>
              </div>
            </div>
          </section>
        )}
      </ContainerFluid>
    </div>
  );
};

export default G20User;
