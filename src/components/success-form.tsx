import { CircleCheckBig } from "lucide-react";

interface SuccessFormProps {
  message?: string;
}

export const SuccessForm = ({ message }: SuccessFormProps) => {
  if (!message) return null;

  return (
    <div className=" flex h-12 w-full rounded-sm p-4 items-center bg-emerald-600/15 gap-2">
      <CircleCheckBig className=" text-emerald-600" size={20} />
      <span className=" text-sm text-emerald-600 flex">{message}</span>
    </div>
  );
};
