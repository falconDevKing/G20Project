import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";
import {
  ChapterRowType,
  DivisionRowType,
  OrganisationRowType,
  PartnerRowType,
  G20PaymentRowType,
  GovernorRowType,
  PresidentRowType,
  ShepherdRowType,
} from "@/supabase/modifiedSupabaseTypes";

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
  { name: "Online Payments", value: "True" },
  { name: "Offline Payments", value: "False" },
];

export const activeRecurringRemissionOptions = [
  { name: "Online Payments", value: "True" },
  { name: "Offline Payments", value: "False" },
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

export const ProposedStatusOptions = [
  { name: "All Statuses", value: "all" },
  { name: "Pending", value: "pending" },
  { name: "Due", value: "due" },
  { name: "Missed", value: "missed" },
  { name: "Cleared", value: "cleared" },
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
  shepherd: ["individual", "president", "governor", "shepherd"],
  governor: ["individual", "president"],
  president: [],
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
export const allShepherdsOption = { value: "all", name: "All Shepherds", filt: "all", currency: "GBP" };
export const allGovernorsOption = { value: "all", name: "All Governors", filt: "all", currency: "GBP" };
export const allPresidentsOption = { value: "all", name: "All Presidents", filt: "all", currency: "GBP" };

export const initialiseAdminOptions = (appState: {
  adminDivisions: DivisionRowType[];
  adminChapters: ChapterRowType[];
  adminShepherdEntities?: { id: string; name: string; division_id?: string | null }[];
  adminGovernorEntities?: { id: string; name: string; shepherd_id?: string | null; division_id?: string | null }[];
  adminPresidentEntities?: { id: string; name: string; governor_id?: string | null; shepherd_id?: string | null; division_id?: string | null }[];
  organisation: OrganisationRowType | Record<string, any>;
}) => {
  const { adminDivisions: divisions, adminChapters: chapters, organisation } = appState;
  const shepherdEntities = appState.adminShepherdEntities || [];
  const governorEntities = appState.adminGovernorEntities || [];
  const presidentEntities = appState.adminPresidentEntities || [];

  const DivisionOptions = divisions.map((division) => ({ value: division.id, name: division.name })).sort((a, b) => (a.name < b.name ? -1 : 1));
  const ChapterOptions = chapters
    .map((chapter) => ({
      value: chapter.id,
      name: chapter.name,
      filt: chapter.division_id as string,
      currency: chapter.base_currency as string,
    }))
    .sort((a, b) => (a.name < b.name ? -1 : 1));
  const ShepherdOptions = shepherdEntities
    .map((shepherd) => ({ value: shepherd.id, name: shepherd.name, division_id: shepherd.division_id || "" }))
    .sort((a, b) => (a.name < b.name ? -1 : 1));
  const GovernorOptions = governorEntities
    .map((governor) => ({ value: governor.id, name: governor.name, shepherd_id: governor.shepherd_id || "", division_id: governor.division_id || "" }))
    .sort((a, b) => (a.name < b.name ? -1 : 1));
  const PresidentOptions = presidentEntities
    .map((president) => ({
      value: president.id,
      name: president.name,
      governor_id: president.governor_id || "",
      shepherd_id: president.shepherd_id || "",
      division_id: president.division_id || "",
    }))
    .sort((a, b) => (a.name < b.name ? -1 : 1));

  return {
    AppOrganisationId: organisation?.id || "",
    DivisionOptions: DivisionOptions?.length > 1 ? [allDivisionsOption, ...DivisionOptions] : DivisionOptions,
    ChapterOptions: ChapterOptions?.length > 1 ? [allChaptersOption, ...ChapterOptions] : ChapterOptions,
    ShepherdOptions,
    GovernorOptions,
    PresidentOptions,
  };
};

export const initialiseDataList = (appState: {
  divisions: DivisionRowType[];
  chapters: ChapterRowType[];
  organisation: OrganisationRowType | Record<string, any>;
  users: PartnerRowType[];
  shepherdEntities: ShepherdRowType[];
  governorEntities: GovernorRowType[];
  presidentEntities: PresidentRowType[];
}) => {
  const { divisions, chapters, organisation, users, shepherdEntities, governorEntities, presidentEntities } = appState;

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

  const modifiedShepherds = shepherdEntities
    .map((shepherd) => ({
      id: shepherd.id,
      name: shepherd.name,
      division_id: shepherd.division_id || "",
      organisation_id: shepherd.organisation_id as string,
      reps: shepherd.reps || [],
    }))
    .sort((a, b) => (a.name < b.name ? -1 : 1));
  const modifiedGovernors = governorEntities
    .map((governor) => ({
      id: governor.id,
      name: governor.name,
      shepherd_id: governor.shepherd_id || "",
      division_id: governor.division_id || "",
      organisation_id: governor.organisation_id as string,
      reps: governor.reps || [],
    }))
    .sort((a, b) => (a.name < b.name ? -1 : 1));
  const modifiedPresidents = presidentEntities
    .map((president) => ({
      id: president.id,
      name: president.name,
      governor_id: president.governor_id || "",
      shepherd_id: president.shepherd_id || "",
      division_id: president.division_id || "",
      organisation_id: president.organisation_id as string,
      reps: president.reps || [],
    }))
    .sort((a, b) => (a.name < b.name ? -1 : 1));

  return {
    AppOrganisationId: organisation?.id || "",
    organisation,
    modifiedDivisions,
    modifiedChapters,
    modifiedUsers,
    modifiedPresidents,
    modifiedGovernors,
    modifiedShepherds,
  };
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

export const getPaidMonths = (userPayments: G20PaymentRowType[], trackingYear: string = dayjs().format("YYYY")) => {
  const paidMonths = userPayments.reduce((paidMonthArray) => {
    console.log("trackingYear", trackingYear);
    return paidMonthArray;
  }, [] as string[]);

  return paidMonths;
};

export const getDashboardSummary = (userPayments: G20PaymentRowType[], remissionStartMonth: number) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // JS months are 0-based

  const thisYearPayments = userPayments.filter((p) => p.payment_date === currentYear.toString());

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
  G20_Category: [
    { title: "Bronze", value: 0 },
    { title: "Silver", value: 0 },
    { title: "Gold", value: 0 },
    { title: "Diamond", value: 0 },
    { title: "Platinum", value: 0 },
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
