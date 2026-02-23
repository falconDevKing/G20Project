import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "@/components/ui/switch";
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
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { updateUserSchema } from "@/lib/toolsSchemas";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { SelectOptions } from "@/interfaces/register";
import { useAppSelector } from "@/redux/hooks";
import { initialiseOptions, isLowerAdminPermission, PermissionAssistantOptions, PermissionOptions, PermissionType, RemissionDayOptions } from "@/lib/utils";
import { SuccessHandler, ErrorHandler } from "@/lib/toastHandlers";
import { GGPCategories, CurrencyCode, CovenantEntry } from "@/constants";
import { camelCaseToNormal } from "@/lib/textUtils";
import { addRep, removeRep, updateMember } from "@/services/users";
import { refreshLoggedInUser } from "@/services/auth";
import DatePicker from "react-datepicker";
import dayjs from "dayjs";

type FormValues = z.infer<typeof updateUserSchema>;

type EditUserProps = {
  open: boolean;
  userData: Record<string, any>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setUser: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  permission_type: string;
  setRefreshData?: React.Dispatch<React.SetStateAction<number>>;
};

export default function UpdateUserDialog({ userData, open, setOpen, setUser, permission_type, setRefreshData }: EditUserProps) {
  const appState = useAppSelector((state) => state.app);
  const authUser = useAppSelector((state) => state.auth.userDetails);
  const oldAdminAssistant = !!authUser.assistant;

  const { ChapterOptions } = initialiseOptions(appState);


  const filteredPermissionOptions = [...PermissionOptions.filter((option) => option.allow.includes(permission_type)), ...PermissionAssistantOptions.filter(assistant => assistant.value.includes(permission_type))]

  const oldPermissionType = userData.permission_type;
  const oldUserAssistant = !!userData.assistant;
  // const [entity, setUser] = useState<Record<string, any>>({});
  const [isPending, setIsPending] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      id: userData?.id || "",
      name: userData?.name || "",
      chapter_id: userData?.chapter_id || "",
      permission_type: userData?.permission_type || "",
      ggp_category: userData?.ggp_category || "",
      preferred_remission_day: userData?.preferred_remission_day || "",
      custom_remission_start: !!userData?.remission_start_date || false,
      remission_start_date: userData?.remission_start_date || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof updateUserSchema>) => {
    try {
      setIsPending(true);
      const { permission_type: new_user_permission_type, ggp_category, custom_remission_start, remission_start_date, preferred_remission_day } = values;
      const [new_user_permission, assistant] = new_user_permission_type.split(" ")

      const memberData: Record<"preferred_remission_day" | string, any> = {
        id: userData.id,
        permission_type: new_user_permission,
        ggp_category,
        remission_start_date: custom_remission_start && remission_start_date ? remission_start_date : userData?.remission_start_date || "",
        assistant: assistant === 'assistant',
      };

      if (preferred_remission_day) {
        memberData.preferred_remission_day = +preferred_remission_day
      }

      if (new_user_permission !== oldPermissionType && !isLowerAdminPermission(oldPermissionType, permission_type as PermissionType, oldUserAssistant, oldAdminAssistant)) {
        ErrorHandler('Cant Update Higher Admin Permission')
        throw new Error('Cant Update Higher Admin Permission')
      }

      await updateMember(memberData);

      if (oldPermissionType !== permission_type) {
        await removeRep(userData, oldPermissionType);
        await addRep(userData, new_user_permission);
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
    form.reset({ ...userData, custom_remission_start: !!userData?.remission_start_date });
  }, [userData]);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {/* <AlertDialogTrigger asChild>
        <div className=" mt-4 flex justify-end w-full">
          <Button variant={"outline2"} size={"lg2"} className="mb-4 w-full border-[#304ddb] md:w-fit">
            {" "}
            <Plus className="text-[#304ddb]" /> Add New {label}
          </Button>
        </div>
      </AlertDialogTrigger> */}

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
                  <FormLabel className="capitalize text-gray-600/90 dark:text-white font-normal text-base">Name</FormLabel>
                  <FormControl>
                    <Input className="focus-visible:ring-0 dark:text-white focus-visible:ring-offset-0" placeholder={`Enter name`} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="chapter_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-600/90 dark:text-white font-normal text-base">Chapter</FormLabel>
                  <FormControl>
                    <Select disabled onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <SelectTrigger className="shad-select-trigger">
                        <SelectValue placeholder="Select your chapter" />
                      </SelectTrigger>
                      <SelectContent className="shad-select-content">
                        {ChapterOptions.map((chapter: SelectOptions) => (
                          <SelectItem key={chapter.value} value={chapter.value as unknown as string}>
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

            <FormField
              control={form.control}
              name="ggp_category"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-1">
                    <FormLabel className="text-gray-600/90 dark:text-white font-normal text-base">GGP Category</FormLabel>
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

            <div className="my-2 flex flex-col sm:flex-row gap-4 w-full">
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="permission_type"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-1">
                        <FormLabel className="text-gray-600/90 dark:text-white font-normal text-base">Permission Type</FormLabel>
                        <span className="text-red-500 text-base">*</span>
                      </div>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger className="shad-select-trigger">
                            <SelectValue placeholder="Select the Country" />
                          </SelectTrigger>
                          <SelectContent className="shad-select-content">
                            {filteredPermissionOptions.map((permissionOption) => (
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

              </div>


              <div className="w-full">


                <FormField
                  control={form.control}
                  name="preferred_remission_day"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-1">
                        <FormLabel className="text-gray-600/90 dark:text-white font-normal text-base">Preferred Remission Day</FormLabel>
                      </div>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value || ""}>
                          <SelectTrigger className="shad-select-trigger">
                            <SelectValue placeholder="Select the Country" />
                          </SelectTrigger>
                          <SelectContent className="shad-select-content">
                            {RemissionDayOptions.map((remissionDayOption) => (
                              <SelectItem key={remissionDayOption} value={remissionDayOption}>
                                <div className="flex items-center cursor-pointer gap-3">
                                  <p>{remissionDayOption}</p>
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
            </div>

            <div className="bg-secondary p-3 rounded-xl my-1">
              <FormField
                control={form.control}
                name="custom_remission_start"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border py-1 px-3 shadow-sm m-1">
                    <div className="space-y-0.5">
                      <FormLabel className=" dark:text-white">New Partner Remission Start Date</FormLabel>
                      <FormDescription className=" dark:text-white">Date when this partner joined and started making remission.</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} className=" data-[state=checked]:bg-GGP-darkGold" />
                    </FormControl>
                  </FormItem>
                )}
              />

              {form.watch("custom_remission_start") && (
                <div className=" lg:grid gap-2 space-y-3 md:space-y-0">
                  <FormField
                    control={form.control}
                    name="remission_start_date"
                    render={({ field }) => (
                      <FormItem>
                        {/* <FormLabel className="text-gray-600/90 font-normal text-base">Remission Start Date</FormLabel> */}
                        <FormControl>
                          <div className="flex rounded-md border border-gray-500/20 items-center dark:text-white px-2 dark:bg-transparent bg-white">
                            <img className="mr-2" src="/icons/calendar.svg" height={24} width={24} alt="Calendar" />
                            <DatePicker
                              selected={field.value ? new Date(field.value) : null} // Convert string to Date
                              onChange={(date) => field.onChange(date ? dayjs(date).add(6, "hours").toISOString().split("T")[0] + "T12:00:00.000Z" : "")} // Convert Date back to string
                              placeholderText="Select the Remission Start Date"
                              dateFormat="MMMM yyyy"
                              showMonthYearPicker
                              showFourColumnMonthYearPicker
                              showYearDropdown
                              dropdownMode="select"
                              wrapperClassName="date-picker w-full"
                              className="border-0 outline-none bg w-full py-4"
                              minDate={new Date(new Date().getFullYear(), 0, 1)}
                              maxDate={new Date()}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>

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
