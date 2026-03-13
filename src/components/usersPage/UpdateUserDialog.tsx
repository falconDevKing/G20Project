import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { updateUserSchema } from "@/lib/toolsSchemas";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { SelectOptions } from "@/interfaces/register";
import { useAppSelector } from "@/redux/hooks";
import { initialiseOptions } from "@/lib/utils";
import { SuccessHandler, ErrorHandler } from "@/lib/toastHandlers";
import { G20Categories } from "@/constants";
import { addRep, removeRep, updateMember } from "@/services/users";
import { refreshLoggedInUser } from "@/services/auth";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";

type FormValues = z.infer<typeof updateUserSchema>;

type EditUserProps = {
  open: boolean;
  userData: Record<string, any>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setUser: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  setRefreshData?: React.Dispatch<React.SetStateAction<number>>;
};

export default function UpdateUserDialog({ userData, open, setOpen, setUser, setRefreshData }: EditUserProps) {
  const appState = useAppSelector((state) => state.app);
  const authUser = useAppSelector((state) => state.auth.userDetails);
  const { ChapterOptions } = initialiseOptions(appState);
  const oldOpsPermissionType = userData.ops_permission_type || "individual";
  const [isPending, setIsPending] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      id: userData?.id || "",
      name: userData?.name || "",
      chapter_id: userData?.chapter_id || "",
      g20_category: userData?.g20_category || "",
      g20_amount: userData?.g20_amount || 0,
      ops_permission_type: userData?.ops_permission_type || "individual",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setIsPending(true);
      const { ops_permission_type, g20_category, g20_amount } = values;

      const memberData: Record<string, any> = {
        id: userData.id,
        g20_category,
        g20_amount,
        assistant: false,
        ops_permission_type: ops_permission_type === "individual" ? null : ops_permission_type,
      };

      await updateMember(memberData);

      if (oldOpsPermissionType !== ops_permission_type) {
        await removeRep(userData, oldOpsPermissionType);
        await addRep({ ...userData, ...memberData }, ops_permission_type);
      }

      SuccessHandler(`User updated successfully`);

      if (authUser.id === userData.id) {
        await refreshLoggedInUser(authUser.id || "");
      }

      setRefreshData && setRefreshData((prev) => prev + 1);

      form.reset();
      setUser({});
      setOpen(false);
    } catch (error) {
      console.log("update user error", error);
      ErrorHandler(`Sorry we couldn't update this User`);
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    form.reset({
      ...userData,
      ops_permission_type: userData?.ops_permission_type || "individual",
    });
  }, [form, userData]);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className=" bg-white dark:bg-[#1E1E1E] p-6">
        <AlertDialogHeader>
          <AlertDialogTitle className=" dark:text-white">Update User</AlertDialogTitle>
          <AlertDialogDescription className="">Fill in the details...</AlertDialogDescription>
        </AlertDialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="md:grid grid-cols-2 gap-3">
              <FormField
                key={"name"}
                control={form.control}
                name={"name"}
                disabled
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="capitalize text-[#111c30] dark:text-white font-normal text-base">Name</FormLabel>
                    <FormControl>
                      <Input className="focus-visible:ring-0 dark:text-white focus-visible:ring-offset-0" placeholder={`Enter name`} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                disabled
                control={form.control}
                name="chapter_id"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-1">
                      <FormLabel className="text-gray-700/90 dark:text-gray-300/90 font-normal text-base">Chapter</FormLabel>
                      <span className="text-red-500 text-base">*</span>
                    </div>
                    <FormControl>
                      <Select disabled onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="shad-select-trigger">
                          <SelectValue placeholder="Select your Chapter" />
                        </SelectTrigger>
                        <SelectContent className="shad-select-content">
                          {ChapterOptions.map((chapter: SelectOptions) => (
                            <SelectItem key={chapter.value} value={chapter.value as string}>
                              <div className="flex items-center cursor-pointer gap-3">
                                <p>{chapter.name}</p>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="md:grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="g20_category"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-1">
                      <FormLabel className="text-[#111c30] dark:text-white font-normal text-base">G20 Category</FormLabel>
                      <span className="text-red-500 text-base">*</span>
                    </div>

                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="shad-select-trigger">
                          <SelectValue placeholder="Select your GGP Category" />
                        </SelectTrigger>
                        <SelectContent className="shad-select-content">
                          {G20Categories.map((G20CategoryOption: SelectOptions) => (
                            <SelectItem key={G20CategoryOption.value} value={G20CategoryOption.value as unknown as string}>
                              <div className="flex items-center cursor-pointer gap-3">
                                <p>{G20CategoryOption.name}</p>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="g20_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700/90 dark:text-gray-300/90 font-normal text-base">G20 Amount</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} step={1} className="focus-visible:ring-0 focus-visible:ring-offset-0 dark:border-white/50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {userData?.president_id ? (
              <FormField
                control={form.control}
                name="ops_permission_type"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-1">
                      <FormLabel className="text-[#111c30] dark:text-white font-normal text-base">Operational Role</FormLabel>
                      <span className="text-red-500 text-base">*</span>
                    </div>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="shad-select-trigger">
                          <SelectValue placeholder="Select operational role" />
                        </SelectTrigger>
                        <SelectContent className="shad-select-content">
                          {[
                            { value: "individual", name: "No operational rep role" },
                            { value: "shepherd", name: "Shepherd" },
                            { value: "governor", name: "Governor" },
                            { value: "president", name: "President" },
                          ].map((permissionOption) => (
                            <SelectItem key={permissionOption.value} value={permissionOption.value}>
                              <div className="flex items-center cursor-pointer gap-3">
                                <p>{permissionOption.name}</p>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <div className="dark:text-white">
                <div>User has not been assigned to a house</div>
                <Link
                  to={"/operational-assignments"}
                  className="max-w-fit gap-1 hidden md:flex items-center text-sm font-normal my-4 bg-GGP-lightWight text-GGP-dark p-2 rounded-md"
                >
                  Go to Assignment Page
                  <ArrowRight className=" h-4 w-4" />
                </Link>
              </div>
            )}

            <AlertDialogFooter>
              <AlertDialogCancel className="h-11 dark:text-white rounded-md px-8" type="button">
                Cancel
              </AlertDialogCancel>
              <Button size={"lg"} variant={"custom"} type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Update"}
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
