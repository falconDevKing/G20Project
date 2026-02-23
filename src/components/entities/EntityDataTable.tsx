import { useReactTable, getCoreRowModel, flexRender, ColumnDef } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import EditItemDialog from "./EditEntityDialog";
import { useAppSelector } from "@/redux/hooks";
import { pageSizeOptions, ToolAccess } from "@/lib/utils";
import MobileTableCard from "../mobileTableCard";
import MobileTableHeader from "../mobileTableHeader";
import useLargeScreen from "@/hooks/checkScreenSize";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { SelectOptions } from "@/interfaces/register";

interface EntityDataTableProps<T> {
  chapters: T[];
  columns: ColumnDef<any>[];
  label: string;
  divisions: T[];
}

export default function EntityDataTable<T>({ label, chapters, columns, divisions }: EntityDataTableProps<T>) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState("10");
  const [open, setOpen] = useState(false);
  const [entity, setEntity] = useState<Record<string, any>>({});

  const [data, setData] = useState<T[]>([]);
  const isDivision = label === "Division"
  const [selectedDivisionId, setSelectedDivisionId] = useState<string>("");
  const userDetails = useAppSelector((state) => state.auth.userDetails);
  const { permission_type, division_id } = userDetails

  const userToolsAccess = ToolAccess[permission_type as string] || [];
  const allowAccess = userToolsAccess.includes(label.toLowerCase());

  const selectRow = (row: any) => {
    setEntity(row.original);
    setOpen(true);
  };
  const totalPages = Math.ceil(data.length / +pageSize);

  const paginatedData = useMemo(() => data.slice((page - 1) * +pageSize, page * +pageSize), [data, page, +pageSize]);

  const table = useReactTable({
    data: paginatedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const isLargeScreen = useLargeScreen();

  const DivisionOptions = divisions.map((division: any) => ({
    value: division.id,
    name: division.name,
  }))

  useEffect(() => {
    if (isDivision) {
      setData(divisions)
    } else {
      const filteredChapters = chapters.filter((chapter: any) => {
        if (permission_type?.toLowerCase() !== 'organisation') {
          return chapter.division_id === division_id;
        }

        if (selectedDivisionId) {
          return chapter.division_id === selectedDivisionId;
        }

        return true;
      })

      setData(filteredChapters)
    }
  }, [isDivision, chapters, divisions, selectedDivisionId, division_id])

  return (
    <>
      {isDivision ? "" : (<div className="mb-4 w-full max-w-sm lg:flex">
        <div className="flex items-center gap-1 pr-3">
          <div className="text-gray-600/90 font-normal text-base">Filter By Division: </div>
        </div>

        <Select defaultValue={selectedDivisionId} value={selectedDivisionId} onValueChange={(value) => setSelectedDivisionId(value)}>
          <SelectTrigger className=" w-48 h-12">
            <SelectValue placeholder="Select Division" />
          </SelectTrigger>
          <SelectContent className="shad-select-content">
            {DivisionOptions.map((division: SelectOptions) => (
              <SelectItem key={division.value} value={division.value as unknown as string}>
                <div className="flex items-center cursor-pointer gap-3">
                  <p>{division.name}</p>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      )}

      <div className=" w-full border border-[#ae9956] dark:bg-[#252525]/35 dark:border-[#EDEDED24] rounded-xl shadow-sm overflow-hidden">
        <Table className="w-full">
          {/* Table Header */}
          <TableHeader className="hidden md:contents">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-[#FFF8E5]">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-[#171721] dark:text-white  bg-[#FFF8E5] dark:bg-[#CCA33D] font-semibold px-7 text-sm md:text-base">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <MobileTableHeader tableType={"entity"} isDivision={isDivision} />

          {/* Table Body */}
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) =>
                isLargeScreen ? (
                  <TableRow key={row.id} onClick={() => allowAccess && selectRow(row)} className="hover:bg-muted/50 transition-colors">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="px-7 py-4 text-xs md:text-sm">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ) : (
                  <MobileTableCard
                    row={row}
                    tableType={"entity"}
                    key={row.id}
                    clickHandler={() => {
                      if (allowAccess) {
                        selectRow(row);
                      }
                    }}
                  />
                ),
              )
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {data.length > +pageSize && (
          <>
            <hr className="my-2" />
            <div className="flex items-center justify-between px-6 py-4">

              <div className="flex items-center gap-2 ">
                <span className="text-sm">
                  Page {page} of {totalPages}
                </span>

                <div>
                  <Select onValueChange={setPageSize} defaultValue={pageSize} value={pageSize}>
                    <SelectTrigger className="shad-select-trigger">
                      <SelectValue placeholder="Select your Gender" />
                    </SelectTrigger>
                    <SelectContent className="shad-select-content">
                      {pageSizeOptions.map((pageOptions: SelectOptions) => (
                        <SelectItem key={pageOptions.value} value={pageOptions.value as string}>
                          <div className="flex items-center cursor-pointer gap-3">
                            <p>{pageOptions.name}</p>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

              </div>


              <div className="flex gap-2">
                <Button variant="outline" size="lg2" onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}>
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="lg2"
                  onClick={() => setPage((prev) => (prev < totalPages ? prev + 1 : prev))}
                  disabled={page >= totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      <EditItemDialog label={label} entityData={entity} open={open} setOpen={setOpen} setEntity={setEntity} />
    </>
  );
}
