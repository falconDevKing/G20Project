import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  AlertDialog,
  AlertDialogTrigger,
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
import { Plus } from "lucide-react";
import { createDivisionSchema, createChapterSchema, genericToolsSchema } from "@/lib/toolsSchemas";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { SelectOptions } from "@/interfaces/register";
import { useAppSelector } from "@/redux/hooks";
import { initialiseAdminOptions } from "@/lib/utils";
import { Countries } from "../../constants/index";
import { WorldCurrenciesOptions } from "../../constants/currencies";
import { createEntity } from "@/services/tools";
import { SuccessHandler, ErrorHandler } from "@/lib/toastHandlers";
import FormTooltip from "../FormTooltips";
import { refreshLoggedInUser } from "@/services/auth";

type FormValues = z.infer<typeof genericToolsSchema>;

type AddEntityProps = {
  label: string;
  // fields: (keyof FormValues)[];
  // onAdd: (val: FormValues) => Promise<void> | void;
};

export default function AddEntityDialog({ label }: Readonly<AddEntityProps>) {
  const appState = useAppSelector((state) => state.app);
  const userId = useAppSelector((state) => state.auth.user_id);

  const { DivisionOptions } = initialiseAdminOptions(appState);

  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const schemaOptions = {
    Chapter: createChapterSchema,
    Division: createDivisionSchema,
  };

  const schemaToUse = schemaOptions[label as keyof typeof schemaOptions] || genericToolsSchema;

  const form = useForm<FormValues>({
    resolver: zodResolver(schemaToUse),
    defaultValues: {
      name: "",
      division_id: "",
      country: "",
      base_currency: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setIsPending(true);

      await createEntity(label, values);
      await refreshLoggedInUser(userId);
      form.reset();
      SuccessHandler(`${label} created successfully`);

      setOpen(false);
    } catch (error) {
      console.log("update password error", error);
      ErrorHandler(`Sorry we couldn't create your ${label}`);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <div className="mt-4 flex justify-end w-full">
        <AlertDialogTrigger asChild>
          <div className="w-max">
            <Button variant={"outline2"} size={"lg2"} className="mb-4 w-full border-GGP-darkGold md:w-fit">
              <Plus className="text-GGP-darkGold font-bold" /> Add New {label}
            </Button>
          </div>
        </AlertDialogTrigger>
      </div>

      <AlertDialogContent className=" bg-white dark:bg-[#1E1E1E] p-6">
        <AlertDialogHeader>
          <AlertDialogTitle className=" dark:text-white">Add new {label}</AlertDialogTitle>
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
                  <div className="flex items-center gap-1">
                    <FormLabel className="text-gray-600/90  dark:text-white font-normal text-base">Name</FormLabel>
                    <span className="text-red-500 text-base">*</span>
                  </div>
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
                    <div className="flex items-center gap-1">
                      <FormLabel className="text-gray-600/90 dark:text-white font-normal text-base">Division</FormLabel>
                      <span className="text-red-500 text-base">*</span>
                    </div>
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

            {label === "Chapter" && (
              <>
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-1">
                        <FormLabel className="text-gray-600/90 dark:text-white font-normal text-base">Country</FormLabel>
                        <span className="text-red-500 text-base">*</span>
                      </div>
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
                      <div className="flex items-center gap-1">
                        <FormLabel className="text-gray-600/90 dark:text-white font-normal text-base">Base Currency</FormLabel>
                        <span className="text-red-500 text-base">*</span>
                        <FormTooltip text={"Currency to use in the chapter"} />
                      </div>
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
              <AlertDialogCancel className="h-11 dark:text-white rounded-md px-8" type="button">
                Cancel
              </AlertDialogCancel>
              <Button size={"lg"} variant={"custom"} type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Add"}
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
