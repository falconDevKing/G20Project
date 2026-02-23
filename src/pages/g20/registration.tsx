import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { useState } from "react";
import { g20RegisterSchema } from "@/lib/schemas";

import { SelectOptions } from "@/interfaces/register";
import { createG20UniqueCode, createG20User } from "@/services/auth";
import { useNavigate } from "react-router";
import { useAppSelector } from "@/redux/hooks";
import { initialiseOptions } from "@/lib/utils";
import { SuccessHandler, ErrorHandler } from "@/lib/toastHandlers";
import PostG20ConfirmationTemplate from "@/mailTemplates/postG20ConfirmationTemplate";
import { sendEmail } from "@/services/sendMail";

import "react-datepicker/dist/react-datepicker.css";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { G20Categories, G20ForcedToDoSoOpions, G20RemissionStatusOptions } from "@/constants/index";
import { Button } from "@/components/ui/button";
import { G20CardWrapper } from "./g20CardWrapper";
import { Checkbox } from "@/components/ui/checkbox";

import Logo from "../../assets/G20_logo.png";
import { Textarea } from "@/components/ui/textArea";
import { createG20UserQRCode } from "@/services/qrCodeGenerator";

const G20RegisterForm = () => {
  const navigate = useNavigate();

  const appState = useAppSelector((state) => state.app);

  const { AppOrganisationId, DivisionOptions } = initialiseOptions(appState);

  const form = useForm<z.infer<typeof g20RegisterSchema>>({
    resolver: zodResolver(g20RegisterSchema),
    defaultValues: {
      last_name: "",
      first_name: "",
      email: "",
      division_id: "",
      chapter_id: "",
      g20_category: "",
      amount: 0,
      remitted: "",
      forced: "",
      motivation: "",
      accept_terms: false,
    },
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onSubmit = async (values: z.infer<typeof g20RegisterSchema>) => {
    try {
      const { last_name, first_name, email, division_id, chapter_id, phone_number, remitted, forced, motivation, g20_category, amount } = values;

      setIsLoading(true);

      // TODO: CHECK IF USER EXISTS
      const unique_code = await createG20UniqueCode({ first_name, last_name });

      // SIGN UP USER ON DDB
      const userData = {
        unique_code,
        last_name,
        first_name,
        email,
        phone_number,

        organisation_id: AppOrganisationId,
        division_id,
        chapter_id,

        g20_category,
        amount,

        remitted,
        forced,
        motivation,
      };

      if (unique_code) {
        const newUser = await createG20User(userData);

        const QRCodeImageUrl = await createG20UserQRCode(newUser);
        const recipientMails = [email];
        const mailSubject = "Welcome to HOG 2026 Parliament!";
        const mailBody = PostG20ConfirmationTemplate(first_name, unique_code, QRCodeImageUrl);

        // forced === "No" && (await sendEmail({ to: recipientMails, mailSubject, mailBody }));
        await sendEmail({ to: recipientMails, mailSubject, mailBody });
        SuccessHandler("Registration Successful");
        navigate(`/`);
      }

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);

      console.log("register error", error);
      ErrorHandler("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const remitted = form.watch("remitted");

  return (
    <G20CardWrapper
      titleImg={Logo}
      headerLabel="House of Greats Parliament Registration"
      backButtonLabel=""
      backButtenHref=""
      isRegister
      // homeHref="/"
      // homeLable="Go to home page"
      // slogan="...partnering to spread the Gospel and transform lives on a global scale."
      // tradeMark="© 2025 GGP"
      // showSocials
      // imgLink="/GGP-logo.png"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 2xl:space-y-3 mx-auto">
          <div className=" lg:grid grid-cols-2 gap-2 space-y-3 md:space-y-0">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-1">
                    <FormLabel className="text-gray-600/90 font-normal text-base">First Name</FormLabel>
                    <span className="text-red-500 text-base">*</span>
                  </div>
                  <FormControl>
                    <Input disabled={isLoading} placeholder="Smith" className=" focus-visible:ring-0  h-12 focus-visible:ring-offset-0" {...field} />
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
                    <FormLabel className="text-gray-600/90 font-normal text-base">Last Name</FormLabel>
                    <span className="text-red-500 text-base">*</span>
                  </div>
                  <FormControl>
                    <Input disabled={isLoading} placeholder="Doe" className=" focus-visible:ring-0  h-12 focus-visible:ring-offset-0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className=" lg:grid grid-cols-2 gap-2 space-y-2 md:space-y-0">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-1">
                    <FormLabel className="text-gray-600/90 font-normal text-base">Email</FormLabel>
                    <span className="text-red-500 text-base">*</span>
                  </div>

                  <FormControl>
                    <Input
                      disabled={isLoading}
                      type="email"
                      placeholder="smith@gmail.com"
                      className=" focus-visible:ring-0  h-12 focus-visible:ring-offset-0"
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
                    <FormLabel className="text-gray-600/90 font-normal text-base">Phone Number</FormLabel>
                    <span className="text-red-500 text-base">*</span>
                  </div>
                  <FormControl>
                    <PhoneInput
                      className="flex dark:text-input h-12 w-full rounded-md border border-input dark:border-input/50 dark:bg-transparent bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>input]:border-none [&>input]:outline-none"
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
                    <FormLabel className="text-gray-600/90 font-normal text-base">Division</FormLabel>
                    <span className="text-red-500 text-base">*</span>
                  </div>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <SelectTrigger className=" h-12" enforceWhite>
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
                    <FormLabel className="text-gray-600/90 font-normal text-base">Chapter Name</FormLabel>
                    <span className="text-red-500 text-base">*</span>
                  </div>
                  <FormControl>
                    <Input disabled={isLoading} placeholder="Doe" className=" focus-visible:ring-0  h-12 focus-visible:ring-offset-0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className={`lg:grid grid-cols-${remitted === "Yes" ? "2" : "1"} gap-2 space-y-3 md:space-y-0`}>
            <FormField
              control={form.control}
              name="remitted"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-1">
                    <FormLabel className="text-gray-600/90 font-normal text-base">Have you remitted yout G20?</FormLabel>
                    <span className="text-red-500 text-base">*</span>
                  </div>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <SelectTrigger className=" h-12" enforceWhite>
                        <SelectValue placeholder="Select your remission status" />
                      </SelectTrigger>
                      <SelectContent className="shad-select-content">
                        {G20RemissionStatusOptions.map((remissionOption: SelectOptions) => (
                          <SelectItem key={remissionOption.value} value={remissionOption.value as unknown as string}>
                            <div className="flex items-center cursor-pointer gap-3">
                              <p>{remissionOption.name}</p>
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

            {remitted === "Yes" && (
              <FormField
                control={form.control}
                name="forced"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-1">
                      <FormLabel className="text-gray-600/90 font-normal text-base">Were you forced to do so?</FormLabel>
                      <span className="text-red-500 text-base">*</span>
                    </div>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                        <SelectTrigger className="" enforceWhite>
                          <SelectValue placeholder="Select your voluntary giving status" />
                        </SelectTrigger>
                        <SelectContent className="shad-select-content">
                          {G20ForcedToDoSoOpions.map((forceOptions: SelectOptions) => (
                            <SelectItem key={forceOptions.value} value={forceOptions.value as unknown as string}>
                              <div className="flex items-center cursor-pointer gap-3">
                                <p>{forceOptions.name}</p>
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
          </div>

          {remitted === "Yes" && (
            <div className={`lg:grid grid-cols-${remitted === "Yes" ? "2" : "1"} gap-2 space-y-3 md:space-y-0`}>
              <FormField
                control={form.control}
                name="g20_category"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-1">
                      <FormLabel className="text-gray-600/90 font-normal text-base">G20 Category</FormLabel>
                      <span className="text-red-500 text-base">*</span>
                    </div>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                        <SelectTrigger className=" h-12" enforceWhite>
                          <SelectValue placeholder="Select your G20 Category" />
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
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-1">
                      <FormLabel className="text-gray-600/90 font-normal text-base">Amount Paid</FormLabel>
                      <span className="text-red-500 text-base">*</span>
                    </div>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        className="focus-visible:ring-0 border-gray-600/90 focus-visible:ring-offset-0"
                        {...field}
                        placeholder="e.g 100000"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          <div className=" md:grid grid-cols-1 gap-3 space-y-3 md:space-y-0 mb-4 md:mt-0">
            <FormField
              control={form.control}
              name="motivation"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-1">
                    <FormLabel className="text-gray-600/90 font-normal text-base">What is your conviction about giving to advance God's kingsom?</FormLabel>
                    <span className="text-red-500 text-base">*</span>
                  </div>
                  <FormControl>
                    <Textarea
                      className="focus-visible:ring-0 focus-visible:ring-offset-0"
                      {...field}
                      placeholder="Why do you want to be a member of the House of Great?"
                      rows={6}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className=" py-2">
            <FormField
              control={form.control}
              name="accept_terms"
              render={({ field }) => (
                <FormItem className="flex space-x-3 space-y-0 items-center">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      // className="mt-1"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none text-md">
                    <div className="text-gray-600/90">
                      I acknowledge that my giving is an expression of my love for Christ and a commitment to the advancement of the Kingdom of God. I confirm
                      that all seed or offerings given were voluntary, made without any form of coercion, pressure, or manipulation, and given willingly from a
                      heart of faithfulness and devotion to God.
                    </div>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>
          <Button disabled={isLoading} className="w-full text-sm cursor-pointer" size="lg" variant={"custom"} type="submit">
            {isLoading ? "Submitting.." : "Register"}
          </Button>
        </form>
      </Form>
    </G20CardWrapper>
  );
};

export default G20RegisterForm;
