import * as z from "zod";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";

import { g20UpdateAuthSchema } from "@/lib/schemas";
import { useAppSelector } from "@/redux/hooks";
import { updateUser } from "@/services/auth";
import { SuccessHandler, ErrorHandler } from "@/lib/toastHandlers";
import { monthsOfTheYearOptions, RemissionDayOptions } from "@/lib/utils";
import { G20ForcedToDoSoOpions } from "@/constants/index";
import { SelectOptions } from "@/interfaces/register";

import { CardWrapper } from "../Card-wapper";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { AuthTextArea } from "@/components/ui/textArea";
import { AuthInput } from "../ui/authInput";

import Logo from "../../assets/G20_logo.png";
import { getG20CategoryOptions } from "@/lib/g20Categories";
import { initialiseAdminOptions } from "@/lib/utils";

export const UpdateForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const authState = useAppSelector((state) => state.auth);
  const appState = useAppSelector((state) => state.app);
  const isAuthenticated = authState.authenticated;
  const userDetails = useAppSelector((state) => state.auth.userDetails);
  const email = userDetails?.email || "";
  const { PresidentOptions } = initialiseAdminOptions(appState);
  const fromRegistration = Boolean((location.state as { fromRegistration?: boolean } | null)?.fromRegistration);
  const shouldShowPreview = !fromRegistration;
  const shouldShowMarriageFields = !fromRegistration && userDetails?.married == null;

  const form = useForm<z.infer<typeof g20UpdateAuthSchema>>({
    resolver: zodResolver(g20UpdateAuthSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      phone_number: "",
      birth_day: "",
      birth_month: "",
      married: "No",
      anniversary_day: "",
      anniversary_month: "",
      require_married: true,
      president_id: "",
      g20_category: "",
      g20_amount: 0,
      voluntary_participation: "Yes",
      motivation: "",
      attestation: false,
    },
  });

  const [isPending, setIsPending] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const married = form.watch("married");
  const g20CategoryOptions = getG20CategoryOptions({
    chapterId: userDetails?.chapter_id,
    locationCurrency: appState.locationCurrency,
    fallbackCurrency: appState.fallbackCurrency,
  });

  const onSubmit = async (values: z.infer<typeof g20UpdateAuthSchema>) => {
    try {
      if (!email || !userDetails?.id) {
        ErrorHandler("Please login to update your details.");
        navigate("/login?redirectTo=/update");
        return;
      }

      if (values.voluntary_participation === "No") {
        ErrorHandler("Giving is voluntary. Please review the membership requirements before proceeding.");
        window.location.assign("/#requirements");
        return;
      }

      setIsPending(true);

      const resolvedMarried = shouldShowMarriageFields ? values.married === "Yes" : userDetails?.married;
      const resolvedAnniversary = shouldShowMarriageFields
        ? values.married === "Yes" && values.anniversary_month && values.anniversary_day
          ? dayjs()
              .month(parseInt(values.anniversary_month) - 1)
              .date(parseInt(values.anniversary_day))
              .format("YYYY-MM-DD")
          : null
        : userDetails?.marriage_anniversary || null;
      const resolvedDateOfBirth =
        values.birth_month && values.birth_day
          ? dayjs()
              .month(parseInt(values.birth_month) - 1)
              .date(parseInt(values.birth_day))
              .toISOString()
          : userDetails?.date_of_birth || null;
      const selectedPresident = PresidentOptions.find((president) => president.value === values.president_id);

      const updatedUser = await updateUser({
        id: userDetails.id,
        first_name: values.first_name,
        last_name: values.last_name,
        phone_number: values.phone_number,
        date_of_birth: resolvedDateOfBirth,
        married: resolvedMarried,
        marriage_anniversary: resolvedAnniversary,
        president_id: values.president_id || userDetails?.president_id || null,
        governor_id: selectedPresident?.governor_id || userDetails?.governor_id || null,
        shepherd_id: selectedPresident?.shepherd_id || userDetails?.shepherd_id || null,
        g20_category: values.g20_category,
        g20_amount: Math.round(values.g20_amount),
        voluntary_participation: values.voluntary_participation === "Yes",
        motivation: values.motivation,
        attestation: values.attestation,
        g20_active: true,
        g20_status: userDetails?.g20_status || "passive",
      });

      if (!updatedUser) {
        throw new Error("Unable to update account");
      }

      SuccessHandler("Updated successfully");
      setTimeout(() => {
        navigate("/proposed-schedule");
      }, 500);
    } catch (error: any) {
      console.log("g20 update error", error);
      ErrorHandler(error?.message || "Something went wrong");
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login?redirectTo=/update");
      return;
    }

    if (userDetails?.g20_active) {
      if (userDetails?.proposed_payment_scheduled) {
        navigate("/dashboard");
      } else {
        navigate("/proposed-schedule");
      }
      return;
    }

    form.reset({
      first_name: userDetails?.first_name || "",
      last_name: userDetails?.last_name || "",
      phone_number: userDetails?.phone_number || "",
      birth_day: userDetails?.date_of_birth ? dayjs(userDetails.date_of_birth).format("DD") : "",
      birth_month: userDetails?.date_of_birth ? dayjs(userDetails.date_of_birth).format("MM") : "",
      married: userDetails?.married ? "Yes" : "No",
      anniversary_day: userDetails?.marriage_anniversary ? dayjs(userDetails.marriage_anniversary).format("DD") : "",
      anniversary_month: userDetails?.marriage_anniversary ? dayjs(userDetails.marriage_anniversary).format("MM") : "",
      require_married: shouldShowMarriageFields,
      president_id: userDetails?.president_id || "",
      g20_category: userDetails?.g20_category || "",
      g20_amount: userDetails?.g20_amount || 0,
      voluntary_participation: userDetails?.voluntary_participation ? "Yes" : "No",
      motivation: userDetails?.motivation || "",
      attestation: !!userDetails?.attestation,
    });
  }, [form, isAuthenticated, navigate, shouldShowMarriageFields, userDetails]);

  return (
    <CardWrapper titleImg={Logo} headerLabel="Update your G20 account" backButtonLabel="" backButtenHref="" isRegister>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 mx-auto">
          <AuthInput disabled type="email" value={email} className="focus-visible:ring-0 h-12 focus-visible:ring-offset-0" />

          {shouldShowPreview && (
            <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-[#111c30]">Personal details preview</p>
                  <p className="text-xs text-slate-600">Open this section if you need to adjust your basic details before continuing.</p>
                </div>
                <Button type="button" variant="outline" onClick={() => setShowPreview((prev) => !prev)}>
                  {showPreview ? "Hide details" : "Show details"}
                </Button>
              </div>

              {showPreview && (
                <div className="mt-4 space-y-3">
                  <div className="lg:grid grid-cols-2 gap-2 space-y-3 md:space-y-0">
                    <FormField
                      control={form.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#111c30] font-normal text-base">First Name</FormLabel>
                          <FormControl>
                            <AuthInput disabled={isPending} className="focus-visible:ring-0 h-12 focus-visible:ring-offset-0" {...field} />
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
                          <FormLabel className="text-[#111c30] font-normal text-base">Last Name</FormLabel>
                          <FormControl>
                            <AuthInput disabled={isPending} className="focus-visible:ring-0 h-12 focus-visible:ring-offset-0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="lg:grid grid-cols-2 gap-2 space-y-3 md:space-y-0">
                    <FormField
                      control={form.control}
                      name="phone_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#111c30] font-normal text-base">Phone Number</FormLabel>
                          <FormControl>
                            <AuthInput disabled={isPending} className="focus-visible:ring-0 h-12 focus-visible:ring-offset-0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="w-full">
                      <div className="flex items-center gap-1 pb-2">
                        <FormLabel className="text-[#111c30] font-normal text-base">Birthday</FormLabel>
                      </div>
                      <div className="flex gap-x-1">
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
                          name="birth_day"
                          render={({ field }) => (
                            <FormItem className="w-full flex-1">
                              <FormControl>
                                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                  <SelectTrigger className="w-full h-12" enforceWhite>
                                    <SelectValue placeholder="Birth Day" />
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
                  </div>
                </div>
              )}
            </div>
          )}

          {shouldShowMarriageFields && (
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

              {married === "Yes" && (
                <div>
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
          )}

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
          </div>

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

          <FormField
            control={form.control}
            name="attestation"
            render={({ field }) => (
              <FormItem className="flex space-x-3 space-y-0 items-center py-2">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none text-md">
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

          <Button disabled={isPending} className="w-full text-sm cursor-pointer" size="lg" variant={"custom"} type="submit">
            {isPending ? "Updating.." : "Update Account"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
