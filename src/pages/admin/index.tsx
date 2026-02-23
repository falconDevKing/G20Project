import { UserPaymentHistory } from "@/components/user-payment-history";
import { useAppDispatch } from "@/redux/hooks";
import { useEffect } from "react";
import { getUserPayments } from "@/redux/paymentSlice";

const Home = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getUserPayments());
  }, [dispatch]);

  return <UserPaymentHistory />;
};

export default Home;
