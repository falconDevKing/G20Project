import { Sheet, SheetContent } from "@/components/ui/sheet";

import { Dispatch, SetStateAction } from "react";
import { PartnerRowType, PaymentRowType } from "@/supabase/modifiedSupabaseTypes";

import dayjs from "dayjs";
import { findChapterDetails, findDivisionDetails } from "@/services/payment";
import { CapitaliseWords } from "@/lib/textUtils";
import { useAppSelector } from "@/redux/hooks";

interface PartnerDetailsType {
  open: boolean;
  order: string[];
  setOpen: Dispatch<SetStateAction<boolean>>;
  details: Partial<PaymentRowType> | Partial<PartnerRowType>;
}

const titleise = (key: string) =>
  key
    .replace(/(_id|_|-)/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (s) => s.toUpperCase());

const DefaultNA = <span className="text-muted-foreground">---</span>;

const formatValue = (value: any, key: string, showAmount?: boolean): React.ReactNode => {
  const dateFormat = key === "birth_day_mmdd" ? "DD-MMM" : key === "date_of_birth" ? "MMM DD" : key === "remission_period" ? "MMM YYYY" : "MMM DD, YYYY";
  const transformNationality = (nationality: string) => (nationality === "NG" ? "Nigerian" : "International");
  const valueToUse =
    key === "chapter_id"
      ? findChapterDetails(value).chapterName
      : key === "division_id"
        ? findDivisionDetails(value).divisionName
        : key === "nationality"
          ? transformNationality(value)
          : value;

  if (key === "g20_amount") {
    return showAmount ? valueToUse : "---";
  }
  if (valueToUse === null || valueToUse === undefined || valueToUse === "") return DefaultNA;
  if (valueToUse instanceof Date || key.includes("date")) return dayjs(valueToUse).format(dateFormat);
  if (typeof valueToUse === "boolean") return valueToUse ? "Yes" : "No";
  if (Array.isArray(valueToUse)) return valueToUse.length ? valueToUse.join(", ") : DefaultNA;
  if (typeof valueToUse === "object") {
    // Fallback for nested objects
    return <pre className="text-xs bg-muted rounded p-2 overflow-x-auto">{JSON.stringify(valueToUse, null, 2)}</pre>;
  }
  return CapitaliseWords(String(valueToUse));
};

export const PartnerPaymentDetails = ({ open, setOpen, details, order }: PartnerDetailsType) => {
  const user = useAppSelector((state) => state.auth.userDetails);
  const pstPermission = String(user.permission_type || "").toLowerCase();
  const opsPermission = String(user.ops_permission_type || "").toLowerCase();
  const showAmount = pstPermission === "organisation" || opsPermission === "shepherd";

  //  <SheetTrigger asChild>
  //   {/* <img src={"/hamburger.svg"} className="cursor-pointer " width={35} height={35} alt="hamburger" /> */}
  //   <Eye size={24} className=" text-[#1E1E1E] max-md:dark:text-[#1E1E1E] dark:text-white" />
  // </SheetTrigger>

  const keys = order?.length ? order.filter((k) => k in details) : Object.keys(details);
  // Object.keys(details).filter((key) => order.includes(key));
  type keysType = keyof typeof details;

  const detailsData = keys.map((k) => [k, details[k as keysType] || ""]); // .filter((k) => !hiddenKeys.includes(k))

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="border-none dark:bg-[#1E1E1E] w-full md:w-[50%] lg:w-[40%] dark:text-GGP-dark py-8">
        <div className="overflow-auto pt-8">
          <div className={`grid grid-cols-2 gap-4`}>
            {detailsData.map(([key, value]) => {
              const label = titleise(key);
              const rendered = formatValue(value, key, showAmount);

              return (
                <div
                  key={key}
                  className={`rounded-lg border dark:border-gray-500 p-2 ${["address", "description", "motivation"].includes(key) ? "col-span-2" : ""}`}
                >
                  <div className="text-xs  font-bold   text-GGP-darkGold ">{label}</div>
                  <div className="mt-1 break-words dark:text-white">{rendered}</div>
                </div>
              );
            })}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
