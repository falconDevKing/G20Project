import { useAppDispatch } from "@/redux/hooks";
import { useEffect } from "react";
import { getUserPayments } from "@/redux/paymentSlice";
import DashboardCom from "@/components/dashboard/dashboardPage";

// TODO: check that buttons have loading state

const Dashboard = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getUserPayments());
  }, [dispatch]);

  return <DashboardCom />;
};

export default Dashboard;
