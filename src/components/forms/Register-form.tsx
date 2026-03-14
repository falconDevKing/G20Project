import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { useState } from "react";
import { registerSchema } from "@/lib/schemas";
import { CardWrapper } from "../Card-wapper";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { signUp } from "aws-amplify/auth";
import { v4 as uuidV4 } from "uuid";
import { RegisterNextStep, SelectOptions } from "@/interfaces/register";

import { UserPermissionType } from "../../../API";
import { createUniqueCode, createUser, getLoggedInUser, logInuser } from "@/services/auth";
import { useNavigate } from "react-router";
import { useAppSelector } from "@/redux/hooks";
import { initialiseOptions, monthsOfTheYearOptions, RemissionDayOptions } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { SuccessHandler, ErrorHandler, InfoHandler } from "@/lib/toastHandlers";
import PostConfirmationTemplate from "@/mailTemplates/postConfirmationTemplateNew";
import { sendEmail } from "@/services/sendMail";
import { Checkbox } from "../ui/checkbox";
import Logo from "../../assets/G20_logo.png";
import dayjs from "dayjs";
import { sendWelcomeMessage } from "@/services/twilioMessaging";
import { AuthInput } from "../ui/authInput";
import { AuthTextArea } from "../ui/textArea";
import { getG20CategoryOptions } from "@/lib/g20Categories";
import { G20ForcedToDoSoOpions } from "@/constants/index";

export const RegisterForm = () => {
  const navigate = useNavigate();

  const appState = useAppSelector((state) => state.app);

  const { AppOrganisationId, DivisionOptions, ChapterOptions } = initialiseOptions(appState);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      last_name: "",
      first_name: "",
      email: "",
      division_id: "",
      chapter_id: "",
      married: undefined,
      anniversary_day: "",
      anniversary_month: "",
      president_id: "",
      g20_category: "",
      g20_amount: 0,
      voluntary_participation: "Yes",
      motivation: "",
      attestation: false,
      password: "",
      phone_number: "",
      birth_day: "",
      birth_month: "",
      accept_terms: false,
    },
  });

  const [isPending, setIsPending] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const married = form.watch("married");
  const selectedChapterId = form.watch("chapter_id");
  const selectedPresidentId = form.watch("president_id");
  const allPresidents = [...(appState.presidentEntities || [])].sort((a, b) => (a.name < b.name ? -1 : 1));
  const selectedPresident = (appState.presidentEntities || []).find((president) => president.id === selectedPresidentId);
  const g20CategoryOptions = getG20CategoryOptions({
    chapterId: selectedChapterId,
    locationCurrency: appState.locationCurrency,
    fallbackCurrency: appState.fallbackCurrency,
  });

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    try {
      const {
        last_name,
        first_name,
        email,
        division_id,
        chapter_id,
        married,
        anniversary_day,
        anniversary_month,
        president_id,
        g20_category,
        g20_amount,
        voluntary_participation,
        motivation,
        attestation,
        password,
        phone_number,
        birth_day,
        birth_month,
      } = values;

      if (voluntary_participation === "No") {
        ErrorHandler("Giving is voluntary. Please review the membership requirements before proceeding.");
        // window.location.assign("/#requirements");
        return;
      }

      // Additional form input check to avoid spamming
      if (values) {
        setIsPending(true);

        // TODO: CHECK IF USER EXISTS
        const unique_code = await createUniqueCode({ first_name, last_name });

        // SIGN UP USER ON COGNITO
        const { userId: user_id, nextStep } = await signUp({
          username: email.replace(/\s+/g, ""),
          password: password,
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

        // SIGN UP USER ON DDB
        const userData = {
          id: uuidV4(),
          unique_code,
          verified: true,
          last_name,
          first_name,
          email,
          ggp_category: "Word",
          phone_number,
          date_of_birth:
            birth_month && birth_day
              ? dayjs()
                  .month(parseInt(birth_month) - 1)
                  .date(parseInt(birth_day))
                  .toISOString()
              : null,
          married: married === "Yes",
          marriage_anniversary:
            married === "Yes" && anniversary_month && anniversary_day
              ? dayjs()
                  .month(parseInt(anniversary_month) - 1)
                  .date(parseInt(anniversary_day))
                  .format("YYYY-MM-DD")
              : null,
          cognito_user_id: user_id,
          g20_active: true,
          proposed_payment_scheduled: false,
          g20_status: "passive" as const,
          permission_type: UserPermissionType.individual,
          status: "passive",
          organisation_id: AppOrganisationId,
          division_id,

          chapter_id,
          president_id: president_id || null,
          governor_id: selectedPresident?.governor_id || null,
          shepherd_id: selectedPresident?.shepherd_id || null,
          g20_category,
          g20_amount: Math.round(g20_amount),
          voluntary_participation: true,
          motivation,
          attestation,
          remission_start_date: new Date().toISOString().split("T")[0],
        };

        if (unique_code) {
          await createUser(userData);

          const recipientMails = [email];
          const mailSubject = "Welcome to GGP! You’re Officially a GGP Partner.";
          const mailBody = PostConfirmationTemplate(first_name, unique_code, true);

          await sendEmail({ to: recipientMails, mailSubject, mailBody });

          await sendWelcomeMessage({ to: phone_number, name: first_name, ggp_code: unique_code });
        }

        let loggedInUser = await getLoggedInUser(email.replace(/\s+/g, ""));
        if (!loggedInUser) {
          try {
            loggedInUser = await logInuser(email.replace(/\s+/g, ""), password);
          } catch (autoSignInError) {
            console.log("post registration auto sign in error", autoSignInError);
          }
        }

        if (loggedInUser) {
          SuccessHandler("Registration Successful");
          navigate("/proposed-schedule", { state: { fromRegistration: true } });
          return;
        }

        switch (nextStep.signUpStep) {
          case RegisterNextStep.DONE:
          case RegisterNextStep.COMPLETE_AUTO_SIGN_IN:
            SuccessHandler("Registration Successful");
            navigate("/proposed-schedule", { state: { fromRegistration: true } });
            break;
          case RegisterNextStep.CONFIRM_SIGN_UP:
            SuccessHandler("Registration Successful");

            navigate(`/verify-email?email=${email}`);
            break;

          default:
            break;
        }

        setIsPending(false);
      } else {
        setIsPending(false);
      }
    } catch (error: any) {
      setIsPending(false);
      console.log("register error", error);
      if (error?.message === "User already exists") {
        InfoHandler("Already registered. Kingly Signin");
        navigate(`/login`);
      } else {
        ErrorHandler(error?.message || "Something went wrong");
      }
    } finally {
      setIsPending(false);
    }
  };

  return (
    <CardWrapper
      titleImg={Logo}
      headerLabel="Create an account"
      backButtonLabel="Already have an account? Login in"
      backButtenHref="/login"
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
                    <FormLabel className="text-[#111c30] font-normal text-base">First Name</FormLabel>
                    <span className="text-red-500 text-base">*</span>
                  </div>
                  <FormControl>
                    <AuthInput
                      disabled={isPending}
                      placeholder="Smith"
                      className=" focus-visible:ring-0  h-12 focus-visible:ring-offset-0"
                      {...field}
                      autoFocus
                    />
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
                    <FormLabel className="text-[#111c30] font-normal text-base">Last Name</FormLabel>
                    <span className="text-red-500 text-base">*</span>
                  </div>
                  <FormControl>
                    <AuthInput disabled={isPending} placeholder="Doe" className=" focus-visible:ring-0  h-12 focus-visible:ring-offset-0" {...field} />
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
                    <FormLabel className="text-[#111c30] font-normal text-base">Email</FormLabel>
                    <span className="text-red-500 text-base">*</span>
                  </div>

                  <FormControl>
                    <AuthInput
                      disabled={isPending}
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
                    <FormLabel className="text-[#111c30] font-normal text-base">Phone Number</FormLabel>
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
                    <FormLabel className="text-[#111c30] font-normal text-base">Division</FormLabel>
                    <span className="text-red-500 text-base">*</span>
                  </div>
                  <FormControl>
                    {/* <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}> */}
                    <Select
                      defaultValue={field.value}
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        form.setValue("chapter_id", "");
                      }}
                    >
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
              render={({ field }) => {
                const divisionId = form.watch("division_id");
                const filteredChapters = ChapterOptions.filter((chapter) => (divisionId ? chapter.filt === divisionId : true));

                return (
                  <FormItem>
                    <div className="flex items-center gap-1">
                      <FormLabel className="text-[#111c30] font-normal text-base">Chapter</FormLabel>
                      <span className="text-red-500 text-base">*</span>
                    </div>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value} disabled={!divisionId}>
                        <SelectTrigger className="h-12" enforceWhite>
                          <SelectValue placeholder={divisionId ? "Select your Chapter" : "Select your Division first"} />
                        </SelectTrigger>
                        <SelectContent className="shad-select-content">
                          {filteredChapters.map((chapter: SelectOptions) => (
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
                );
              }}
            />
          </div>

          <div className="lg:grid grid-cols-2 gap-2 space-y-3 md:space-y-0">
            <FormField
              control={form.control}
              name="president_id"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-1">
                    <FormLabel className="text-[#111c30] font-normal text-base">House</FormLabel>
                  </div>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <SelectTrigger className="h-12" enforceWhite>
                        <SelectValue placeholder="Select a House (Optional)" />
                      </SelectTrigger>
                      <SelectContent className="shad-select-content">
                        {allPresidents.map((president) => (
                          <SelectItem key={president.id} value={president.id}>
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
            <>
              <div className="w-full grid grid-cols-1">
                <div className="w-full">
                  <div className="flex items-center gap-1 pb-2 w-full">
                    <FormLabel className="text-[#111c30] font-normal text-base">Birth Day</FormLabel>
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
                              <SelectTrigger className="w-full h-12" enforceWhite>
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
                              <SelectTrigger className="w-full h-12" allowDark={false} enforceWhite>
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
              </div>
            </>
          </div>

          <div className={`md:grid ${married === "Yes" ? "md:grid-cols-2" : "md:grid-cols-1"} gap-2 space-y-3 md:space-y-0`}>
            <FormField
              control={form.control}
              name="married"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-1">
                    <FormLabel className="text-[#111c30] font-normal text-base">Married</FormLabel>
                    <span className="text-red-500 text-base">*</span>
                  </div>
                  <FormControl>
                    <Select disabled={isPending} value={field.value} defaultValue={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="h-12" enforceWhite>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent className="shad-select-content">
                        {[
                          { name: "Yes", value: "Yes" },
                          { name: "No", value: "No" },
                        ].map((option) => (
                          <SelectItem key={option.value} value={option.value}>
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

            {married === "Yes" && (
              <div className="">
                <div className="flex items-center gap-1 pb-2">
                  <FormLabel className="text-[#111c30] font-normal text-base">Wedding Anniversary</FormLabel>
                  <span className="text-red-500 text-base">*</span>
                </div>
                <div className="flex gap-x-1">
                  <FormField
                    control={form.control}
                    name="anniversary_month"
                    render={({ field }) => (
                      <FormItem className="w-full flex-1">
                        <FormControl>
                          <Select defaultValue={field.value} value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className="w-full h-12" enforceWhite>
                              <SelectValue placeholder="Anniversary Month" />
                            </SelectTrigger>
                            <SelectContent className="shad-select-content">
                              {monthsOfTheYearOptions.map((month: SelectOptions) => (
                                <SelectItem key={month.value} value={month.value as string}>
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
                    name="anniversary_day"
                    render={({ field }) => (
                      <FormItem className="w-full flex-1">
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                            <SelectTrigger className="w-full h-12" enforceWhite>
                              <SelectValue placeholder="Day" />
                            </SelectTrigger>
                            <SelectContent className="shad-select-content">
                              {RemissionDayOptions.map((day: string) => (
                                <SelectItem key={day} value={day}>
                                  <div className="flex items-center cursor-pointer gap-3">
                                    <p>{day}</p>
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
            )}
          </div>

          <div className="lg:grid grid-cols-2 gap-2 space-y-3 md:space-y-0">
            <FormField
              control={form.control}
              name="g20_category"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-1">
                    <FormLabel className="text-[#111c30] font-normal text-base">G20 Category</FormLabel>
                    <span className="text-red-500 text-base">*</span>
                  </div>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <SelectTrigger className="h-12" enforceWhite>
                        <SelectValue placeholder="Select your G20 Category" />
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

            <FormField
              control={form.control}
              name="g20_amount"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-1">
                    <FormLabel className="text-[#111c30] font-normal text-base">G20 Amount</FormLabel>
                    <span className="text-red-500 text-base">*</span>
                  </div>
                  <FormControl>
                    <AuthInput
                      disabled={isPending}
                      type="number"
                      min={0}
                      className="focus-visible:ring-0 h-12 focus-visible:ring-offset-0"
                      {...field}
                      placeholder="e.g 100000"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="voluntary_participation"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-1">
                  <FormLabel className="text-[#111c30] font-normal text-base">Are you doing this of your own accord?</FormLabel>
                  <span className="text-red-500 text-base">*</span>
                </div>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <SelectTrigger enforceWhite>
                      <SelectValue placeholder="Select your voluntary giving status" />
                    </SelectTrigger>
                    <SelectContent className="shad-select-content">
                      {G20ForcedToDoSoOpions.map((option: SelectOptions) => (
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

          <FormField
            control={form.control}
            name="motivation"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-1">
                  <FormLabel className="text-[#111c30] font-normal text-base">What is your conviction about giving to advance God's kingsom?</FormLabel>
                  <span className="text-red-500 text-base">*</span>
                </div>
                <FormControl>
                  <AuthTextArea
                    className="focus-visible:ring-0 focus-visible:ring-offset-0 min-h-32"
                    {...field}
                    placeholder="Why do you want to be a member of the House of Great?"
                    rows={4}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className=" grid grid-cols-1 space-y-3 md:space-y-0  md:grid-cols-2 gap-x-2">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-1">
                    <FormLabel className="text-[#111c30] font-normal text-base">Password</FormLabel>
                    <span className="text-red-500 text-base">*</span>
                  </div>
                  <FormControl>
                    <div className="relative">
                      <AuthInput
                        disabled={isPending}
                        type={showPassword ? "text" : "password"}
                        placeholder="******"
                        className="focus-visible:ring-0  h-12 focus-visible:ring-offset-0 pr-10"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute focus-visible:ring-0 focus-visible:ring-offset-0 right-2 top-1/2 -translate-y-1/2 text-sm text-gray-600"
                      >
                        {showPassword ? <Eye size={18} className="text-gray-600/70" /> : <EyeOff size={18} className="text-gray-600/70" />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirm_password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-1">
                    <FormLabel className="text-[#111c30] font-normal text-base">Confirm Password</FormLabel>
                    <span className="text-red-500 text-base">*</span>
                  </div>
                  <FormControl>
                    <div className="relative">
                      <AuthInput
                        disabled={isPending}
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="******"
                        className="focus-visible:ring-0  h-12 focus-visible:ring-offset-0 pr-10"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-600/70"
                      >
                        {showConfirmPassword ? <Eye size={18} className="text-gray-600/70" /> : <EyeOff size={18} className="text-gray-600/70" />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="py-4 flex flex-col gap-2">
            <FormField
              control={form.control}
              name="attestation"
              render={({ field }) => (
                <FormItem className="flex space-x-3 space-y-0 items-center py-2">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none text-sm">
                    <div className="text-[#111c30]">
                      I acknowledge that my giving is an expression of my love for Christ and a commitment to the advancement of the Kingdom of God. I confirm
                      that all seed or offerings given were voluntary, made without any form of coercion, pressure, or manipulation, and given willingly from a
                      heart of faithfulness and devotion to God.
                    </div>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="accept_terms"
              render={({ field }) => (
                <FormItem className="flex space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      // className="mt-1"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none text-sm">
                    <div className="text-[#111c30] flex flex-col">
                      By creating an account, you agree to the Global Gospel Partnership{" "}
                      <span className="">
                        <a href="/terms-and-conditions" className="text-GGP-darkGold underline">
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="/privacy-policy" className="text-GGP-darkGold underline">
                          Privacy Policy
                        </a>{" "}
                        .
                      </span>
                    </div>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>

          {/* {success && (
         <SuccessForm message={success}/>
       )} */}
          {/* {error && (
         <ErrorForm message={error}/>
      )} */}
          <Button disabled={isPending} className="w-full text-sm cursor-pointer" size="lg" variant={"custom"} type="submit">
            {isPending ? "Submitting.." : "Create an account"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
