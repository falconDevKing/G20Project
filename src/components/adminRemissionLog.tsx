import { adminColumns, paymentDetailsOrder } from "@/constants";
import { ContainerFluid } from "./containerFluid";
import DataTable from "./paymentHistoryTable/table";
import { useAppSelector } from "@/redux/hooks";
import { initialiseDataList } from "@/lib/utils";
import { useState } from "react";
import { PaymentRowType } from "@/supabase/modifiedSupabaseTypes";
import { DynamicFilter } from "./dynamicFilters/DynamicFilters";

export const AdminRemissionLog = () => {
  const appState = useAppSelector((state) => state.app);
  const permission_type = useAppSelector((state) => state.auth.userDetails.permission_type);
  const { modifiedChapters } = initialiseDataList(appState);
  const [tableData, setTableData] = useState<PaymentRowType[]>([]);
  const [tableDataCount, setTableDataCount] = useState<number>(1);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState("10");
  const [refreshData, setRefreshData] = useState(1);

  const updateTableData = (data: Record<string, any>[]) => {
    setTableData(data as PaymentRowType[]);
  };
  const updateTableDataCount = (count: number) => {
    setTableDataCount(count);
  };

  return (
    <section className=" ">
      <ContainerFluid>
        <div className="pt-2 text-2xl lg:text-3xl font-bold"> Pending Remission Log</div>
        <div className="mb-4 text-md text-base dark:text-white text-GGP-dark/75 "> View, manage and approve remissions seamlessly.</div>

        <DynamicFilter
          filterType={"Payment"}
          allow={"Admin"}
          updateTableData={updateTableData}
          updateTableDataCount={updateTableDataCount}
          paymentType={"pendingRemissions"}
          page={page}
          setPage={setPage}
          pageSize={pageSize}
          refreshData={refreshData}
          permission_type={permission_type}
          showSearch
          expandable
        />

        <DataTable
          count={tableDataCount}
          // customText="Remission Log"
          columns={adminColumns(modifiedChapters)}
          data={tableData}
          page={page}
          setPage={setPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
          tableType={"pendingRemissions"}
          order={paymentDetailsOrder}
          setRefreshData={setRefreshData}
        />
      </ContainerFluid>
    </section>
  );
};
