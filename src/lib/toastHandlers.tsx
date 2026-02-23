import toast from "react-hot-toast";
import { Info, Loader2 } from "lucide-react";

export const ErrorHandler = (message?: string) => {
  if (message) {
    toast.error(message);
    //   , {
    //   style: {
    //     background: "Red",
    //     color: "#fff",
    //   },
    // });
  } else {
    return toast.error("An error occurred");
  }
};

export const SuccessHandler = (message?: string) => {
  if (message) {
    toast.success(message);
  } else {
    toast.success("Successful");
  }
};

export const LoadingHandler = (message?: string) => {
  if (message) {
    toast.loading(message, { duration: 3000 });
  } else {
    toast.loading("Processing...");
  }
};

// t.visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2",

export const InfoHandler = (message?: string) =>
  toast.custom(
    <div
      className={[
        "flex items-center gap-3 rounded-lg border px-4 py-3 shadow-lg",
        "bg-white text-gray-800 border-gray-200",
        "dark:bg-neutral-900 dark:text-gray-100 dark:border-neutral-800",
        "transition-all duration-200",
      ].join(" ")}
    >
      {message ? <Info className="h-5 w-5 text-blue-500" aria-hidden /> : <Loader2 className="h-5 w-5 animate-spin" aria-hidden />}
      <span className="text-sm font-medium">{message ?? "Processing..."}</span>
    </div>,
    { duration: 2000 },
  );

// export const InfoHandler = (message?: string) => {
//   if (message) {
//     toast.custom(message, { duration: 3000 });
//   } else {
//     toast.custom("Processing...");
//   }
// };

export const DismissHandler = () => {
  toast.dismiss();
};
