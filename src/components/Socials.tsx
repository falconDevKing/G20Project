import { dummyFunction } from "@/interfaces/tools";
import { Button } from "./ui/button";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export const Socials = () => {
  const onClick = (provider: "google" | "github") => {
    dummyFunction(provider)

  };

  return (
    <div className=" flex gap-x-4 w-full items-center">
      <Button onClick={() => onClick("google")} variant="outline" size="lg" className=" w-full">
        <FcGoogle className=" h-5 w-5" />
      </Button>

      <Button onClick={() => onClick("github")} variant="outline" size="lg" className=" w-full">
        <FaGithub className=" h-5 w-5" />
      </Button>
    </div>
  );
};
