import { numberWithCurrencyFormatter } from "@/lib/numberUtils";
import { findChapterDetails, findDivisionDetails } from "@/services/payment";
import dayjs from "dayjs";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DummyObject, getInitialsFromFullName } from "@/interfaces/tools";
import { Copy as CopyIcon } from "lucide-react";
import CopyAction from "copy-to-clipboard";
import { SuccessHandler } from "@/lib/toastHandlers";
import { CapitaliseText } from "@/lib/textUtils";
import { CurrencyCode, GGPCategories } from "@/constants";
import { getG20CategoryAmount, getG20CategoryLabel } from "@/lib/g20Categories";
import { getProposedDisplayStatus } from "@/services/g20Dashboard";

interface MobileTableCardProps {
  row: Record<string, any>;
  tableType: string;
  clickHandler?: () => void;
  openMigrateDialog?: (userData: Record<string, any>) => void;
  openUpdateDialog?: (userData: Record<string, any>) => void;
}

const MobileTableCard = ({ row, tableType, openMigrateDialog, openUpdateDialog, clickHandler }: MobileTableCardProps) => {
  const {
    name,
    ggp_category,
    division_id,
    chapter_id,
    status,
    date_of_birth,
    payment_date,
    remission_period,
    currency,
    amount,
    user_name,
    approved_by,
    id,
    reps,
    unique_code,
    g20_category,
    remitted,
    forced,
    phone_number,
  } = row.original;

  const { currency: chapterCurrency } = findChapterDetails(chapter_id);
  const partnershipDetails = GGPCategories[chapterCurrency as CurrencyCode] || GGPCategories["USD"];
  const categories = Object.values(partnershipDetails).flat();
  const categoryRange = categories.find((cat) => cat.rank === ggp_category)?.amount;
  const g20CategoryLabel = getG20CategoryLabel(g20_category, { chapterId: chapter_id });
  const g20CategoryAmount = getG20CategoryAmount(g20_category, { chapterId: chapter_id });
  const proposedStatus =
    tableType === "proposedSchedule"
      ? getProposedDisplayStatus({
          status: row.original.status,
          proposed_date: row.original.proposed_date,
        })
      : "";

  return (
    <div className="md:hidden" onClick={clickHandler}>
      {tableType === "entity" ? (
        <div>
          <div className="border rounded-lg p-2 shadow-md m-1 min-w-[300px]">
            <div className="flex justify-between items-end p-0.5">
              <div className="text-sm font-bold">{name}</div>
            </div>

            <div className="flex justify-between items-end p-0.5 capitalize">
              <div className="text-sm">{findDivisionDetails(division_id || "")?.divisionName}</div>
              <div className="text-sm">{findChapterDetails(id || "")?.currency}</div>
            </div>
            <div className="flex flex-wrap items-end p-0.5 py-1 gap-1">
              {(reps as DummyObject[])?.map((rep) => (
                <TooltipProvider key={rep.name}>
                  <Tooltip>
                    <TooltipTrigger>
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarFallback className="rounded-lg">{getInitialsFromFullName(rep.name || "")}</AvatarFallback>
                      </Avatar>
                    </TooltipTrigger>
                    <TooltipContent>{rep.name}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>
        </div>
      ) : tableType === "users" ? (
        <div>
          <div className="border rounded-lg p-2 shadow-md m-1 min-w-[300px]">
            <div className="flex justify-between items-end p-0.5">
              <div className=" text-sm font-bold flex items-center gap-2">{name}</div>

              <div className="text-sm">{date_of_birth ? dayjs(date_of_birth).format("MMM DD") : ""}</div>
            </div>

            <div className="flex justify-between items-end p-0.5 capitalize">
              <div className=" text-sm flex items-center gap-2">
                {unique_code || ""}
                {unique_code ? (
                  <div className="cursor-pointer">
                    <CopyIcon
                      onClick={(e) => {
                        e.stopPropagation();
                        CopyAction(unique_code || "");
                        SuccessHandler(`User Code copied successfully`);
                      }}
                      size={16}
                    />
                  </div>
                ) : (
                  ""
                )}
              </div>
              <div className="text-sm">{phone_number || ""}</div>
            </div>

            <div className="flex justify-between items-end p-0.5 py-1 capitalize">
              <div className="text-sm">
                <div className="capitalize flex  items-center gap-1">
                  <span>{g20CategoryLabel || "---"}</span>
                  <span className="text-xs">({`${g20CategoryAmount || categoryRange}`})</span>
                </div>
              </div>

              <Badge className="text-sm justify-center" variant={status === "consistent" ? "custom" : status === "active" ? "custom" : "destructive"}>
                <div className="capitalize">{status}</div>
              </Badge>
            </div>
            <div className="flex justify-between items-end p-0.5 capitalize">
              <div className="text-sm ">{findDivisionDetails(division_id || "")?.divisionName}</div>
              <div className="text-sm">{findChapterDetails(chapter_id || "")?.chapterName}</div>
            </div>
            <div className="flex justify-between items-end p-0.5 py-1">
              <Badge
                className="cursor-pointer text-sm bg-GGP-darkGold"
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  openUpdateDialog && openUpdateDialog(row.original);
                }}
              >
                Update User
              </Badge>

              <Badge
                className="cursor-pointer text-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  openMigrateDialog && openMigrateDialog(row.original);
                }}
              >
                Migrate User
              </Badge>
            </div>
          </div>
        </div>
      ) : tableType === "hogUsers" ? (
        <div>
          <div className="border rounded-lg p-2 shadow-md m-1 min-w-[300px]">
            <div className="flex justify-between items-end p-0.5">
              <div className=" text-sm font-bold flex items-center gap-2">{name}</div>

              <div className="text-sm flex gap-2">
                {unique_code}
                <div className="cursor-pointer">
                  <CopyIcon
                    onClick={(e) => {
                      e.stopPropagation();
                      CopyAction(row.original.unique_code || "");
                      SuccessHandler(`User Code copied successfully`);
                    }}
                    size={16}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-end p-0.5 capitalize">
              <div className="text-sm ">{findDivisionDetails(division_id || "")?.divisionName}</div>
              <div className="text-sm">{chapter_id || ""}</div>
            </div>

            <div className="flex justify-between items-end p-0.5 capitalize">
              <div className="text-sm">{remitted}</div>
              <div className="text-sm">{forced}</div>
            </div>

            <div className="flex justify-between items-end p-0.5 py-1 capitalize">
              <div className="text-sm">{g20CategoryLabel || g20_category}</div>

              <Badge
                className="cursor-pointer text-sm bg-GGP-darkGold"
                variant="secondary"
                onClick={() => {
                  openUpdateDialog && openUpdateDialog(row.original);
                }}
              >
                Update User
              </Badge>
            </div>
          </div>
        </div>
      ) : tableType === "assignment" ? (
        <div>
          <div className="border rounded-lg p-2 shadow-md m-1 min-w-[300px]">
            <div className="flex justify-between items-end p-0.5 gap-3">
              <div className="text-sm font-bold">{name}</div>
              <div className="text-xs truncate">{row.original.email || "---"}</div>
            </div>

            <div className="flex justify-between items-end p-0.5 capitalize">
              <div className="text-sm">{findDivisionDetails(division_id || "")?.divisionName || "---"}</div>
              <div className="text-sm">{findChapterDetails(chapter_id || "")?.chapterName || "---"}</div>
            </div>
          </div>
        </div>
      ) : tableType === "proposedSchedule" ? (
        <div>
          <div className="border rounded-lg p-2 shadow-md m-1 min-w-[300px]">
            <div className="flex justify-between items-end p-0.5">
              <div className="text-sm">{row.original.proposed_date ? dayjs(row.original.proposed_date).format("MMM DD, YYYY") : "---"}</div>
              <Badge className="capitalize text-xs" variant={proposedStatus === "cleared" ? "secondary" : proposedStatus === "due" ? "custom" : "destructive"}>
                {proposedStatus || row.original.status || "---"}
              </Badge>
            </div>
            <div className="flex justify-between p-0.5">
              <div>{row.original.schedule_year || "---"}</div>
              <div>Line {row.original.schedule_index || "---"}</div>
            </div>
            <div className="flex justify-between p-0.5 font-bold">
              <div>{numberWithCurrencyFormatter(row.original.currency || "NGN", row.original.proposed_amount || 0)}</div>
            </div>
          </div>
        </div>
      ) : ["remissionHistoy", "remissionsManagement"].includes(tableType) ? (
        <div>
          <div className="border rounded-lg p-2 shadow-md m-1 min-w-[300px]">
            <div className="flex justify-between items-end p-0.5">
              <div className="text-sm">{dayjs(payment_date).format("MMM DD, YYYY")}</div>
              <div className={"text-md"}>{user_name}</div>
            </div>
            <div className="flex justify-between  p-0.5">
              <div>{remission_period}</div>
              <div className="font-bold">{numberWithCurrencyFormatter(currency || "GBP", amount || 0)}</div>
            </div>
            <div className="flex justify-between italic text-xs  p-0.5">
              <div>{findChapterDetails(chapter_id || "")?.chapterName}</div>
              <div>{status === "Paid" ? approved_by : CapitaliseText(status)}</div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="border rounded-lg p-2 shadow-md m-1 min-w-[300px]">
            <div className="flex justify-between items-end p-0.5">
              <div className="text-sm">{dayjs(payment_date).format("MMM DD, YYYY")}</div>
              <div className={"text-md"}>{user_name}</div>
            </div>
            <div className="flex justify-between  p-0.5">
              <div>{remission_period}</div>
              <div className="font-bold">{numberWithCurrencyFormatter(currency || "GBP", amount || 0)}</div>
            </div>
            <div className="flex justify-between italic text-xs  p-0.5">
              <div>{findChapterDetails(chapter_id || "")?.chapterName}</div>
              <div>{approved_by}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileTableCard;
