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
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { SelectOptions } from "@/interfaces/register";
import { useAppSelector } from "@/redux/hooks";
import { initialiseAdminOptions, initialiseOptions } from "@/lib/utils";
import { SuccessHandler, ErrorHandler } from "@/lib/toastHandlers";
import { GGPCategories, CurrencyCode, CovenantEntry } from "@/constants";
import { camelCaseToNormal } from "@/lib/textUtils";
import { addRep, removeRep, updateMember } from "@/services/users";
import { refreshLoggedInUser } from "@/services/auth";

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
  const { ShepherdOptions, GovernorOptions, PresidentOptions } = initialiseAdminOptions(appState);
  const oldOpsPermissionType = userData.ops_permission_type || "individual";
  const [isPending, setIsPending] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      id: userData?.id || "",
      name: userData?.name || "",
      g20_category: userData?.g20_category || "",
      ops_permission_type: userData?.ops_permission_type || "individual",
      shepherd_id: userData?.shepherd_id || "",
      governor_id: userData?.governor_id || "",
      president_id: userData?.president_id || "",
    },
  });

  const selectedOpsPermission = form.watch("ops_permission_type");

  const onSubmit = async (values: FormValues) => {
    try {
      setIsPending(true);
      const {
        ops_permission_type,
        shepherd_id,
        governor_id,
        president_id,
        g20_category,
        custom_remission_start,
        remission_start_date,
      } = values;

      const selectedGovernor = GovernorOptions.find((option) => option.value === governor_id);
      const selectedPresident = PresidentOptions.find((option) => option.value === president_id);

      const resolvedShepherdId =
        ops_permission_type === "president"
          ? selectedPresident?.shepherd_id || ""
          : ops_permission_type === "governor"
            ? selectedGovernor?.shepherd_id || ""
            : shepherd_id || "";
      const resolvedGovernorId = ops_permission_type === "president" ? selectedPresident?.governor_id || "" : governor_id || "";

      const memberData: Record<string, any> = {
        id: userData.id,
        g20_category,
        remission_start_date: custom_remission_start && remission_start_date ? remission_start_date : userData?.remission_start_date || "",
        assistant: false,
        ops_permission_type: ops_permission_type === "individual" ? null : ops_permission_type,
        shepherd_id: ops_permission_type === "individual" ? null : resolvedShepherdId || null,
        governor_id: ops_permission_type === "governor" || ops_permission_type === "president" ? resolvedGovernorId || null : null,
        president_id: ops_permission_type === "president" ? president_id || null : null,
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
      shepherd_id: userData?.shepherd_id || "",
      governor_id: userData?.governor_id || "",
      president_id: userData?.president_id || "",
      custom_remission_start: !!userData?.remission_start_date,
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

            <div className="rounded-lg border px-3 py-2 text-sm dark:text-white">
              Chapter: {ChapterOptions.find((chapter) => chapter.value === userData?.chapter_id)?.name || "Unassigned"}
            </div>

            <FormField
              control={form.control}
              name="g20_category"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-1">
                    <FormLabel className="text-[#111c30] dark:text-white font-normal text-base">GGP Category</FormLabel>
                    <span className="text-red-500 text-base">*</span>
                  </div>

                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="shad-select-trigger">
                        <SelectValue placeholder="Select your GGP Category" />
                      </SelectTrigger>
                      <SelectContent className="shad-select-content">
                        {Object.entries(
                          GGPCategories[(ChapterOptions.find((chapter) => chapter.value === authUser?.chapter_id)?.currency || "GBP") as CurrencyCode],
                        ).map(([label, options]: [string, CovenantEntry[]]) => {
                          return (
                            <SelectGroup key={label}>
                              <SelectLabel>{camelCaseToNormal(label)}</SelectLabel>
                              {options.map((groupOption) => (
                                <SelectItem key={groupOption.rank} value={groupOption.rank}>
                                  <div className="flex items-center cursor-pointer gap-2 pl-4">{`${groupOption.rank} (${groupOption.amount})`}</div>
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        form.setValue("shepherd_id", "");
                        form.setValue("governor_id", "");
                        form.setValue("president_id", "");
                      }}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="shad-select-trigger">
                        <SelectValue placeholder="Select operational role" />
                      </SelectTrigger>
                      <SelectContent className="shad-select-content">
                        {[
                          { value: "individual", name: "No operational rep role" },
                          { value: "shepherd", name: "Shepherd Rep" },
                          { value: "governor", name: "Governor Rep" },
                          { value: "president", name: "President Rep" },
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

            {selectedOpsPermission === "shepherd" && (
              <FormField
                control={form.control}
                name="shepherd_id"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-1">
                      <FormLabel className="text-[#111c30] dark:text-white font-normal text-base">Shepherd</FormLabel>
                      <span className="text-red-500 text-base">*</span>
                    </div>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <SelectTrigger className="shad-select-trigger">
                          <SelectValue placeholder="Select Shepherd" />
                        </SelectTrigger>
                        <SelectContent className="shad-select-content">
                          {ShepherdOptions.map((option: SelectOptions) => (
                            <SelectItem key={option.value} value={option.value as string}>
                              <p>{option.name}</p>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {selectedOpsPermission === "governor" && (
              <FormField
                control={form.control}
                name="governor_id"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-1">
                      <FormLabel className="text-[#111c30] dark:text-white font-normal text-base">Governor</FormLabel>
                      <span className="text-red-500 text-base">*</span>
                    </div>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <SelectTrigger className="shad-select-trigger">
                          <SelectValue placeholder="Select Governor" />
                        </SelectTrigger>
                        <SelectContent className="shad-select-content">
                          {GovernorOptions.map((option: any) => (
                            <SelectItem key={option.value} value={option.value}>
                              <p>{option.name}</p>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {selectedOpsPermission === "president" && (
              <FormField
                control={form.control}
                name="president_id"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-1">
                      <FormLabel className="text-[#111c30] dark:text-white font-normal text-base">President</FormLabel>
                      <span className="text-red-500 text-base">*</span>
                    </div>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <SelectTrigger className="shad-select-trigger">
                          <SelectValue placeholder="Select President" />
                        </SelectTrigger>
                        <SelectContent className="shad-select-content">
                          {PresidentOptions.map((option: any) => (
                            <SelectItem key={option.value} value={option.value}>
                              <p>{option.name}</p>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
