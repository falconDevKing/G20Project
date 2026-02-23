import React, { JSX } from "react";
import { useAppSelector } from "@/redux/hooks";
import { useNavigate, useLocation } from "react-router-dom";
// import { logOutUser } from "@/services/auth";

const AuthGuard = (props: { children: React.ReactElement }): JSX.Element => {
  const { children } = props;
  const auth = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location?.pathname;

  if (!auth.authenticated) {
    const url = pathname && !pathname.includes("/login") ? `/login?redirectTo=${pathname}` : "/login";
    // const url = pathname && !pathname.includes("/login") ? `/login?redirectTo=${pathname}` : "/";
    navigate(url);
  }

  return children;
};

export default AuthGuard;
