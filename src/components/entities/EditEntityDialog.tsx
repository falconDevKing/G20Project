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
import {
  createDivisionSchema,
  createChapterSchema,
  createGovernorSchema,
  createHoSSchema,
  createPresidentSchema,
  genericToolsSchema,
} from "@/lib/toolsSchemas";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { SelectOptions } from "@/interfaces/register";
import { useAppSelector } from "@/redux/hooks";
import { initialiseOptions } from "@/lib/utils";
import { Countries } from "../../constants/index";
import { WorldCurrenciesOptions } from "../../constants/currencies";
import { updateEntity } from "@/services/tools";
import { SuccessHandler, ErrorHandler } from "@/lib/toastHandlers";
import { refreshLoggedInUser } from "@/services/auth";
import { triggerChapterMembersMigration } from "@/services/triggerChapterMembersMigration";
import { PartnerSearchSelect } from "./PartnerSearchSelect";
import { fetchUsersByEntity } from "@/services/appData";

type FormValues = z.infer<typeof genericToolsSchema>;

type EditEntityProps = {
  open: boolean;
  label: string;
  entityData: Record<string, any>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setEntity: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  // fields: (keyof FormValues)[];
  // onAdd: (val: FormValues) => Promise<void> | void;
};

export default function EditItemDialog({ label, entityData, open, setOpen, setEntity }: EditEntityProps) {
  const userId = useAppSelector((state) => state.auth.user_id);
  const appState = useAppSelector((state) => state.app);
  const { DivisionOptions } = initialiseOptions(appState);
  const HoSOptions = (appState.hosEntities || []).map((hos) => ({ value: hos.id, name: hos.name }));
  const GovernorOptions = (appState.governorEntities || []).map((governor) => ({ value: governor.id, name: governor.name, hos_id: governor.hos_id || "" }));

  // const [entity, setEntity] = useState<Record<string, any>>({});
  const [isPending, setIsPending] = useState(false);

  const schemaOptions = {
    Chapter: createChapterSchema,

    Division: createDivisionSchema,
    HoS: createHoSSchema,
    Governor: createGovernorSchema,
    President: createPresidentSchema,
  };

  const schemaToUse = schemaOptions[label as keyof typeof schemaOptions] || genericToolsSchema;

  const form = useForm<FormValues>({
    resolver: zodResolver(schemaToUse),
    defaultValues: {
      id: entityData?.id || "",
      name: entityData?.name || "",
      division_id: entityData?.division_id || "",
      hos_id: entityData?.hos_id || "",
      governor_id: entityData?.governor_id || "",
      country: entityData?.country || "",
      base_currency: entityData?.base_currency || "",
      rep_partner_id: entityData?.rep_partner_id || "",
    },
  });
  const selectedHoS = form.watch("hos_id");
  const selectedGovernor = form.watch("governor_id");

  const onSubmit = async () => {
    try {
      setIsPending(true);
      const values = form.watch();
      const { id, division_id } = values;
      await updateEntity(label, values);
      if (id && division_id && entityData.division_id !== division_id) {
        const params = {
          chapterId: id,
          newDivisionId: division_id,
          loop: true,
          nextToken: null,
        };

        await triggerChapterMembersMigration(params);
      }
      await refreshLoggedInUser(userId);
      await fetchUsersByEntity();
      form.reset();
      setEntity({});

      SuccessHandler(`${label} updated successfully`);

      setOpen(false);
    } catch (error) {
      console.log("update entity error", error);
      ErrorHandler(`Sorry we couldn't create your ${label}`);
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    form.reset(entityData);
  }, [entityData]);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {/* <AlertDialogTrigger asChild>
        <div className=" mt-4 flex justify-end w-full">
          <Button variant={"outline2"} size={"lg2"} className="mb-4 w-full border md:w-fit">
            {" "}
            <Plus className="text" /> Add New {label}
          </Button>
        </div>
      </AlertDialogTrigger> */}

      <AlertDialogContent className=" bg-white dark:bg-[#1E1E1E] p-6">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-dark dark:text-white">Add new {label}</AlertDialogTitle>
          <AlertDialogDescription className="">Fill in the details...</AlertDialogDescription>
        </AlertDialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              key={"name"}
              control={form.control}
              name={"name"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize text-gray-700/90 dark:text-gray-300/90 font-normal text-base">Name</FormLabel>
                  <FormControl>
                    <Input className="focus-visible:ring-0 focus-visible:ring-offset-0" placeholder={`Enter name`} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {["Chapter"].includes(label) && (
              <FormField
                control={form.control}
                name={"division_id"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700/90 dark:text-gray-300/90 font-normal text-base">Division</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="shad-select-trigger">
                          <SelectValue placeholder={`Select the Division`} />
                        </SelectTrigger>
                        <SelectContent className="shad-select-content">
                          {DivisionOptions.map((division: SelectOptions) => (
                            <SelectItem key={division.value} value={division.value as string}>
                              <div className="flex items-center cursor-pointer gap-3">
                                <p>{division.name}</p>
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
            )}

            {["Governor", "President"].includes(label) && (
              <FormField
                control={form.control}
                name={"hos_id"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700/90 dark:text-gray-300/90 font-normal text-base">House Of Shepherds</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          form.setValue("governor_id", "");
                        }}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <SelectTrigger className="shad-select-trigger">
                          <SelectValue placeholder={`Select HoS`} />
                        </SelectTrigger>
                        <SelectContent className="shad-select-content">
                          {HoSOptions.map((hos: SelectOptions) => (
                            <SelectItem key={hos.value} value={hos.value as string}>
                              <div className="flex items-center cursor-pointer gap-3">
                                <p>{hos.name}</p>
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
            )}

            {label === "President" && (
              <FormField
                control={form.control}
                name={"governor_id"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700/90 dark:text-gray-300/90 font-normal text-base">Governor</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                        <SelectTrigger className="shad-select-trigger">
                          <SelectValue placeholder={`Select Governor`} />
                        </SelectTrigger>
                        <SelectContent className="shad-select-content">
                          {GovernorOptions.filter((governor) => (selectedHoS ? governor.hos_id === selectedHoS : true)).map((governor: any) => (
                            <SelectItem key={governor.value} value={governor.value as string}>
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
            )}

            {["HoS", "Governor", "President"].includes(label) && (
              <FormField
                control={form.control}
                name={"rep_partner_id"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700/90 dark:text-gray-300/90 font-normal text-base">Rep Partner</FormLabel>
                    <FormControl>
                      <PartnerSearchSelect
                        value={field.value || ""}
                        onChange={field.onChange}
                        placeholder="Search and select rep partner"
                        hosId={["Governor", "President"].includes(label) ? selectedHoS || "" : ""}
                        governorId={label === "President" ? selectedGovernor || "" : ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {label === "Chapter" && (
              <>
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700/90 dark:text-gray-300/90 font-normal text-base">Country</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger className="shad-select-trigger">
                            <SelectValue placeholder="Select the Country" />
                          </SelectTrigger>
                          <SelectContent className="shad-select-content">
                            {Countries.map((country) => (
                              <SelectItem key={country.value} value={country.value}>
                                <div className="flex items-center cursor-pointer gap-3">
                                  <p>{country.label}</p>
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
                  name="base_currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700/90 dark:text-gray-300/90 font-normal text-base">Base Currency</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger className="shad-select-trigger">
                            <SelectValue placeholder="Select the Currency" />
                          </SelectTrigger>
                          <SelectContent className="shad-select-content">
                            {WorldCurrenciesOptions.map((currency) => (
                              <SelectItem key={currency.value} value={currency.value}>
                                <div className="flex items-center cursor-pointer gap-3">
                                  <p>{currency.label}</p>
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
              </>
            )}

            <AlertDialogFooter>
              <AlertDialogCancel className="h-11 rounded-md px-8 dark:text-white" type="button">
                Cancel
              </AlertDialogCancel>
              <Button size={"lg"} className="" variant={"custom"} type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Update"}
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
