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
import { initialiseOptions } from "@/lib/utils";
import { SuccessHandler, ErrorHandler } from "@/lib/toastHandlers";
import { removeRep, updateMember } from "@/services/users";
import { refreshLoggedInUser } from "@/services/auth";

type FormValues = z.infer<typeof migrateUserSchema>;

type EditUserProps = {
  open: boolean;
  permission_type: string;
  userData: Record<string, any>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setUser: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  setRefreshData?: React.Dispatch<React.SetStateAction<number>>;
  // fields: (keyof FormValues)[];
  // onAdd: (val: FormValues) => Promise<void> | void;
};

export default function MigrateUserDialog({ userData, open, setOpen, setUser, setRefreshData }: EditUserProps) {
  const appState = useAppSelector((state) => state.app);
  const authUser = useAppSelector((state) => state.auth.userDetails);
  const { DivisionOptions, ChapterOptions } = initialiseOptions(appState);

  // const [entity, setUser] = useState<Record<string, any>>({});
  const [isPending, setIsPending] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(migrateUserSchema),
    defaultValues: {
      id: userData?.id || "",
      name: userData?.name || "",
      division_id: userData?.division_id || "",
      chapter_id: userData?.chapter_id || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof migrateUserSchema>) => {
    try {
      setIsPending(true);

      const { division_id, chapter_id } = values;
      const memberData = { id: userData.id, division_id, chapter_id, permission_type: "individual" };
      await updateMember(memberData);
      await removeRep(userData, userData.permission_type);
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
          <AlertDialogTitle className="dark:text-white ">Migrate Partner</AlertDialogTitle>
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
              name={"division_id"}
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-1">
                    <FormLabel className="text-[#111c30] font-normal dark:text-white  text-base">Division</FormLabel>
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

            <FormField
              control={form.control}
              name="chapter_id"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-1">
                    <FormLabel className="text-[#111c30] dark:text-white  font-normal text-base">Chapter</FormLabel>
                    <span className="text-red-500 text-base">*</span>
                  </div>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <SelectTrigger className="shad-select-trigger">
                        <SelectValue placeholder="Select your chapter" />
                      </SelectTrigger>
                      <SelectContent className="shad-select-content">
                        {ChapterOptions.filter((chapter) => chapter.filt === form.watch("division_id")).map((chapter: SelectOptions) => (
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
