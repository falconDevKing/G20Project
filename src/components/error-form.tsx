import { TriangleAlert } from "lucide-react";

interface ErrorFormProps {
  message?: string;
}

export const ErrorForm = ({ message }: ErrorFormProps) => {
  if (!message) return null;

  return (
    <div className=" flex h-12 w-full rounded-sm p-4 items-center bg-red-600/15 gap-2">
      <TriangleAlert className=" text-red-600" size={20} />
      <span className=" text-sm text-red-600 flex">{message}</span>
    </div>
  );
};
