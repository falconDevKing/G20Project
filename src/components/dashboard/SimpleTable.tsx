import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type SimpleTableProps<TData extends Record<string, any>> = {
  data: TData[];
  columns: ColumnDef<TData>[];
  count: number;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  pageSize: string;
  setPageSize: React.Dispatch<React.SetStateAction<string>>;
  onRowClick?: (row: TData) => void;
};

const pageSizeOptions = ["10", "20", "50", "100"];

export const SimpleTable = <TData extends Record<string, any>>({
  data,
  columns,
  count,
  page,
  setPage,
  pageSize,
  setPageSize,
  onRowClick,
}: SimpleTableProps<TData>) => {
  const totalPages = Math.max(1, Math.ceil(count / Math.max(1, Number(pageSize))));

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full border border-[#D4AF37]/30 rounded-xl overflow-hidden bg-white">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="bg-[#FCF6E6]">
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="text-[#1E1E1E] font-semibold text-sm md:text-base px-7">
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className={`hover:bg-[#FCF9EF]  ${onRowClick ? "cursor-pointer" : ""}`} onClick={() => onRowClick?.(row.original)}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="px-7 py-4 text-xs md:text-sm dark:text-black">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No records found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between px-4 py-3 border-t">
        <div className="text-sm text-[#667085]">
          Page {page} of {totalPages}
        </div>

        <div className="flex items-center gap-2">
          <Select value={pageSize} onValueChange={setPageSize}>
            <SelectTrigger className="w-20 h-9" enforceWhite>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="shad-select-content">
              {pageSizeOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((prev) => Math.max(1, prev - 1))}>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
