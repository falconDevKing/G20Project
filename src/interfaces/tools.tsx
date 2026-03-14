import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import dayjs from "dayjs";
import { CapitaliseText } from "@/lib/textUtils";
import { numberWithCurrencyFormatter } from "@/lib/numberUtils";
import { findChapterDetails } from "@/services/payment";
import { getG20CategoryLabel } from "@/lib/g20Categories";

export type DummyObject = Record<string, any>;

export type Chapter = {
  name: string;
  division_id?: string;
  reps?: DummyObject[];
};

export type Division = {
  name: string;
  reps?: DummyObject[];
};

export type Shepherd = {
  id?: string;
  name: string;
  rep_partner_id?: string | null;
  reps?: DummyObject[];
};

export type Governor = {
  id?: string;
  name: string;
  shepherd_id?: string | null;
  rep_partner_id?: string | null;
  reps?: DummyObject[];
};

export type President = {
  id?: string;
  name: string;
  shepherd_id?: string | null;
  governor_id?: string | null;
  rep_partner_id?: string | null;
  reps?: DummyObject[];
};

export type User = {
  name: string;
  g20_category?: string;
  g20_amount?: number;
  division_id: string;
  chapter_id: string;
  president_id: string;
  governor_id: string;
  shepherd_id: string;
  permission_type?: string;
  ops_permission_type?: string;
  status?: string;
  unique_code?: string;
  date_of_birth?: string;
};

export const tabItems = [
  { value: "chapter", label: "Chapters" },
  { value: "division", label: "Divisions" },
  // { value: "user", label: "Users" },
];

export const operationalTabItems = [
  { value: "shepherd", label: "Shepherds" },
  { value: "governor", label: "Governors" },
  { value: "president", label: "Presidents/Houses" },
];

export const overviewItems = [
  { value: "partners", label: "Partners" },
  { value: "remissions", label: "Remissions" },
];

export type DivisionsList = {
  id: string;
  name: string;
  organisation_id: string;
}[];

export type ChaptersList = {
  id: string;
  name: string;
  division_id: string;
  organisation_id: string;
}[];

export type ShepherdsList = {
  id: string;
  name: string;
  organisation_id: string;
}[];

export type GovernorsList = {
  id: string;
  name: string;
  shepherd_id: string;
  organisation_id: string;
}[];

export type PresidentsList = {
  id: string;
  name: string;
  governor_id: string;
  shepherd_id: string;
  organisation_id: string;
}[];

export const getInitialsFromFullName = (name: string): string => {
  return name
    .split(" ")
    .filter((part) => part.trim() !== "")
    .map((part) => part[0].toUpperCase())
    .join("");
};

// Columns
export const chapterColumns: (divisions: DivisionsList) => ColumnDef<Chapter>[] = (divisions) => {
  return [
    { accessorKey: "name", header: "Name" },
    {
      accessorKey: "division_id",
      header: "Division",
      cell: ({ row }) => {
        return <div className="capitalize">{divisions.find((division) => division.id === row.getValue("division_id"))?.name || ""}</div>;
      },
    },
    { accessorKey: "base_currency", header: "Base Currency" },
    {
      accessorKey: "rep",
      header: "Rep",
      cell: ({ row }) => {
        return (
          <div className="capitalize">
            {row.original.reps?.map((rep) => (
              <TooltipProvider key={rep.name}>
                <Tooltip>
                  <TooltipTrigger>
                    <Avatar className="h-8 w-8 rounded-lg mx-1">
                      <AvatarFallback className="rounded-lg">{getInitialsFromFullName(rep.name || "")}</AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent>{rep.name}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        );
      },
    },
  ];
};

export const divisionColumns: ColumnDef<Division>[] = [
  { accessorKey: "name", header: "Name" },
  {
    accessorKey: "rep",
    header: "Rep",
    cell: ({ row }) => {
      return (
        <div className="capitalize">
          {row.original.reps?.map((rep) => (
            <TooltipProvider key={rep.name}>
              <Tooltip>
                <TooltipTrigger>
                  <Avatar className="h-8 w-8 rounded-lg mx-1">
                    <AvatarFallback className="rounded-lg">{getInitialsFromFullName(rep.name || "")}</AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent>{rep.name}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      );
    },
  },
];

export const shepherdColumns: ColumnDef<Shepherd>[] = [
  { accessorKey: "name", header: "Name" },
  {
    accessorKey: "rep_name",
    header: "Rep",
    cell: ({ row }) => {
      const repName = row.original.reps?.[0]?.name || "---";
      return <div className="capitalize">{repName}</div>;
    },
  },
];

export const governorColumns: (shepherdEntities: { id: string; name: string }[]) => ColumnDef<Governor>[] = (shepherdEntities) => [
  { accessorKey: "name", header: "Name" },
  {
    accessorKey: "shepherd_id",
    header: "Shepherd",
    cell: ({ row }) => <div className="capitalize">{shepherdEntities.find((shepherd) => shepherd.id === row.original.shepherd_id)?.name || "---"}</div>,
  },
  {
    accessorKey: "rep_name",
    header: "Rep",
    cell: ({ row }) => {
      const repName = row.original.reps?.[0]?.name || "---";
      return <div className="capitalize">{repName}</div>;
    },
  },
];

export const presidentColumns: (shepherdEntities: { id: string; name: string }[], governors: { id: string; name: string }[]) => ColumnDef<President>[] = (
  shepherdEntities,
  governors,
) => [
  { accessorKey: "name", header: "Name" },
  {
    accessorKey: "shepherd_id",
    header: "Shepherd",
    cell: ({ row }) => <div className="capitalize">{shepherdEntities.find((shepherd) => shepherd.id === row.original.shepherd_id)?.name || "---"}</div>,
  },
  {
    accessorKey: "governor_id",
    header: "Governor",
    cell: ({ row }) => <div className="capitalize">{governors.find((governor) => governor.id === row.original.governor_id)?.name || "---"}</div>,
  },
  {
    accessorKey: "rep_name",
    header: "Rep",
    cell: ({ row }) => {
      const repName = row.original.reps?.[0]?.name || "---";
      return <div className="capitalize">{repName}</div>;
    },
  },
];

export const dummyFunction = (anyParam: any) => {
  return anyParam;
};

export const userColumns: (
  divisions: DivisionsList,
  chapters: ChaptersList,
  openMigrateDialog: (userData: DummyObject) => void,
  openUpdateDialog: (userData: DummyObject) => void,
  shepherds: ShepherdsList,
  governors: GovernorsList,
  presidents: PresidentsList,
) => ColumnDef<User>[] = (divisions, chapters, openMigrateDialog, openUpdateDialog, shepherds, governors, presidents) => {
  return [
    {
      accessorKey: "name",
      header: "Honourable",
      cell: ({ row }) => {
        return (
          <div className="capitalize flex flex-col align-middle">
            <span> {row.getValue("name") || ""}</span>
            <span className="text-[12px]">( {row?.original?.unique_code || ""})</span>
          </div>
        );
      },
    },

    {
      accessorKey: "date_of_birth",
      header: "Birthday",
      cell: ({ row }) => {
        return <div className="capitalize">{row?.original?.date_of_birth ? dayjs(row?.original?.date_of_birth).format("MMM DD") : ""}</div>;
      },
    },
    { accessorKey: "phone_number", header: "Phone Number" },
    {
      accessorKey: "g20_category",
      header: "Category",
      cell: ({ row }) => {
        const G20Category = row.getValue("g20_category");
        const pstPermissions = row.original.permission_type;
        const opsPermission = row.original.ops_permission_type;
        const showAmount = pstPermissions === "organisation" || opsPermission === "shepherd";
        const categoryLabel = getG20CategoryLabel(String(G20Category || ""), { chapterId: row.original.chapter_id });

        return (
          <div className="capitalize flex flex-col align-middle">
            <span>{categoryLabel || "---"}</span>
            {showAmount && row?.original?.g20_amount ? (
              <span className="text-xs">
                ({`${numberWithCurrencyFormatter(findChapterDetails(row.original.chapter_id)?.currency || "NGN", row?.original?.g20_amount)}`})
              </span>
            ) : (
              ""
            )}
          </div>
        );
      },
    },

    {
      accessorKey: "chapter_id",
      header: "Chapter",
      cell: ({ row }) => {
        return (
          <div className="capitalize flex flex-col align-middle">
            <span>{chapters.find((chapter) => chapter.id === row.getValue("chapter_id"))?.name || ""}</span>
            <span className="text-[10px]">{divisions.find((division) => division.id === row.original.division_id)?.name || ""}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "president_id",
      header: "House",
      cell: ({ row }) => {
        return (
          <div className="capitalize flex flex-col align-middle">
            <span>{presidents.find((president) => president.id === row.getValue("president_id"))?.name || ""}</span>
            <span className="text-[10px]">
              {governors.find((governor) => governor.id === row.original.governor_id)?.name || ""} |{" "}
              {shepherds.find((shepherd) => shepherd.id === row.original.shepherd_id)?.name || ""}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status: string = row.getValue("status");
        const variant = status === "consistent" ? "custom" : status === "active" ? "secondary" : "destructive";
        return (
          <div className="w-full flex justify-center">
            <Badge className="text-sm justify-center" variant={variant}>
              <div className="capitalize">{status}</div>
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "",
      header: "Actions",
      cell: ({ row }) => {
        return (
          <div className="flex gap-2 justify-evenly">
            <Badge
              className="cursor-pointer text-sm"
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation();
                openUpdateDialog(row.original);
              }}
            >
              Update
            </Badge>
            <Badge
              className="cursor-pointer text-sm"
              onClick={(e) => {
                e.stopPropagation();
                openMigrateDialog(row.original);
              }}
            >
              Migrate
            </Badge>
          </div>
        );
      },
    },
  ];
};

export const HoGUserColumns: (divisions: DivisionsList, openUpdateDialog: (userData: DummyObject) => void) => ColumnDef<User>[] = (
  divisions,
  openUpdateDialog,
) => {
  return [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        return (
          <div className="flex align-middle gap-2">
            {/* <Tooltip>
              <TooltipTrigger>
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
              </TooltipTrigger>
              <TooltipContent>Copy user unique code ({row.original.unique_code || ""})</TooltipContent>
            </Tooltip> */}

            {row.getValue("name") || ""}
          </div>
        );
      },
    },

    { accessorKey: "unique_code", header: "Code" },

    {
      accessorKey: "division_id",
      header: "Division",
      cell: ({ row }) => {
        return <div className="capitalize">{divisions.find((division) => division.id === row.getValue("division_id"))?.name || ""}</div>;
      },
    },

    {
      accessorKey: "chapter_id",
      header: "Chapter",
      cell: ({ row }) => {
        return <div className="capitalize">{CapitaliseText(row.getValue("chapter_id") || "")}</div>;
      },
    },
    { accessorKey: "g20_category", header: "Category" },
    // {
    //   accessorKey: "status",
    //   header: "Status",
    //   cell: ({ row }) => {
    //     const status: string = row.getValue("status");
    //     const variant = status === "consistent" ? "custom" : status === "active" ? "secondary" : "destructive";
    //     return (
    //       <div className="w-full flex justify-center">
    //         <Badge className="text-sm justify-center" variant={variant}>
    //           <div className="capitalize">{status}</div>
    //         </Badge>
    //       </div>
    //     );
    //   },
    // },
    // {
    //   accessorKey: "permission_type",
    //   header: "Permission",
    //   cell: ({ row }) => {
    //     return <div className="capitalize">{row.getValue("permission_type")}</div>;
    //   },
    // },
    {
      accessorKey: "",
      header: "Actions",
      cell: ({ row }) => {
        return (
          <div className="flex gap-2 justify-evenly">
            <Badge
              className="cursor-pointer text-sm"
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation();
                openUpdateDialog(row.original);
              }}
            >
              Update
            </Badge>
          </div>
        );
      },
    },
  ];
};
