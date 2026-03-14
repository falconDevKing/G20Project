import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  // AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { SelectOptions } from "@/interfaces/register";
import { useAppSelector } from "@/redux/hooks";
import { SuccessHandler, ErrorHandler, InfoHandler } from "@/lib/toastHandlers";
// import { ContainerFluid } from "@/components/containerFluid";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { genderOptions, initialiseAdminOptions, PermissionOptions, monthsOfTheYearOptions, RemissionDayOptions } from "@/lib/utils";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { signupSchema } from "@/lib/schemas";
import { Countries } from "../../constants/index";
import { createUniqueCode, createUser, vetUser } from "@/services/auth";
import { signUp } from "aws-amplify/auth";
import { v4 as uuidV4 } from "uuid";
import PostConfirmationTemplate from "@/mailTemplates/postConfirmationTemplateNew";
import { sendEmail } from "@/services/sendMail";
import { fetchUsersByEntity } from "@/services/appData";
import dayjs from "dayjs";
import { sendWelcomeMessage, sendDefaultPaswordMessage } from "@/services/twilioMessaging";
import { getG20CategoryOptions } from "@/lib/g20Categories";

type EditUserProps = {
  open: boolean;
  permission_type: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  // fields: (keyof FormValues)[];
  // onAdd: (val: FormValues) => Promise<void> | void;
};

export default function AddNewPartner({ open, setOpen, permission_type }: EditUserProps) {
  const appState = useAppSelector((state) => state.app);
  const { AppOrganisationId, DivisionOptions, ChapterOptions, PresidentOptions } = initialiseAdminOptions(appState);

  // const [entity, setUser] = useState<Record<string, any>>({});
  const [isPending, setIsPending] = useState(false);

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      phone_number: "",
      email: "",
      division_id: "",
      chapter_id: "",
      president_id: "",
      permission_type: "individual",
      g20_category: "",
      g20_amount: 0,
      address: "",
      gender: "",
      nationality: "",
      birth_day: "",
      birth_month: "",
    },
  });
  const selectedChapter = form.watch("chapter_id");
  const g20CategoryOptions = getG20CategoryOptions({
    chapterId: selectedChapter,
    locationCurrency: appState.locationCurrency,
    fallbackCurrency: appState.fallbackCurrency,
  });

  const onSubmit = async (values: z.infer<typeof signupSchema>) => {
    try {
      const { first_name, last_name, phone_number, email, division_id, chapter_id, president_id, permission_type, g20_category, g20_amount, address, gender, nationality, birth_day, birth_month } =
        values;

      setIsPending(true);

      // CHECK IF USER EXISTS
      const userExists = await vetUser(email);

      if (userExists) {
        throw new Error("User already exists");
      }

      const unique_code = await createUniqueCode({ first_name, last_name });

      // SIGN UP USER ON COGNITO
      const { userId: user_id } = await signUp({
        username: email.replace(/\s+/g, ""),
        password: "Password-123",
        options: {
          userAttributes: {
            email: email.replace(/\s+/g, ""),
            name: first_name.replace(/\s+/g, "") + " " + last_name.replace(/\s+/g, ""),
            given_name: first_name.replace(/\s+/g, ""),
            family_name: last_name.replace(/\s+/g, ""),
            phone_number: phone_number,
          },
        },
      });

      const selectedPresident = PresidentOptions.find((president) => president.value === president_id);

      // SIGN UP USER ON DDB
      const userData = {
        id: uuidV4(),
        unique_code,
        verified: true,
        last_name,
        first_name,
        email,
        phone_number,
        cognito_user_id: user_id,
        status: "passive",
        g20_status: "passive" as const,
        g20_active: false,
        proposed_payment_scheduled: false,
        organisation_id: AppOrganisationId,
        division_id,
        chapter_id,
        president_id: president_id || null,
        governor_id: selectedPresident?.governor_id || null,
        shepherd_id: selectedPresident?.shepherd_id || null,
        permission_type,
        g20_category: g20_category || null,
        g20_amount: typeof g20_amount === "number" && g20_amount > 0 ? g20_amount : null,
        address,
        gender,
        nationality,
        date_of_birth:
          birth_month && birth_day
            ? dayjs()
                .month(parseInt(birth_month) - 1)
                .date(parseInt(birth_day))
                .toISOString()
            : null,
        remission_start_date: new Date().toISOString().split("T")[0],
      };

      if (unique_code) {
        await createUser(userData);

        const recipientMails = [email];
        const mailSubject = "Welcome to House of Greats! You’re Officially a G20 Partner.";
        const mailBody = PostConfirmationTemplate(first_name, unique_code, false);

        await sendEmail({ to: recipientMails, mailSubject, mailBody });

        await sendWelcomeMessage({ to: phone_number, name: first_name, ggp_code: unique_code });

        await sendDefaultPaswordMessage({ to: phone_number });
      }

      form.reset();
      SuccessHandler("Honourable created successfully");
      await fetchUsersByEntity();
      setIsPending(false);
      setOpen(false);
    } catch (error: any) {
      setIsPending(false);

      if (error?.message === "User already exists") {
        InfoHandler("User Already registered.");
        form.reset();
        setOpen(false);
      } else {
        console.log("register error", error);
        ErrorHandler(error?.message || "Something went wrong");
      }
      // ErrorHandler("Something went wrong");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <section>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <div className="mt-4 flex justify-end w-full">
            <Button variant="custom" size={"lg2"} className="mb-4 w-full border-[#304ddb] md:w-fit">
              <UserPlus /> Add New Partner
            </Button>
          </div>
        </AlertDialogTrigger>

        <AlertDialogContent className=" bg-white dark:bg-[#1E1E1E]">
          <AlertDialogHeader>
            <AlertDialogTitle className=" dark:text-white">Add New Partner</AlertDialogTitle>
            {/* <AlertDialogDescription className="">Fill in the details...</AlertDialogDescription> */}
          </AlertDialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <div className=" lg:grid grid-cols-2 gap-2 space-y-3 md:space-y-0">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-1">
                        <FormLabel className="text-[#111c30] font-normal dark:text-white text-base">First Name</FormLabel>
                        <span className="text-red-500 text-base">*</span>
                      </div>
                      <FormControl>
                        <Input disabled={isPending} placeholder="Smith" className=" focus-visible:ring-0 focus-visible:ring-offset-0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-1">
                        <FormLabel className="text-[#111c30] font-normal dark:text-white text-base">Last Name</FormLabel>
                        <span className="text-red-500 text-base">*</span>
                      </div>
                      <FormControl>
                        <Input disabled={isPending} placeholder="Doe" className=" focus-visible:ring-0 focus-visible:ring-offset-0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className=" lg:grid grid-cols-2 gap-2 space-y-3 md:space-y-0">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-1">
                        <FormLabel className="text-[#111c30] dark:text-white font-normal text-base">Email</FormLabel>
                        <span className="text-red-500 text-base">*</span>
                      </div>

                      <FormControl>
                        <Input
                          disabled={isPending}
                          type="email"
                          placeholder="smith@gmail.com"
                          className=" focus-visible:ring-0 focus-visible:ring-offset-0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone_number"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-1">
                        <FormLabel className="text-[#111c30] font-normal dark:text-white text-base">Phone Number</FormLabel>
                        <span className="text-red-500 text-base">*</span>
                      </div>
                      <FormControl>
                        <PhoneInput
                          className="flex dark:text-white h-11 w-full rounded-md border border-input dark:border-input/50 dark:bg-transparent bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>input]:border-none [&>input]:outline-none"
                          international
                          onChange={field.onChange}
                          value={field.value}
                          defaultCountry="GB"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className=" lg:grid grid-cols-2 gap-2 space-y-3 md:space-y-0">
                <FormField
                  control={form.control}
                  name="division_id"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-1">
                        <FormLabel className="text-[#111c30] dark:text-white font-normal text-base">Division</FormLabel>
                        <span className="text-red-500 text-base">*</span>
                      </div>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                          <SelectTrigger className="shad-select-trigger">
                            <SelectValue placeholder="Select your Division" />
                          </SelectTrigger>
                          <SelectContent className="shad-select-content">
                            {DivisionOptions.map((division: SelectOptions) => (
                              <SelectItem key={division.value} value={division.value as unknown as string}>
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
                        <FormLabel className="text-[#111c30] dark:text-white font-normal text-base">Chapter</FormLabel>
                        <span className="text-red-500 text-base">*</span>
                      </div>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                          <SelectTrigger className="shad-select-trigger">
                            <SelectValue placeholder="Select your Chapter" />
                          </SelectTrigger>
                          <SelectContent className="shad-select-content">
                            {ChapterOptions.filter((chapter) => (form.watch("division_id") ? form.watch("division_id") === chapter.filt : true)).map(
                              (chapter: SelectOptions) => (
                                <SelectItem key={chapter.value} value={chapter.value as unknown as string}>
                                  <div className="flex items-center cursor-pointer gap-3">
                                    <p>{chapter.name}</p>
                                  </div>
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className=" lg:grid grid-cols-2 gap-2 space-y-3 md:space-y-0">
                <FormField
                  control={form.control}
                  name="president_id"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-1">
                        <FormLabel className="text-[#111c30] dark:text-white font-normal text-base">House</FormLabel>
                      </div>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                          <SelectTrigger className="shad-select-trigger">
                            <SelectValue placeholder="Select House" />
                          </SelectTrigger>
                          <SelectContent className="shad-select-content">
                            {PresidentOptions.map((president) => (
                              <SelectItem key={president.value} value={president.value}>
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

                <FormField
                  control={form.control}
                  name="g20_category"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-1">
                        <FormLabel className="text-[#111c30] dark:text-white font-normal text-base">G20 Category</FormLabel>
                      </div>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                          <SelectTrigger className="shad-select-trigger">
                            <SelectValue placeholder="Select G20 Category" />
                          </SelectTrigger>
                          <SelectContent className="shad-select-content">
                            {g20CategoryOptions.map((option: SelectOptions) => (
                              <SelectItem key={option.value} value={option.value as string}>
                                <div className="flex items-center cursor-pointer gap-3">
                                  <p>{option.name}</p>
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

              <div className=" lg:grid grid-cols-1 gap-2 space-y-3 md:space-y-0">
                <FormField
                  control={form.control}
                  name="g20_amount"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-1">
                        <FormLabel className="text-[#111c30] dark:text-white font-normal text-base">G20 Amount</FormLabel>
                      </div>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          type="number"
                          min={0}
                          placeholder="e.g 100000"
                          className=" focus-visible:ring-0 focus-visible:ring-offset-0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className=" lg:grid grid-cols-2 gap-2 space-y-3 md:space-y-0">
                <div className="w-full">
                  <div className="flex items-center gap-1 pb-2">
                    <FormLabel className="text-[#111c30] dark:text-white font-normal text-base">Birth Day</FormLabel>
                    <span className="text-red-500 text-base">*</span>
                  </div>
                  <div className="flex gap-x-1 w-full">
                    <FormField
                      control={form.control}
                      name="birth_month"
                      render={({ field }) => (
                        <FormItem className="w-full flex-1">
                          <FormControl>
                            <Select defaultValue={field.value} value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger className=" w-full h-12 dark:border-white" allowDark={false} enforceWhite>
                                <SelectValue placeholder="Birth Month" />
                              </SelectTrigger>
                              <SelectContent className="shad-select-content">
                                {monthsOfTheYearOptions.map((month: any) => (
                                  <SelectItem key={month.value} value={month.value}>
                                    <div className="flex items-center cursor-pointer gap-3">
                                      <p>{month.name}</p>
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
                      name="birth_day"
                      render={({ field }) => (
                        <FormItem className="w-full flex-1">
                          <FormControl>
                            <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                              <SelectTrigger className="w-full h-12 dark:border-white" allowDark={false} enforceWhite>
                                <SelectValue placeholder="Birth Day" />
                              </SelectTrigger>
                              <SelectContent className="shad-select-content">
                                {RemissionDayOptions.map((RemissionDay: string) => (
                                  <SelectItem key={RemissionDay} value={RemissionDay}>
                                    <div className="flex items-center cursor-pointer gap-3">
                                      <p>{RemissionDay}</p>
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

                <FormField
                  control={form.control}
                  name="permission_type"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-1">
                        <FormLabel className="text-[#111c30] dark:text-white font-normal text-base">Permission Type</FormLabel>
                        <span className="text-red-500 text-base">*</span>
                      </div>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger className="shad-select-trigger">
                            <SelectValue placeholder="Select Permission Type" />
                          </SelectTrigger>
                          <SelectContent className="shad-select-content">
                            {PermissionOptions.filter((option) => option.allow.includes(permission_type)).map((permissionOption) => (
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

              <div className="lg:grid grid-cols-2 gap-1 space-y-3 md:space-y-0 space-x-3">
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-1">
                        <FormLabel className="text-[#111c30] dark:text-white font-normal text-base">Gender</FormLabel>
                        <span className="text-red-500 text-base">*</span>
                      </div>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger className="shad-select-trigger">
                            <SelectValue placeholder="Select Gender" />
                          </SelectTrigger>
                          <SelectContent className="shad-select-content">
                            {genderOptions.map((division: SelectOptions) => (
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
                  name="nationality"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-1">
                        <FormLabel className="text-[#111c30] dark:text-white font-normal text-base">Nationality</FormLabel>
                        <span className="text-red-500 text-base">*</span>
                      </div>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger className="shad-select-trigger">
                            <SelectValue placeholder="Select Nationality" />
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
              </div>

              <div className=" lg:grid grid-cols-1 gap-2 space-y-3 md:space-y-0">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-1">
                        <FormLabel className="text-[#111c30] dark:text-white font-normal text-base">Address</FormLabel>
                        <span className="text-red-500 text-base">*</span>
                      </div>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          type="text"
                          placeholder="E.g Apt 5, East drive, London"
                          className=" focus-visible:ring-0 focus-visible:ring-offset-0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <AlertDialogFooter>
                <AlertDialogCancel className="h-11 dark:text-white rounded-md px-8" type="button">
                  Cancel
                </AlertDialogCancel>
                <Button disabled={isPending} className="text-sm cursor-pointer " size="lg" variant={"custom"} type="submit">
                  {isPending ? "Submitting.." : "Create Partner"}
                </Button>
              </AlertDialogFooter>
            </form>
          </Form>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
