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
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { migrateUserSchema } from "@/lib/toolsSchemas";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { SelectOptions } from "@/interfaces/register";
import { useAppSelector } from "@/redux/hooks";
import { initialiseAdminOptions } from "@/lib/utils";
import { SuccessHandler, ErrorHandler } from "@/lib/toastHandlers";
import { removeRep, updateMember } from "@/services/users";
import { refreshLoggedInUser } from "@/services/auth";

type FormValues = z.infer<typeof migrateUserSchema>;

type EditUserProps = {
  open: boolean;
  userData: Record<string, any>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setUser: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  setRefreshData?: React.Dispatch<React.SetStateAction<number>>;
};

export default function MigrateUserDialog({ userData, open, setOpen, setUser, setRefreshData }: EditUserProps) {
  const appState = useAppSelector((state) => state.app);
  const authUser = useAppSelector((state) => state.auth.userDetails);
  const { ShepherdOptions, GovernorOptions, PresidentOptions } = initialiseAdminOptions(appState);
  const [isPending, setIsPending] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(migrateUserSchema),
    defaultValues: {
      id: userData?.id || "",
      name: userData?.name || "",
      shepherd_id: userData?.shepherd_id || "",
      governor_id: userData?.governor_id || "",
      president_id: userData?.president_id || "",
    },
  });

  const selectedShepherdId = form.watch("shepherd_id");
  const selectedGovernorId = form.watch("governor_id");

  const filteredGovernorOptions = GovernorOptions.filter((governor) => governor.shepherd_id === selectedShepherdId);
  const filteredPresidentOptions = PresidentOptions.filter(
    (president) => president.shepherd_id === selectedShepherdId && president.governor_id === selectedGovernorId
  );

  const onSubmit = async (values: FormValues) => {
    try {
      setIsPending(true);

      const memberData = {
        id: userData.id,
        shepherd_id: values.shepherd_id,
        governor_id: values.governor_id,
        president_id: values.president_id,
        ops_permission_type: null,
      };

      await updateMember(memberData);
      await removeRep(userData, userData.ops_permission_type || "");

      if (authUser.id === userData.id) {
        await refreshLoggedInUser(authUser.id || "");
      }

      SuccessHandler(`User migrated successfully`);
      setRefreshData && setRefreshData((prev) => prev + 1);
      form.reset();
      setUser({});
      setOpen(false);
    } catch (error) {
      console.log("update entity error", error);
      ErrorHandler(`Sorry we couldn't migrate this user`);
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    form.reset({
      id: userData?.id || "",
      name: userData?.name || "",
      shepherd_id: userData?.shepherd_id || "",
      governor_id: userData?.governor_id || "",
      president_id: userData?.president_id || "",
    });
  }, [form, userData]);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className=" bg-white dark:bg-[#1E1E1E] p-6">
        <AlertDialogHeader>
          <AlertDialogTitle className="dark:text-white ">Migrate Partner</AlertDialogTitle>
          <AlertDialogDescription className="">Assign this partner to a President...</AlertDialogDescription>
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
                  <FormLabel className="capitalize text-[#111c30] font-normal dark:text-white text-base">Name</FormLabel>
                  <FormControl>
                    <Input className="focus-visible:ring-0 dark:text-white  focus-visible:ring-offset-0" placeholder={`Enter name`} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        form.setValue("governor_id", "");
                        form.setValue("president_id", "");
                      }}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <SelectTrigger className="shad-select-trigger">
                        <SelectValue placeholder="Select Shepherd" />
                      </SelectTrigger>
                      <SelectContent className="shad-select-content">
                        {ShepherdOptions.map((shepherd: SelectOptions) => (
                          <SelectItem key={shepherd.value} value={shepherd.value as unknown as string}>
                            <div className="flex items-center cursor-pointer gap-3">
                              <p>{shepherd.name}</p>
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
              name="governor_id"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-1">
                    <FormLabel className="text-[#111c30] dark:text-white font-normal text-base">Governor</FormLabel>
                    <span className="text-red-500 text-base">*</span>
                  </div>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        form.setValue("president_id", "");
                      }}
                      defaultValue={field.value}
                      value={field.value}
                      disabled={!selectedShepherdId}
                    >
                      <SelectTrigger className="shad-select-trigger">
                        <SelectValue placeholder={selectedShepherdId ? "Select Governor" : "Select Shepherd first"} />
                      </SelectTrigger>
                      <SelectContent className="shad-select-content">
                        {filteredGovernorOptions.map((governor: SelectOptions) => (
                          <SelectItem key={governor.value} value={governor.value as unknown as string}>
                            <div className="flex items-center cursor-pointer gap-3">
                              <p>{governor.name}</p>
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
              name="president_id"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-1">
                    <FormLabel className="text-[#111c30] dark:text-white  font-normal text-base">President</FormLabel>
                    <span className="text-red-500 text-base">*</span>
                  </div>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value} disabled={!selectedGovernorId}>
                      <SelectTrigger className="shad-select-trigger">
                        <SelectValue placeholder={selectedGovernorId ? "Select President" : "Select Governor first"} />
                      </SelectTrigger>
                      <SelectContent className="shad-select-content">
                        {filteredPresidentOptions.map((president: SelectOptions) => (
                          <SelectItem key={president.value} value={president.value as unknown as string}>
                            <div className="flex items-center cursor-pointer gap-3">
                              <p>{president.name}</p>
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

            <AlertDialogFooter>
              <AlertDialogCancel className="h-11 rounded-md px-8 dark:text-white " type="button">
                Cancel
              </AlertDialogCancel>
              <Button size={"lg"} variant={"custom"} type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Migrate"}
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
