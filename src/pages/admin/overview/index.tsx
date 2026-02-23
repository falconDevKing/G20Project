// import { useAppDispatch } from "@/redux/hooks";
// import { useEffect } from "react";
// import { getAdminPayments } from "@/redux/paymentSlice";
import { ContainerFluid } from "@/components/containerFluid";
import OverviewPage from "@/components/overview/OverviewPage";

// TODO: check that buttons have loading state

const Overview = () => {
  // const dispatch = useAppDispatch();

  // useEffect(() => {
  //   dispatch(getAdminPayments());
  // }, [dispatch]);

  return (
    <ContainerFluid>
      <OverviewPage />
    </ContainerFluid>
  );
};

export default Overview;
