import { useReactTable, getCoreRowModel, flexRender, ColumnDef } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
// import { ArrowLeft, ArrowRight } from "lucide-react";
import MobileTableCard from "../mobileTableCard";
import { useState } from "react";
import { PartnerPaymentDetails } from "../PartnerDetails";
import { PartnerRowType, PaymentRowType } from "@/supabase/modifiedSupabaseTypes";
import MobileTableHeader from "../mobileTableHeader";
import useLargeScreen from "@/hooks/checkScreenSize";
import { cn, pageSizeOptions } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SelectOptions } from "@/interfaces/register";

interface UserDataTableProps<T> {
  data: T[];
  count: number;
  columns: ColumnDef<any>[];
  pageSize: string;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setPageSize: React.Dispatch<React.SetStateAction<string>>;
  openMigrateDialog: (userData: Record<string, any>) => void;
  openUpdateDialog: (userData: Record<string, any>) => void;
  customText?: string;
  order: string[];
}

export default function UserDataTable<T>({
  data,
  columns,
  count,
  page,
  setPage,
  pageSize = "10",
  setPageSize,
  openMigrateDialog,
  openUpdateDialog,
  customText,
  order,
}: UserDataTableProps<T>) {
  const totalPages = Math.ceil(count / +pageSize);

  const [openSheet, setOpenSheet] = useState(false);
  const [details, setDetails] = useState<Partial<PaymentRowType> | Partial<PartnerRowType>>({});

  const table = useReactTable({
    data: data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const selectRow = (row: any) => {
    setDetails(row.original);
    setOpenSheet(true);
  };

  const isLargeScreen = useLargeScreen();

  return (
    <div className="w-full  md:border border-[#ae9956] dark:bg-[#252525]/35 dark:border-[#EDEDED24] rounded-xl shadow-sm overflow-hidden">
      {/* <h2 className="font-normal text-lg text-left px-6 py-4">Partners</h2> */}
      {customText && <h2 className="font-normal text-lg text-left px-6 py-4">{customText}</h2>}
      <Table>
        {/* Table Header */}
        <TableHeader className="hidden md:contents">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="bg-[#FFF8E5] dark:bg-[#CCA33D]">
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className={cn("text-[#171721] dark:text-white font-semibold px-7 text-sm md:text-base", header.id === 'Actions' ? 'text-center' : '')}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>

        {/* Mobile fallback header */}
        <MobileTableHeader tableType="users" />

        {/* Table Body */}
        <TableBody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) =>
              isLargeScreen ? (
                <TableRow
                  key={row.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    selectRow(row);
                  }}
                // className="text-green-500 border-0 border-l-4  border-green-500"
                // className="hidden md:contents"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-7 py-4 text-xs md:text-sm">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ) : (
                <MobileTableCard key={row.id} row={row} tableType="users" openMigrateDialog={openMigrateDialog} openUpdateDialog={openUpdateDialog} clickHandler={() => { selectRow(row) }} />
              ),
            )
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-6">
                No results found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      {(totalPages > 1 || +pageSize > 10) && (
        <div>
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
              <Button variant="outline" size="lg2" onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}>
                Previous
              </Button>
              <Button variant="outline" size="lg2" onClick={() => setPage((p) => (p + 1 > totalPages ? p : p + 1))} disabled={page >= totalPages}>
                Next
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* PartnerPaymentDetails Drawer */}
      <PartnerPaymentDetails details={details} open={openSheet} setOpen={setOpenSheet} order={order} />
    </div>
  );
}
