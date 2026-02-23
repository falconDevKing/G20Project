import React, { useEffect } from "react";
import { getLoggedInUser } from "@/services/auth";

const AuthProvider = (props: { children: React.ReactElement }) => {
  const { children } = props;

  useEffect(() => {
    const initialize = async () => {
      await getLoggedInUser();
    };

    initialize();
  }, []);

  return <>{children}</>;
};

export default AuthProvider;
