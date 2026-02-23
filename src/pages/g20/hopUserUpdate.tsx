import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { updateG20UserSchema } from "@/lib/toolsSchemas";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppSelector } from "@/redux/hooks";
import { initialiseOptions } from "@/lib/utils";
import { SuccessHandler, ErrorHandler } from "@/lib/toastHandlers";
import { GGPCategories, CurrencyCode, CovenantEntry } from "@/constants";
import { camelCaseToNormal } from "@/lib/textUtils";
import { updateG20Member } from "@/services/users";
import { refreshLoggedInUser } from "@/services/auth";

type FormValues = z.infer<typeof updateG20UserSchema>;

type HoGUpdateUserDialogProps = {
  open: boolean;
  userData: Record<string, any>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setUser: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  permission_type: string;
  setRefreshData?: React.Dispatch<React.SetStateAction<number>>;
  // fields: (keyof FormValues)[];
  // onAdd: (val: FormValues) => Promise<void> | void;
};

export default function HoGUpdateUserDialog({ userData, open, setOpen, setUser, setRefreshData }: HoGUpdateUserDialogProps) {
  const appState = useAppSelector((state) => state.app);
  const authUser = useAppSelector((state) => state.auth.userDetails);

  const { ChapterOptions } = initialiseOptions(appState);

  const [isPending, setIsPending] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(updateG20UserSchema),
    defaultValues: {
      id: userData?.id || "",
      // name: userData?.name || "",
      // chapter_id: userData?.chapter_id || "",
      g20_category: userData?.g20_category || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof updateG20UserSchema>) => {
    try {
      setIsPending(true);
      const { g20_category } = values;
      const memberData = {
        id: userData.id,
        g20_category,
      };

      await updateG20Member(memberData);

      SuccessHandler(`User updated successfully`);

      if (authUser.id === userData.id) {
        await refreshLoggedInUser(authUser.id || "");
      }

      setRefreshData?.((prev) => prev + 1);

      form.reset();
      setUser({});
      setOpen(false);
    } catch (error) {
      console.log("update entity error", error);
      ErrorHandler(`Sorry we couldn't create this User`);
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    form.reset(userData);
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
          <AlertDialogTitle className=" dark:text-white">Update Category</AlertDialogTitle>
          {/* <AlertDialogDescription className="">e in the ca...</AlertDialogDescription> */}
        </AlertDialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* <FormField
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
            /> */}

            <FormField
              control={form.control}
              name="g20_category"
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
