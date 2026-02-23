import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// import { menuItems } from "../constants/index";
import { LogoutButton } from "./forms/logout-button";
// import { Link, useLocation } from "react-router-dom";
import { setMenuType } from "@/redux/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getFileUrl } from "@/services/storage";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export const UserButton = () => {
  const user = useAppSelector((state) => state.auth.userDetails);
  const dispatch = useAppDispatch();

  // const [isOpen, setIsOpen] = useState(false);

  // const location = useLocation();

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
    // <DropdownMenu onOpenChange={(open) => setIsOpen(open)}>
    //   <DropdownMenuTrigger asChild>
    //     <div className="flex items-center gap-x-2  cursor-pointer">
    //       <Avatar className="border-[0.5px] bg-GGP-darkGold max-sm:bg-white">
    //         <AvatarImage className="object-cover" src={fileUrlToUse} />
    //         <AvatarFallback className="font-semibold uppercase max-sm:text-GGP-darkGold text-lg bg-blue-1 text-white">{userInitials}</AvatarFallback>
    //       </Avatar>

    //       <div className="text-GGP-darkGold hidden md:flex items-center justify-between gap-1 font-medium">
    //         <div className=" flex flex-col">
    //         {user?.first_name} {user?.last_name}
    //       <span className=" text-[10px] text-white font-normal">{user.email}</span>
    //         </div>
    //         {/* {isOpen ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />} */}
    //          <LogoutButton>
    //         <LogOut className="h-5 w-5 text-white" />
    //     </LogoutButton>
    //       </div>
    //     </div>
    //   </DropdownMenuTrigger>

    //   <DropdownMenuContent className="w-48 shadow-md border rounded-md p-2" align="end">
    //     {(() => {
    //       const filteredItems = menuItems.filter((item) => item.route !== "/profile" || location.pathname !== "/profile");

    //       return filteredItems.map((item, index) => (
    //         <div key={item.name}>
    //           <DropdownMenuItem asChild>
    //             <Link to={item.route} className="flex w-full items-center gap-2 px-2 py-2">
    //               <item.icon className="h-5 w-5 text-gray-600" />
    //               <span>{item.name}</span>
    //             </Link>
    //           </DropdownMenuItem>
    //           {index < filteredItems.length - 1 && <DropdownMenuSeparator />}
    //         </div>
    //       ));
    //     })()}

    //     <DropdownMenuSeparator />

    //     {/* <LogoutButton>
    //       <DropdownMenuItem className="flex items-center gap-2 text-red-500 cursor-pointer">
    //         <LogOut className="h-5 w-5" />
    //         <span>Log Out</span>
    //       </DropdownMenuItem>
    //     </LogoutButton> */}
    //   </DropdownMenuContent>
    // </DropdownMenu>

    <div className="flex items-center justify-between rounded-md" onClick={handleMenuSwitch}>
      {/* Avatar */}
      <div className="flex items-center gap-3 cursor-pointer">
        <Link to="/profile">
          <Avatar className="h-10 w-10 border border-gray-300">
            <AvatarImage src={fileUrlToUse} alt={user?.first_name} />
            <AvatarFallback className="font-semibold uppercase bg-GGP-darkGold text-white">{userInitials}</AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex flex-col">
          <span className="text-GGP-darkGold font-semibold text-sm">
            {user?.first_name} {user?.last_name}
          </span>
          <span className="text-xs tracking-tighter text-gray-300">{user?.email}</span>
        </div>
      </div>

      {/* Logout Icon */}
      <Tooltip delayDuration={300}>
        <TooltipTrigger  >
          <LogoutButton>
            <LogOut className="h-5 w-5 text-white cursor-pointer hover:text-GGP-darkGold" />
          </LogoutButton>
        </TooltipTrigger>
        <TooltipContent>Log Out</TooltipContent>
      </Tooltip>
    </div>
  );
};
