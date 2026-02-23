import { partnerDetailsOrder } from "@/constants";
import { HoGUserColumns } from "@/interfaces/tools";
import { initialiseDataList } from "@/lib/utils";
import { useAppSelector } from "@/redux/hooks";
import { useCallback, useState } from "react";
import Logo from "../../assets/G20_logo.png";

import HoGUpdateUserDialog from "./hopUserUpdate";
import HoGUserDataTable from "./hogUsersTable";
import { DynamicFilter } from "@/components/dynamicFilters/DynamicFilters";
import { ContainerFluid } from "@/components/containerFluid";


const G20Users = () => {
  const appState = useAppSelector((state) => state.app);
  const userDetails = useAppSelector((state) => state.auth.userDetails);

  const permission_type = userDetails.permission_type || "";
  const { modifiedDivisions } = initialiseDataList(appState);

  const [openUpdate, setOpenUpdate] = useState(false);

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

  return (
    <div className="p-12 text-white">
      <ContainerFluid>
        <div>
          <img src={Logo} alt="Logo" width="100" height="100" className="mx-auto" />
        </div>
        <div className="flex flex-col lg:flex-row justify-between text-white ">
          <div>
            <h1 className="pt-2 text-lg font-bold md:text-2xl">G20 Partner Management</h1>
            <div className="mb-6 text-md"> View, manage and update partner details seamlessly.</div>
          </div>
          {/* <div>
            <AddNewPartner open={openNewpartner} setOpen={setOpenNewpartner} permission_type={permission_type} />
          </div> */}
        </div>

        <div className="flex flex-col md:flex-row justify-end">
          <DynamicFilter
            filterType={"G20_Partner"}
            permission_type={"organisation"}
            allow={"Admin"}
            updateTableData={updateTableData}
            updateTableDataCount={updateTableDataCount}
            paymentType=""
            page={page}
            setPage={setPage}
            pageSize={pageSize}
            refreshData={refreshData}
            showSearch={true}
          />
        </div>
        <HoGUserDataTable
          data={tableData}
          customText=""
          count={tableDataCount}
          columns={HoGUserColumns(modifiedDivisions, openUpdateDialog)}
          openUpdateDialog={openUpdateDialog}
          page={page}
          setPage={setPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
          order={partnerDetailsOrder}
        />
      </ContainerFluid>
      <HoGUpdateUserDialog
        userData={user}
        open={openUpdate}
        setOpen={setOpenUpdate}
        setUser={setUser}
        permission_type={permission_type}
        setRefreshData={setRefreshData}
      />
    </div>
  );
};

export default G20Users;
