import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router";
import { setMenuType } from "@/redux/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getFileUrl } from "@/services/storage";
import { useEffect, useState } from "react";

export const UserButtonCode = ({ position = "justify-between" }: { position?: string }) => {
  const user = useAppSelector((state) => state.auth.userDetails);
  const dispatch = useAppDispatch();

  const getInitials = (surname: string, name: string) => {
    const firstInitial = surname?.trim()?.charAt(0).toUpperCase() || "";
    const lastInitial = name?.trim()?.charAt(0).toUpperCase() || "";
    return firstInitial + lastInitial;
  };

  const userInitials = getInitials(user?.first_name || "", user?.last_name || "");

  const filePath = user.image_url;
  const [fileUrlToUse, setFileUrlToUse] = useState<string>("");

  const handleMenuSwitch = () => {
    dispatch(setMenuType({ data: "personal" }))
  }

  useEffect(() => {
    const updateFileUrl = async () => {
      const fileUrl = await getFileUrl(filePath as string);
      setFileUrlToUse(fileUrl || "");
    };

    if (filePath) {
      updateFileUrl();
    }
  }, [filePath]);

  return (
    <div className={`flex items-center ${position} rounded-md p-2 lg:bg-background`} onClick={handleMenuSwitch}>
      {/* Avatar */}
      <Link to="/profile">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={fileUrlToUse} alt={user?.first_name} />
            <AvatarFallback className="font-semibold uppercase bg-GGP-darkGold text-white">{userInitials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-white md:text-GGP-darkGold font-semibold text-sm">Unique Partner Code:</span>
            <span className="text-base font-normal tracking-tighter dark:max-sm:text-[#344054] dark:text-white text-[#344054]">{user?.unique_code}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};
