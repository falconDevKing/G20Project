import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { useNavigate } from "react-router";
import { logOutUser } from "@/services/auth";

interface LogoutButtonProp {
  children?: ReactNode;
  className?: string;
}

export const LogoutButton = ({ children, className }: LogoutButtonProp) => {
  const navigate = useNavigate();

  const onClick = async () => {
    await logOutUser();

    navigate(`/login`);
    // navigate(`/`);
  };

  return (
    <span onClick={onClick} className={cn(className || "cursor-pointer")}>
      {children}
    </span>
  );
};
