import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SelectOptions } from "@/interfaces/register";
import { pageSizeOptions } from "@/lib/utils";

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
    <div className="w-full  md:border border-[#ae9956] dark:bg-[#252525]/35 dark:border-[#EDEDED24] rounded-xl shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="bg-[#FFF8E5] dark:bg-[#CCA33D]">
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="text-[#171721] dark:text-white font-semibold px-7 text-sm md:text-base">
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className={`hover:bg-[#FCF9EF]  dark:hover:bg-[#252525]/85 ${onRowClick ? "cursor-pointer" : ""}`}
                onClick={() => onRowClick?.(row.original)}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="px-7 py-4 text-xs md:text-sm">
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

      {(totalPages > 1 || +pageSize > 10) && (
        <div>
          <hr className="my-2 border-t dark:border-[#252525]" />
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
              <Button variant="outline" size="lg2" onClick={() => setPage((prev) => (prev + 1 > totalPages ? prev : prev + 1))} disabled={page >= totalPages}>
                Next
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* <div className="flex items-center justify-between px-4 py-3 border-t">
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
      </div> */}
    </div>
  );
};
