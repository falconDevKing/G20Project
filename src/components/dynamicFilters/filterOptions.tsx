type Operator = "Equals" | "Contains" | "Within" | "Not Equals";
type DateRange = { from?: Date; to?: Date };
export type StringRange = { from?: string; to?: string };

export type FilterType = {
  field: string; // e.g. "status", "payment_date", "name_code"
  operator: Operator; // "Equals" | "Contains" | "Within"
  value: string | StringRange | DateRange; // string for text; {from,to} for dates
};

export const filterFieldsOptions = [
  { label: "Division", value: "division_id", filterType: ["Payment", "Partner"], allow: ["Admin"] },
  { label: "Chapter", value: "chapter_id", filterType: ["Payment", "Partner"], allow: ["Admin"] },
  { label: "Status", value: "status", filterType: ["Partner", "Payment", "Proposed"], allow: ["Individual", "Admin"] },

  { label: "Name Or Code", value: "name_code", filterType: ["Partner"], allow: ["Admin"] },
  { label: "Birthday", value: "birth_day_mmdd", filterType: ["Partner"], allow: ["Admin"] },
  { label: "G20 Category", value: "g20_category", filterType: ["Partner"], allow: ["Admin"] },
  { label: "Admin Level", value: "permission_type", filterType: ["Partner"], allow: ["Admin"] },
  { label: "Automated Remissions", value: "g20_active_recurring_remission", filterType: ["Partner"], allow: ["Admin"] },
  { label: "Preferred Remission Day", value: "preferred_remission_day", filterType: ["Partner"], allow: ["Admin"] },

  // { label: "Amount", value: "amount" , filterType: ["Payment" , "Partner"] , allow: ["Individual", "Admin"],  },
  { label: "User Name", value: "name_code", filterType: ["Payment"], allow: ["Admin"] },
  { label: "Online Payment", value: "online_payment", filterType: ["Payment"], allow: ["Admin"] },
  { label: "Payment Date", value: "payment_date", filterType: ["Payment"], allow: ["Individual", "Admin"] },
  { label: "Proposed Date", value: "proposed_date", filterType: ["Payment", "Proposed"], allow: ["Individual", "Admin"] },
  { label: "Scheduled Year", value: "schedule_year", filterType: ["Payment", "Proposed"], allow: ["Individual", "Admin"] },
  { label: "Remission Period", value: "remission_period", filterType: ["Payment"], allow: ["Individual", "Admin"] },
];

export type FilterFieldOptionsType = (typeof filterFieldsOptions)[number]["value"];

export const filterPendingRemissionsFieldsOptions = [{ label: "Status", value: "status", filterType: ["Partner", "Payment"], allow: ["Individual", "Admin"] }];

export const filterOperatorsOptionsCreator = (permission_type: string) => {
  const isDivisionAdmin = permission_type === "division";
  const isOrganisation = permission_type === "organisation";

  return {
    name_code: ["Contains"],
    chapter_id: isOrganisation || isDivisionAdmin ? ["Equals", "Not Equals"] : ["Equals"],
    division_id: isOrganisation ? ["Equals", "Not Equals"] : ["Equals"],
    status: ["Equals", "Not Equals"],
    birth_day_mmdd: ["Equals", "Within"],
    g20_category: ["Equals"],
    permission_type: ["Equals", "Not Equals"],
    g20_active_recurring_remission: ["Equals"],
    preferred_remission_day: ["Equals", "Within"],
    // gender: ["Equals"],

    user_name: ["Equals", "Contains"],
    online_payment: ["Equals"],
    payment_date: ["Equals", "Within"],
    proposed_date: ["Equals", "Within"],
    schedule_year: ["Equals", "Within"],
    remission_period: ["Equals", "Within"],
    // amount: ["Equals", "Contains", "Within"],
  };
};

export const filterFieldsLabels: Record<string, string> = {
  name_code: "Name/Code",
  chapter_id: "Chapter",
  division_id: "Division",
  status: "Status",
  birth_day_mmdd: "Birthday",
  g20_category: "G20 Category",
  permission_type: "Admin Level",
  g20_active_recurring_remission: "Automated Remission",
  preferred_remission_day: "Preferred Remission Day",
  // gender: "Gender",

  online_payment: "Online Payment",
  user_name: "User Name",
  payment_date: "Payment Date",
  proposed_date: "Proposed Date",
  schedule_year: "Scheduled Year",
  remission_period: "Remission Period",
  // amount: "Amount",
};

export const OperatorSymbols: Record<string, string> = {
  Equals: "=",
  "Not Equals": "≠",
  Contains: "∋",
  "Not Contains": "∌",
  "Greater Than": ">",
  "Less Than": "<",
  Between: "…",
  Within: ": between",
};
