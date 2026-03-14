import {
  User,
  CreditCard,
  WalletMinimal,
  BadgePlus,
  Users,
  Banknote,
  LayoutDashboard,
  Mails,
  Gauge,
  Eye,
  UserStar,
  Info,
  NotebookTabs,
  // UserPlus,
  // Settings, MoreHorizontal
} from "lucide-react";

import { ColumnDef } from "@tanstack/react-table";
import { numberWithCurrencyFormatter } from "@/lib/numberUtils";
import { ChaptersList } from "@/interfaces/tools";
import dayjs from "dayjs";
import { PartnerRowType, G20PaymentRowType } from "@/supabase/modifiedSupabaseTypes";
import { SelectOptions } from "@/interfaces/register";

export const PartnerTypeOptions = [
  { name: "Member", value: "member" },
  { name: "Volunteer", value: "volunteer" },
  { name: "External Partner", value: "external" },
];

export const UserViews = [
  { name: "Dashboard", route: "/dashboard", icon: Gauge, allowIndividual: true, allowChapter: true },
  { name: "Remission History", route: "/history", icon: CreditCard, allowIndividual: true, allowChapter: true },
  { name: "Guides", route: "/guides", icon: Info, allowIndividual: true, allowChapter: true },
  { name: "Admin View", route: "/overview", icon: UserStar, allowIndividual: false, allowChapter: true },
];

export const AdminViews = [
  { name: "Metrics", route: "/overview", icon: LayoutDashboard, allowIndividual: false, allowChapter: true },
  { name: "Remission Management", route: "/remissions", icon: WalletMinimal, allowIndividual: false, allowChapter: true },
  { name: "Pending Remissions", route: "/pending-remissions", icon: Banknote, allowIndividual: false, allowChapter: true },
  { name: "Proposal Management", route: "/proposal-management", icon: NotebookTabs, allowIndividual: false, allowChapter: true },
  { name: "Manage Honourables", route: "/users", icon: Users, allowIndividual: false, allowChapter: true },
  // { name: "Partner Signup", route: "/signup", icon: UserPlus , allowIndividual: false },
  { name: "Message Honourables", route: "/message", icon: Mails, allowIndividual: false, allowChapter: false },
  { name: "Tools", route: "/tools", icon: BadgePlus, allowIndividual: false, allowChapter: false },
];

export const menuItems = [
  { name: "Profile", icon: User, route: "/profile" },
  // { name: "Option 1", icon: Settings, route: "#" },
  // { name: "Option 2", icon: MoreHorizontal, route: "/option2" },
];

export const AppOrganisationId = "663faaca-5f76-4e01-b194-d282f33b9717";

export const userColumns: (chapters: ChaptersList) => ColumnDef<G20PaymentRowType>[] = (chapters) => {
  return [
    {
      accessorKey: "payment_date",
      header: "Payment Date",
      cell: ({ row }) => {
        return <div className="capitalize">{dayjs(row.original["payment_date"]).format("MMM DD, YYYY")}</div>;
      },
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => {
        return (
          <div className="capitalize flex items-center space-x-1">
            <div>{numberWithCurrencyFormatter(row.original["currency"] as string, row.original["amount"] as number)}</div>
          </div>
        );
      },
    },

    {
      accessorKey: "chapter_id",
      header: "Chapter",
      cell: ({ row }) => {
        return <div className="capitalize">{chapters.find((chapter) => chapter.id === row.original["chapter_id"])?.name || ""}</div>;
      },
    },
    {
      accessorKey: "remission_period",
      header: "Remission Period",
    },
    {
      accessorKey: "approved_by",
      header: "Approval Status",
      cell: ({ row }) => {
        return <div className="capitalize">{["Paid", "Setup"].includes(row.original?.status || "") ? row.original?.approved_by : row.original?.status}</div>;
      },
    },
    {
      accessorKey: "view_details",
      header: "",
      cell: () => {
        return <Eye size={24} className=" text-[#1E1E1E] max-md:dark:text-[#1E1E1E] dark:text-white" />;
      },
    },
  ];
};

export const adminColumns: (chapters: ChaptersList) => ColumnDef<G20PaymentRowType>[] = (chapters) => {
  return [
    {
      accessorKey: "payment_date",
      header: "Payment Date",
      cell: ({ row }) => {
        return <div className="capitalize">{dayjs(row.original["payment_date"]).format("MMM DD, YYYY")}</div>;
      },
    },
    { accessorKey: "user_name", header: "User Name" },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => {
        return (
          <div className="capitalize flex items-center space-x-1">
            <div>{numberWithCurrencyFormatter(row.original["currency"] as string, row.original["amount"] as number)}</div>
          </div>
        );
      },
    },

    {
      accessorKey: "chapter_id",
      header: "Chapter",
      cell: ({ row }) => {
        return <div className="capitalize">{chapters.find((chapter) => chapter.id === row.original["chapter_id"])?.name || ""}</div>;
      },
    },
    {
      accessorKey: "remission_period",
      header: "Remission Period",
    },
    {
      accessorKey: "approved_by",
      header: "Approval Status",
      cell: ({ row }) => {
        return <div className="capitalize">{["Paid", "Setup"].includes(row.original?.status || "") ? row.original?.approved_by : row.original?.status}</div>;
      },
    },
    {
      accessorKey: "view_details",
      header: "",
      cell: () => {
        return (
          <div>
            <Eye size={24} className=" text-[#1E1E1E] max-md:dark:text-[#1E1E1E] dark:text-white" />
          </div>
        );
      },
    },
  ];
};

type CovenantTier = "CovenantOfFaith" | "CovenantOfGlory" | "CovenantOfExploits" | "CovenantOfWealth";

type CovenantClass = "Word" | "Works" | "Gold" | "Platinum" | "Diamond" | "Star" | "Moon" | "Sun" | "Joseph" | "Davidic" | "Abrahamic";

export type CurrencyCode = "NGN" | "GBP" | "USD" | "CAD" | "GHS" | "ZAR" | "EUR" | "MXN" | "PHP" | "AED" | "USDAF";

export type CovenantEntry = {
  rank: CovenantClass;
  amount: string;
};

type CovenantGroup = {
  [tier in CovenantTier]: CovenantEntry[];
};

type GGPCategoriesType = {
  [currency in CurrencyCode]: CovenantGroup;
};

export const GGPCategories: GGPCategoriesType = {
  NGN: {
    CovenantOfFaith: [
      { rank: "Word", amount: "₦1,000 – ₦9,000" },
      { rank: "Works", amount: "₦10,000 – ₦19,000" },
    ],
    CovenantOfGlory: [
      { rank: "Gold", amount: "₦20,000 – ₦29,000" },
      { rank: "Platinum", amount: "₦30,000 – ₦49,000" },
      { rank: "Diamond", amount: "₦50,000 – ₦99,000" },
    ],
    CovenantOfExploits: [
      { rank: "Star", amount: "₦100,000 – ₦199,000" },
      { rank: "Moon", amount: "₦200,000 – ₦299,000" },
      { rank: "Sun", amount: "₦300,000 – ₦499,000" },
    ],
    CovenantOfWealth: [
      { rank: "Joseph", amount: "₦500,000" },
      { rank: "Davidic", amount: "₦1,000,000" },
      { rank: "Abrahamic", amount: "Above ₦1,000,000" },
    ],
  },
  GBP: {
    CovenantOfFaith: [
      { rank: "Word", amount: "£10 - £19" },
      { rank: "Works", amount: "£20 - £29" },
    ],
    CovenantOfGlory: [
      { rank: "Gold", amount: "£30 - £39" },
      { rank: "Platinum", amount: "£40 - £49" },
      { rank: "Diamond", amount: "£50 - £99" },
    ],
    CovenantOfExploits: [
      { rank: "Star", amount: "£100 - £199" },
      { rank: "Moon", amount: "£200 - £299" },
      { rank: "Sun", amount: "£300- £499" },
    ],
    CovenantOfWealth: [
      { rank: "Joseph", amount: "£500" },
      { rank: "Davidic", amount: "£1000" },
      { rank: "Abrahamic", amount: "above £1000" },
    ],
  },
  USD: {
    CovenantOfFaith: [
      { rank: "Word", amount: "$10 - $19" },
      { rank: "Works", amount: "$20 - $29" },
    ],
    CovenantOfGlory: [
      { rank: "Gold", amount: "$30 - $39" },
      { rank: "Platinum", amount: "$40 - $49" },
      { rank: "Diamond", amount: "$50 - $99" },
    ],
    CovenantOfExploits: [
      { rank: "Star", amount: "$100 - $199" },
      { rank: "Moon", amount: "$200 - $299" },
      { rank: "Sun", amount: "$300- $499" },
    ],
    CovenantOfWealth: [
      { rank: "Joseph", amount: "$500" },
      { rank: "Davidic", amount: "$1000" },
      { rank: "Abrahamic", amount: "above $1000" },
    ],
  },
  CAD: {
    CovenantOfFaith: [
      { rank: "Word", amount: "CA$10 - CA$19" },
      { rank: "Works", amount: "CA$20 - CA$29" },
    ],
    CovenantOfGlory: [
      { rank: "Gold", amount: "CA$30 - CA$39" },
      { rank: "Platinum", amount: "CA$40 - CA$49" },
      { rank: "Diamond", amount: "CA$50 - CA$99" },
    ],
    CovenantOfExploits: [
      { rank: "Star", amount: "CA$100 - CA$199" },
      { rank: "Moon", amount: "CA$200 - CA$299" },
      { rank: "Sun", amount: "CA$300- CA$499" },
    ],
    CovenantOfWealth: [
      { rank: "Joseph", amount: "CA$500" },
      { rank: "Davidic", amount: "CA$1000" },
      { rank: "Abrahamic", amount: "above CA$1000" },
    ],
  },
  GHS: {
    CovenantOfFaith: [
      { rank: "Word", amount: "GH₵35 - GH₵69" },
      { rank: "Works", amount: "GH₵70 - GH₵139" },
    ],
    CovenantOfGlory: [
      { rank: "Gold", amount: "GH₵141 - GH₵199" },
      { rank: "Platinum", amount: "GH₵200 - GH₵339" },
      { rank: "Diamond", amount: "GH₵340 - GH₵679" },
    ],
    CovenantOfExploits: [
      { rank: "Star", amount: "GH₵680 - GH₵1,349" },
      { rank: "Moon", amount: "GH₵1,350 - GH₵1,999" },
      { rank: "Sun", amount: "GH₵2,000 - GH₵2,699" },
    ],
    CovenantOfWealth: [
      { rank: "Joseph", amount: "GH₵3,500" },
      { rank: "Davidic", amount: "GH₵7,000" },
      { rank: "Abrahamic", amount: "above GH₵7,000" },
    ],
  },
  ZAR: {
    CovenantOfFaith: [
      { rank: "Word", amount: "R50 - R119" },
      { rank: "Works", amount: "R120 - R239" },
    ],
    CovenantOfGlory: [
      { rank: "Gold", amount: "R240 - R359" },
      { rank: "Platinum", amount: "R360 - R549" },
      { rank: "Diamond", amount: "R550 - R1,199" },
    ],
    CovenantOfExploits: [
      { rank: "Star", amount: "R1,200 - R2,399" },
      { rank: "Moon", amount: "R2,400 - R3,599" },
      { rank: "Sun", amount: "R3,600 - R5,499" },
    ],
    CovenantOfWealth: [
      { rank: "Joseph", amount: "R5,500" },
      { rank: "Davidic", amount: "R12,000" },
      { rank: "Abrahamic", amount: "above R12,000" },
    ],
  },
  EUR: {
    CovenantOfFaith: [
      { rank: "Word", amount: "€10 - €19" },
      { rank: "Works", amount: "€20 - €29" },
    ],
    CovenantOfGlory: [
      { rank: "Gold", amount: "€30 - €39" },
      { rank: "Platinum", amount: "€40 - €49" },
      { rank: "Diamond", amount: "€50 - €99" },
    ],
    CovenantOfExploits: [
      { rank: "Star", amount: "€100 - €199" },
      { rank: "Moon", amount: "€200 - €299" },
      { rank: "Sun", amount: "€300- €499" },
    ],
    CovenantOfWealth: [
      { rank: "Joseph", amount: "€500" },
      { rank: "Davidic", amount: "€1000" },
      { rank: "Abrahamic", amount: "above €1000" },
    ],
  },
  MXN: {
    CovenantOfFaith: [
      { rank: "Word", amount: "MX$200 - MX$349" },
      { rank: "Works", amount: "MX$350 - MX$599" },
    ],
    CovenantOfGlory: [
      { rank: "Gold", amount: "MX$600 - MX$749" },
      { rank: "Platinum", amount: "MX$750 - MX$999" },
      { rank: "Diamond", amount: "MX$1,000 - MX$1,999" },
    ],
    CovenantOfExploits: [
      { rank: "Star", amount: "MX$2,000 - MX$3,749" },
      { rank: "Moon", amount: "MX$3,750 - MX$5,599" },
      { rank: "Sun", amount: "MX$5,600 - MX$10,499" },
    ],
    CovenantOfWealth: [
      { rank: "Joseph", amount: "MX$10,500" },
      { rank: "Davidic", amount: "MX$20,000" },
      { rank: "Abrahamic", amount: "above MX$20,000" },
    ],
  },
  PHP: {
    CovenantOfFaith: [
      { rank: "Word", amount: "₱500 - ₱999" },
      { rank: "Works", amount: "₱1,000 - ₱1,999" },
    ],
    CovenantOfGlory: [
      { rank: "Gold", amount: "₱2,000 - ₱2,999" },
      { rank: "Platinum", amount: "₱3,000 - ₱3,999" },
      { rank: "Diamond", amount: "₱4,000 - ₱5,999" },
    ],
    CovenantOfExploits: [
      { rank: "Star", amount: "₱6,000 - ₱11,999" },
      { rank: "Moon", amount: "₱12,000 - ₱17,999" },
      { rank: "Sun", amount: "₱18,000 - ₱29,999" },
    ],
    CovenantOfWealth: [
      { rank: "Joseph", amount: "₱30,000" },
      { rank: "Davidic", amount: "₱60,000" },
      { rank: "Abrahamic", amount: "above ₱60,000" },
    ],
  },
  AED: {
    CovenantOfFaith: [
      { rank: "Word", amount: "AED 50 - AED 99" },
      { rank: "Works", amount: "AED 100 - AED 149" },
    ],
    CovenantOfGlory: [
      { rank: "Gold", amount: "AED 150 - AED 199" },
      { rank: "Platinum", amount: "AED 200 - AED 249" },
      { rank: "Diamond", amount: "AED 250 - AED 349" },
    ],
    CovenantOfExploits: [
      { rank: "Star", amount: "AED 350 - AED 699" },
      { rank: "Moon", amount: "AED 700 - AED 999" },
      { rank: "Sun", amount: "AED 1,000 - AED 1,999" },
    ],
    CovenantOfWealth: [
      { rank: "Joseph", amount: "AED 2,000" },
      { rank: "Davidic", amount: "AED 4,000" },
      { rank: "Abrahamic", amount: "above AED 4,000" },
    ],
  },
  USDAF: {
    CovenantOfFaith: [
      { rank: "Word", amount: "$2 - $5" },
      { rank: "Works", amount: "$6 - $9" },
    ],
    CovenantOfGlory: [
      { rank: "Gold", amount: "$10 - $19" },
      { rank: "Platinum", amount: "$20 - $34" },
      { rank: "Diamond", amount: "$35 - $69" },
    ],
    CovenantOfExploits: [
      { rank: "Star", amount: "$70 - $149" },
      { rank: "Moon", amount: "$150 - $299" },
      { rank: "Sun", amount: "$300 - $499" },
    ],
    CovenantOfWealth: [
      { rank: "Joseph", amount: "$500" },
      { rank: "Davidic", amount: "$1000" },
      { rank: "Abrahamic", amount: "above $1000" },
    ],
  },
};

export const G20Categories = {
  NGN: [
    { rank: "Bronze", amount: "₦1,000,000 - ₦2,000,000" },
    { rank: "Silver", amount: "₦2,000,000 - ₦5,000,000" },
    { rank: "Gold", amount: "₦5,000,000 - ₦10,000,000" },
    { rank: "Diamond", amount: "₦10,000,000 - ₦25,000,000" },
    { rank: "Platinum", amount: "Above ₦25,000,000" },
  ],

  GBP: [
    { rank: "Bronze", amount: "£700 - £1,500" },
    { rank: "Silver", amount: "£1,500 - £3,000" },
    { rank: "Gold", amount: "£3,000 - £6,000" },
    { rank: "Diamond", amount: "£6,000 - £15,000" },
    { rank: "Platinum", amount: "Above £15,000" },
  ],

  USD: [
    { rank: "Bronze", amount: "$1000 - $2,000" },
    { rank: "Silver", amount: "$2,000 - $4,000" },
    { rank: "Gold", amount: "$4,000 - $10,000" },
    { rank: "Diamond", amount: "$10,000 - $20,000" },
    { rank: "Platinum", amount: "Above $20,000" },
  ],

  CAD: [
    { rank: "Bronze", amount: "CA$1,000 - CA$2,000" },
    { rank: "Silver", amount: "CA$2,000 - CA$5,000" },
    { rank: "Gold", amount: "CA$5,000 - CA$10,000" },
    { rank: "Diamond", amount: "CA$10,000 - CA$25,000" },
    { rank: "Platinum", amount: "Above CA$25,000" },
  ],

  GHS: [
    { rank: "Bronze", amount: "GH₵10,000 - GH₵20,000" },
    { rank: "Silver", amount: "GH₵20,000 - GH₵40,000" },
    { rank: "Gold", amount: "GH₵40,000 - GH₵80,000" },
    { rank: "Diamond", amount: "GH₵80,000 - GH₵200,000" },
    { rank: "Platinum", amount: "Above GH₵200,000" },
  ],

  ZAR: [
    { rank: "Bronze", amount: "R15,000 - R25,000" },
    { rank: "Silver", amount: "R25,000 - R65,000" },
    { rank: "Gold", amount: "R65,000 - R150,000" },
    { rank: "Diamond", amount: "R150,000 - R320,000" },
    { rank: "Platinum", amount: "Above R320,000" },
  ],

  EUR: [
    { rank: "Bronze", amount: "€700 - €1,500" },
    { rank: "Silver", amount: "€1,500 - €3,500" },
    { rank: "Gold", amount: "€3,500 - €6,500" },
    { rank: "Diamond", amount: "€6,500 - €16,000" },
    { rank: "Platinum", amount: "Above €16,000" },
  ],

  MXN: [
    { rank: "Bronze", amount: "MX$15,000 - MX$30,000" },
    { rank: "Silver", amount: "MX$30,000 - MX$65,000" },
    { rank: "Gold", amount: "MX$65,000 - MX$130,000" },
    { rank: "Diamond", amount: "MX$130,000 - MX$325,000" },
    { rank: "Platinum", amount: "Above MX$325,000" },
  ],

  PHP: [
    { rank: "Bronze", amount: "₱50,000 - ₱100,000" },
    { rank: "Silver", amount: "₱100,000 - ₱250,000" },
    { rank: "Gold", amount: "₱250,000 - ₱450,000" },
    { rank: "Diamond", amount: "₱450,000 - ₱1,000,000" },
    { rank: "Platinum", amount: "Above ₱1,000,000" },
  ],

  AED: [
    { rank: "Bronze", amount: "AED 2,700 - AED 5,500" },
    { rank: "Silver", amount: "AED 5,500 - AED 15,000" },
    { rank: "Gold", amount: "AED 15,000 - AED 30,000" },
    { rank: "Diamond", amount: "AED 30,000 - AED 70,000" },
    { rank: "Platinum", amount: "Above AED 70,000" },
  ],

  USDAF: [
    { rank: "Bronze", amount: "$750 - $1,500" },
    { rank: "Silver", amount: "$1,500 - $3,600" },
    { rank: "Gold", amount: "$3,600 - $7,200" },
    { rank: "Diamond", amount: "$7,200 - $18,000" },
    { rank: "Platinum", amount: "Above $18,000" },
  ],
} as const;
export const G20RemissionStatusOptions: SelectOptions[] = [
  {
    name: "Yes",
    value: "Yes",
  },
  { name: "No", value: "No" },
  // { name: "Observing", value: "Observing" },
];

export const G20ForcedToDoSoOpions: SelectOptions[] = [
  {
    name: "Yes",
    value: "Yes",
  },
  { name: "No", value: "No" },
];

// nations.js
export const Countries = [
  { value: "GB", label: "United Kingdom" },
  { value: "US", label: "United States" },
  { value: "CA", label: "Canada" },
  { value: "NG", label: "Nigeria" },
  { value: "GH", label: "Ghana" },
  { value: "ZA", label: "South Africa" },
  { value: "CM", label: "Cameroon" },
  { value: "MX", label: "Mexico" },
  { value: "AF", label: "Afghanistan" },
  { value: "AL", label: "Albania" },
  { value: "DZ", label: "Algeria" },
  { value: "AS", label: "American Samoa" },
  { value: "AD", label: "Andorra" },
  { value: "AO", label: "Angola" },
  { value: "AI", label: "Anguilla" },
  { value: "AQ", label: "Antarctica" },
  { value: "AG", label: "Antigua and Barbuda" },
  { value: "AR", label: "Argentina" },
  { value: "AM", label: "Armenia" },
  { value: "AW", label: "Aruba" },
  { value: "AU", label: "Australia" },
  { value: "AT", label: "Austria" },
  { value: "AZ", label: "Azerbaijan" },
  { value: "BS", label: "Bahamas" },
  { value: "BH", label: "Bahrain" },
  { value: "BD", label: "Bangladesh" },
  { value: "BB", label: "Barbados" },
  { value: "BY", label: "Belarus" },
  { value: "BE", label: "Belgium" },
  { value: "BZ", label: "Belize" },
  { value: "BJ", label: "Benin" },
  { value: "BM", label: "Bermuda" },
  { value: "BT", label: "Bhutan" },
  { value: "BO", label: "Bolivia" },
  { value: "BA", label: "Bosnia and Herzegovina" },
  { value: "BW", label: "Botswana" },
  { value: "BR", label: "Brazil" },
  { value: "BN", label: "Brunei Darussalam" },
  { value: "BG", label: "Bulgaria" },
  { value: "BF", label: "Burkina Faso" },
  { value: "BI", label: "Burundi" },
  { value: "CV", label: "Cabo Verde" },
  { value: "KH", label: "Cambodia" },
  { value: "KY", label: "Cayman Islands" },
  { value: "CF", label: "Central African Republic" },
  { value: "TD", label: "Chad" },
  { value: "CL", label: "Chile" },
  { value: "CN", label: "China" },
  { value: "CO", label: "Colombia" },
  { value: "KM", label: "Comoros" },
  { value: "CG", label: "Congo" },
  { value: "CD", label: "Congo (Democratic Republic)" },
  { value: "CK", label: "Cook Islands" },
  { value: "CR", label: "Costa Rica" },
  { value: "HR", label: "Croatia" },
  { value: "CU", label: "Cuba" },
  { value: "CY", label: "Cyprus" },
  { value: "CZ", label: "Czech Republic" },
  { value: "DK", label: "Denmark" },
  { value: "DJ", label: "Djibouti" },
  { value: "DM", label: "Dominica" },
  { value: "DO", label: "Dominican Republic" },
  { value: "EC", label: "Ecuador" },
  { value: "EG", label: "Egypt" },
  { value: "SV", label: "El Salvador" },
  { value: "GQ", label: "Equatorial Guinea" },
  { value: "ER", label: "Eritrea" },
  { value: "EE", label: "Estonia" },
  { value: "SZ", label: "Eswatini" },
  { value: "ET", label: "Ethiopia" },
  { value: "FJ", label: "Fiji" },
  { value: "FI", label: "Finland" },
  { value: "FR", label: "France" },
  { value: "GA", label: "Gabon" },
  { value: "GM", label: "Gambia" },
  { value: "GE", label: "Georgia" },
  { value: "DE", label: "Germany" },
  { value: "GR", label: "Greece" },
  { value: "GL", label: "Greenland" },
  { value: "GD", label: "Grenada" },
  { value: "GU", label: "Guam" },
  { value: "GT", label: "Guatemala" },
  { value: "GN", label: "Guinea" },
  { value: "GW", label: "Guinea-Bissau" },
  { value: "GY", label: "Guyana" },
  { value: "HT", label: "Haiti" },
  { value: "HN", label: "Honduras" },
  { value: "HK", label: "Hong Kong" },
  { value: "HU", label: "Hungary" },
  { value: "IS", label: "Iceland" },
  { value: "IN", label: "India" },
  { value: "ID", label: "Indonesia" },
  { value: "IR", label: "Iran" },
  { value: "IQ", label: "Iraq" },
  { value: "IE", label: "Ireland" },
  { value: "IL", label: "Israel" },
  { value: "IT", label: "Italy" },
  { value: "JM", label: "Jamaica" },
  { value: "JP", label: "Japan" },
  { value: "KE", label: "Kenya" },
  { value: "KR", label: "Korea (Republic of)" },
  { value: "KW", label: "Kuwait" },
  { value: "LB", label: "Lebanon" },
  { value: "LR", label: "Liberia" },
  { value: "LY", label: "Libya" },
  { value: "MY", label: "Malaysia" },
  { value: "MA", label: "Morocco" },
  { value: "NL", label: "Netherlands" },
  { value: "NZ", label: "New Zealand" },
  { value: "NO", label: "Norway" },
  { value: "PK", label: "Pakistan" },
  { value: "PH", label: "Philippines" },
  { value: "PL", label: "Poland" },
  { value: "PT", label: "Portugal" },
  { value: "QA", label: "Qatar" },
  { value: "RU", label: "Russian Federation" },
  { value: "SA", label: "Saudi Arabia" },
  { value: "ES", label: "Spain" },
  { value: "SE", label: "Sweden" },
  { value: "CH", label: "Switzerland" },
  { value: "TR", label: "Turkey" },
  { value: "UG", label: "Uganda" },
  { value: "UA", label: "Ukraine" },
  { value: "ZM", label: "Zambia" },
  { value: "ZW", label: "Zimbabwe" },
];

export const placeholderOptions: { key: keyof PartnerRowType; label: string }[] = [
  { key: "first_name", label: "First Name" },
  { key: "last_name", label: "Last Name" },
  { key: "email", label: "Email" },
  { key: "phone_number", label: "Phone Number" },
  { key: "address", label: "Address" },
  { key: "status", label: "Status" },
  // { key: "date_of_birth", label: "Date of Birth" },
  { key: "birth_day_mmdd", label: "Birth Day (MMDD)" },
  { key: "g20_category", label: "G20 Category" },
  { key: "unique_code", label: "Unique Code" },
  // You might optionally include these if you hydrate them for templating:
  { key: "chapter_id", label: "Chapter Name" },
  { key: "division_id", label: "Division Name" },
  // { key: "organisation_id", label: "Organisation Name" },
];

export const partnerDetailsOrder = [
  "name",
  "unique_code",

  "email",
  "phone_number",

  "date_of_birth",
  "g20_category",

  "permission_type",
  "status",

  "division_id",
  "chapter_id",

  "gender",
  "nationality",

  "preferred_remission_day",
  "g20_active_recurring_remission",

  "address",

  "remitted",
  "forced",

  "motivation",
  // "partner_type",
  // "occupation",
];

export const paymentDetailsOrder = [
  "user_name",
  "unique_code",
  "currency",
  "amount",
  "payment_date",

  "remission_period",
  "division_id",
  "chapter_id",
  "status",
  "approved_by",
  "description",
];
