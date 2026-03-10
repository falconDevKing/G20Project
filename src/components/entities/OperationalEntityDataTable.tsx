import { useMemo, useState } from "react";
import { useReactTable, getCoreRowModel, flexRender, ColumnDef } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { pageSizeOptions } from "@/lib/utils";
import EditItemDialog from "./EditEntityDialog";

type OperationalEntityDataTableProps<T> = {
  label: string;
  data: T[];
  columns: ColumnDef<any>[];
};

export default function OperationalEntityDataTable<T>({ label, data, columns }: OperationalEntityDataTableProps<T>) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState("10");
  const [open, setOpen] = useState(false);
  const [entity, setEntity] = useState<Record<string, any>>({});

  const totalPages = Math.max(1, Math.ceil(data.length / +pageSize));
  const paginatedData = useMemo(() => data.slice((page - 1) * +pageSize, page * +pageSize), [data, page, pageSize]);

  const table = useReactTable({
    data: paginatedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <div className="w-full border border-[#ae9956] dark:bg-[#252525]/35 dark:border-[#EDEDED24] rounded-xl shadow-sm overflow-hidden">
        <Table className="w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-[#FFF8E5]">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-[#171721] dark:text-white bg-[#FFF8E5] dark:bg-[#CCA33D] font-semibold px-7 text-sm md:text-base">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => {
                    setEntity(row.original as Record<string, any>);
                    setOpen(true);
                  }}
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
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {data.length > +pageSize && (
          <>
            <hr className="my-2" />
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-2 ">
                <span className="text-sm">
                  Page {page} of {totalPages}
                </span>
                <Select onValueChange={setPageSize} defaultValue={pageSize} value={pageSize}>
                  <SelectTrigger className="shad-select-trigger">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="shad-select-content">
                    {pageSizeOptions.map((pageOptions) => (
                      <SelectItem key={pageOptions.value} value={pageOptions.value as string}>
                        {pageOptions.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="lg2" onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}>
                  Previous
                </Button>
                <Button variant="outline" size="lg2" onClick={() => setPage((prev) => (prev < totalPages ? prev + 1 : prev))} disabled={page >= totalPages}>
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
