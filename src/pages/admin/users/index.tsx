import { ContainerFluid } from "@/components/containerFluid";
import { DynamicFilter } from "@/components/dynamicFilters/DynamicFilters";
import AddNewPartner from "@/components/usersPage/AddNewPartner";
import MigrateUserDialog from "@/components/usersPage/MigrateUserDialog";
import UpdateUserDialog from "@/components/usersPage/UpdateUserDialog";
import UserDataTable from "@/components/usersPage/UserDataTable";
import { partnerDetailsOrder } from "@/constants";
import { userColumns } from "@/interfaces/tools";
import { initialiseDataList } from "@/lib/utils";
import { useAppSelector } from "@/redux/hooks";
import { useCallback, useState } from "react";

const Users = () => {
  const appState = useAppSelector((state) => state.app);
  const userDetails = useAppSelector((state) => state.auth.userDetails);

  const permission_type = userDetails.permission_type || "";
  const { modifiedDivisions, modifiedChapters, modifiedShepherds, modifiedGovernors, modifiedPresidents } = initialiseDataList(appState);

  const [openUpdate, setOpenUpdate] = useState(false);
  const [openMigrate, setOpenMigrate] = useState(false);
  const [openNewpartner, setOpenNewpartner] = useState(false);

  const [user, setUser] = useState<Record<string, any>>({});
  const [tableData, setTableData] = useState<Record<string, any>[]>([]);
  const [tableDataCount, setTableDataCount] = useState<number>(1);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState("10");
  const [refreshData, setRefreshData] = useState(1);

  const updateTableData = useCallback((data: Record<string, any>[]) => {
    setTableData(data);
  }, []);
  const updateTableDataCount = useCallback((count: number) => {
    setTableDataCount(count);
  }, []);

  const openUpdateDialog = (userData: Record<string, any>) => {
    setUser(userData);
    setOpenUpdate(true);
  };

  const openMigrateDialog = (userData: Record<string, any>) => {
    setUser(userData);
    setOpenMigrate(true);
  };

  return (
    <div className="">
      <ContainerFluid>
        <div className="flex flex-col lg:flex-row justify-between ">
          <div>
            <h1 className="pt-2 text-lg font-bold md:text-2xl">Honourables Management</h1>
            <div className="mb-6 text-md"> View, manage and update honourables details seamlessly.</div>
          </div>
          <div>
            <AddNewPartner open={openNewpartner} setOpen={setOpenNewpartner} permission_type={permission_type} />
          </div>
        </div>

        <DynamicFilter
          filterType={"Partner"}
          permission_type={permission_type}
          allow={"Admin"}
          updateTableData={updateTableData}
          updateTableDataCount={updateTableDataCount}
          paymentType=""
          page={page}
          setPage={setPage}
          pageSize={pageSize}
          refreshData={refreshData}
          showSearch
          expandable
        />

        <UserDataTable
          data={tableData}
          customText=""
          count={tableDataCount}
          columns={userColumns(
            modifiedDivisions,
            modifiedChapters,
            openMigrateDialog,
            openUpdateDialog,
            modifiedShepherds,
            modifiedGovernors,
            modifiedPresidents,
          )}
          openMigrateDialog={openMigrateDialog}
          openUpdateDialog={openUpdateDialog}
          page={page}
          setPage={setPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
          order={partnerDetailsOrder}
        />
      </ContainerFluid>

      <UpdateUserDialog userData={user} open={openUpdate} setOpen={setOpenUpdate} setUser={setUser} setRefreshData={setRefreshData} />

      <MigrateUserDialog userData={user} open={openMigrate} setOpen={setOpenMigrate} setUser={setUser} setRefreshData={setRefreshData} />
    </div>
  );
};

export default Users;
