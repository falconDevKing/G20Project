import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";
import { ChapterRowType, DivisionRowType, OrganisationRowType, PartnerRowType, PaymentRowType } from "@/supabase/modifiedSupabaseTypes";

export const DoNothing = (_arg: any): void => {
  // no-op
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertFileToUrl = (file: File) => URL.createObjectURL(file);

export const pageSizeOptions = [
  { name: "10", value: "10" },
  { name: "20", value: "20" },
  { name: "50", value: "50" },
];

export const activeRecurringRemissionFilterOptions = [
  { name: "All", value: "all" },
  { name: "True", value: "True" },
  { name: "False", value: "False" },
];
export const activeRecurringRemissionOptions = [
  { name: "True", value: "True" },
  { name: "False", value: "False" },
];

export const genderOptions = [
  { name: "Male", value: "Male" },
  { name: "Female", value: "Female" },
];

export const StatusOptions = [
  { name: "All Statuses", value: "all" },
  { name: "Active", value: "active" },
  { name: "Passive", value: "passive" },
  { name: "Consistent", value: "consistent" },
];

export const PaymentStatusOptions = [
  { name: "All Statuses", value: "all" },
  { name: "Paid", value: "Paid" },
  { name: "Pending", value: "Pending" },
  { name: "Cancelled", value: "Cancelled" },
];

export const PermissionOptions = [
  { value: "individual", name: "Individual", allow: ["individual", "chapter", "division", "organisation"] },
  { value: "chapter", name: "Chapter", allow: ["chapter", "division", "organisation"] },
  { value: "division", name: "Division", allow: ["division", "organisation"] },
  { value: "organisation", name: "Organisation", allow: ["organisation"] },
];

export const PermissionAssistantOptions = [
  { value: "chapter assistant", name: "Chapter Assistant", allow: ["chapter", "division", "organisation"] },
  { value: "division assistant", name: "Division Assistant", allow: ["division", "organisation"] },
  { value: "organisation assistant", name: "Organisation Assistant", allow: ["organisation"] },
];

export type PermissionType = "individual" | "chapter" | "division" | "organisation";
const permissionOrder: PermissionType[] = ["individual", "chapter", "division", "organisation"];

export const isLowerAdminPermission = (userPerm: PermissionType, adminPerm: PermissionType, userAssistant: boolean, adminAssisitant: boolean): boolean => {
  const userIndex = permissionOrder.indexOf(userPerm);
  const adminIndex = permissionOrder.indexOf(adminPerm);

  // If either permission is not found, treat as lowest
  if (userIndex === -1 || adminIndex === -1) return true;

  return adminAssisitant ? userIndex < adminIndex : userAssistant ? userIndex <= adminIndex : userIndex < adminIndex;
};

export const ToolAccess: Record<string, string[]> = {
  organisation: ["individual", "chapter", "division", "organisation"],
  division: ["individual", "chapter"],
  chapter: [],
  individual: [],
};

export const initialiseOptions = (appState: {
  divisions: DivisionRowType[];
  chapters: ChapterRowType[];
  organisation: OrganisationRowType | Record<string, any>;
}) => {
  const { divisions, chapters, organisation } = appState;
  const DivisionOptions = divisions.map((division) => ({ value: division.id, name: division.name })).sort((a, b) => (a.name < b.name ? -1 : 1));

  const ChapterOptions = chapters
    .map((chapter) => ({
      value: chapter.id,
      name: chapter.name,
      filt: chapter.division_id as string,
      currency: chapter.base_currency as string,
    }))
    .sort((a, b) => (a.name < b.name ? -1 : 1));

  return { AppOrganisationId: organisation?.id || "", DivisionOptions, ChapterOptions };
};

export const allDivisionsOption = { value: "all", name: "All Divisions" };
export const allChaptersOption = { value: "all", name: "All Chapters", filt: "all", currency: "GBP" };

export const initialiseAdminOptions = (appState: {
  adminDivisions: DivisionRowType[];
  adminChapters: ChapterRowType[];
  organisation: OrganisationRowType | Record<string, any>;
}) => {
  const { adminDivisions: divisions, adminChapters: chapters, organisation } = appState;

  const DivisionOptions = divisions.map((division) => ({ value: division.id, name: division.name })).sort((a, b) => (a.name < b.name ? -1 : 1));
  const ChapterOptions = chapters
    .map((chapter) => ({
      value: chapter.id,
      name: chapter.name,
      filt: chapter.division_id as string,
      currency: chapter.base_currency as string,
    }))
    .sort((a, b) => (a.name < b.name ? -1 : 1));

  return {
    AppOrganisationId: organisation?.id || "",
    DivisionOptions: DivisionOptions?.length > 1 ? [allDivisionsOption, ...DivisionOptions] : DivisionOptions,
    ChapterOptions: ChapterOptions?.length > 1 ? [allChaptersOption, ...ChapterOptions] : ChapterOptions,
  };
};

export const initialiseDataList = (appState: {
  divisions: DivisionRowType[];
  chapters: ChapterRowType[];
  organisation: OrganisationRowType | Record<string, any>;
  users: PartnerRowType[];
}) => {
  const { divisions, chapters, organisation, users } = appState;

  const modifiedDivisions = divisions
    .map((division) => ({
      id: division.id,
      name: division.name,
      organisation_id: division.organisation_id as string,
      reps: division.reps || [],
    }))
    .sort((a, b) => ((a?.name || "") < (b?.name || "") ? -1 : 1));

  const modifiedChapters = chapters
    .map((chapter) => ({
      id: chapter.id,
      name: chapter.name,
      division_id: chapter.division_id as string,
      organisation_id: chapter.organisation_id as string,
      base_currency: chapter.base_currency as string,
      country: chapter.country as string,
      reps: chapter.reps || [],
    }))
    .sort((a, b) => ((a?.name || "") < (b?.name || "") ? -1 : 1));

  const modifiedUsers = users.map((user) => ({
    ...user,
    name: `${user?.first_name || ""} ${user?.last_name || ""}`,
  }));
  // .sort((a, b) => ((a?.createdAt || 0) < (b?.createdAt || 0) ? -1 : 1));

  return { AppOrganisationId: organisation?.id || "", organisation, modifiedDivisions, modifiedChapters, modifiedUsers };
};

export const generateUniqueCode = ({ first_name, last_name }: { first_name: string; last_name: string }): string => {
  const idValues = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
  ];

  const randomUUID = () => {
    let id = "";
    for (let j = 0; j < 5; j += 1) {
      const randomPartIdx = parseInt((Math.random() * 36).toFixed(0), 10) % 36;
      id += idValues[randomPartIdx];
    }
    return id;
  };

  const prefix = first_name[0] + last_name[0] + "-";
  const uniqueId = (prefix + randomUUID()).toUpperCase();

  return uniqueId;
};

const currentYear = new Date().getFullYear();

export const monthsOfTheYear = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
export const monthsOfTheYearOptions = [
  { name: "January", value: "01" },
  { name: "February", value: "02" },
  { name: "March", value: "03" },
  { name: "April", value: "04" },
  { name: "May", value: "05" },
  { name: "June", value: "06" },
  { name: "July", value: "07" },
  { name: "August", value: "08" },
  { name: "September", value: "09" },
  { name: "October", value: "10" },
  { name: "November", value: "11" },
  { name: "December", value: "12" },
];
export const RemissionPeriodsOptions = [
  { value: `December 2025`, name: `December 2025` },
  ...monthsOfTheYear.map((month) => ({ value: `${month} ${currentYear}`, name: `${month} ${currentYear}` })),
];

export const RemissionDayOptions = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
  "23",
  "24",
  "25",
  "26",
  "27",
  "28",
  "29",
  "30",
  "31",
];

export const getPaidMonths = (userPayments: PaymentRowType[], trackingYear: string = dayjs().format("YYYY")) => {
  const paidMonths = userPayments.reduce((paidMonthArray, payment) => {
    if (payment.status === "Paid" && payment.remission_year === trackingYear) {
      paidMonthArray = [...paidMonthArray, payment.remission_month as string];
    }
    return paidMonthArray;
  }, [] as string[]);

  return paidMonths;
};

export const getDashboardSummary = (userPayments: PaymentRowType[], remissionStartMonth: number) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // JS months are 0-based

  const thisYearPayments = userPayments.filter((p) => p.remission_year === currentYear.toString());

  const noOfPaymentsMade = thisYearPayments.filter((p) => p.status === "Paid").length;

  const totalPaymentAmount = thisYearPayments.filter((p) => p.status === "Paid").reduce((sum, p) => sum + (p.amount || 0), 0);

  const paidMonths = Array.from(new Set(getPaidMonths(userPayments)));

  const requiredMonths = monthsOfTheYear.filter((_, i) => i <= currentMonth && i >= +remissionStartMonth);
  const paymentsMonthsMissed = requiredMonths.filter((m) => !paidMonths.includes(m)).length;

  return {
    noOfPaymentsMade,
    paymentsMonthsMissed,
    totalPaymentAmount,
  };
};

export const initialPartnersData = {
  Nationality: [
    { title: "Nigerian", value: 0 },
    { title: "International", value: 0 },
  ],
  Status: [
    { title: "Total Partners", value: 0 },
    { title: "Consistent Partners", value: 0 },
    { title: "Active Partners", value: 0 },
    { title: "Passive Partners", value: 0 },
  ],
  GGP_Category: [
    { title: "Covenant of Faith", value: 0 },
    { title: "Covenant of Glory", value: 0 },
    { title: "Covenant of Exploits", value: 0 },
    { title: "Covenant of Wealth", value: 0 },
  ],
  Partner_Type: [
    { title: "New Partners", value: 0 },
    { title: "Members Partners", value: 0 },
    { title: "Volunteers Partners", value: 0 },
    { title: "External Partners", value: 0 },
  ],
};

export const initialRemissionsData = {
  Payment_Inflow: [
    { title: "Inflow Month to Date (MTD)", value: 0, convertCurrency: true },
    { title: "Inflow Quarter to Date (QTD)", value: 0, convertCurrency: true },
    { title: "Inflow Year to Date (YTD)", value: 0, convertCurrency: true },
  ],
  Annual_Payment_Overview: [
    { title: "No. of Payments", value: 0 },
    { title: "Frequency of Payments", value: 0 },
    { title: "Avg Value of Payments", value: 0, convertCurrency: true },
  ],
  Pending_Remissions: [
    { title: "No. of Pending Remissions", value: 0 },
    { title: "Value. of Pending Remissions", value: 0, convertCurrency: true },
  ],
};
