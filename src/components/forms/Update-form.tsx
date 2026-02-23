import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { useState } from "react";
import { g20UpdateAuthSchema } from "@/lib/schemas";
import { CardWrapper } from "../Card-wapper";
import { AuthTextArea } from "@/components/ui/textArea";
import { G20Categories, G20ForcedToDoSoOpions, } from "@/constants/index";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
// import { CovenantEntry, GGPCategories, type CurrencyCode } from "../../constants/index";
import { SelectOptions } from "@/interfaces/register";

import { useNavigate } from "react-router";
import { useAppSelector } from "@/redux/hooks";
import { monthsOfTheYearOptions, RemissionDayOptions } from "@/lib/utils";
import { SuccessHandler, ErrorHandler } from "@/lib/toastHandlers";

import { Checkbox } from "../ui/checkbox";
import Logo from "../../assets/G20_logo.png";
import dayjs from "dayjs";
import { AuthInput } from "../ui/authInput";
import { dummyFunction } from "@/interfaces/tools";


export const UpdateForm = () => {
  const navigate = useNavigate();

  // const appState = useAppSelector((state) => state.app);
  const userDetails = useAppSelector((state) => state.auth.userDetails);
  const email = (userDetails?.email || '') as string


  // const { locationCurrency, fallbackCurrency } = appState;

  const form = useForm<z.infer<typeof g20UpdateAuthSchema>>({
    resolver: zodResolver(g20UpdateAuthSchema),
    defaultValues: {
      married: "No",
      anniversary_day: "",
      anniversary_month: "",
      g20_category: "",
      g20_amount: 0,
      voluntary_participation: "Yes",
      motivation: "",
      attestation: false,
    },
  });

  const [isPending, setIsPending] = useState<boolean>(false);

  const onSubmit = async (values: z.infer<typeof g20UpdateAuthSchema>) => {
    try {
      const { married, anniversary_day, anniversary_month, g20_category, g20_amount, voluntary_participation, motivation, attestation } = values;

      // Additional form input check to avoid spamming
      if (!email) {
        ErrorHandler("Please login (or provide ?email=) to update your details.");
        navigate(`/login?redirectTo=/update`);
        return;
      }

      setIsPending(true);

      // await submitG20Update(email, {
      //   married: values.married,
      //   marriage_anniversary: values.marriage_anniversary || null,
      //   g20_category: values.g20_category,
      //   amount: String(values.g20_amount),
      //   voluntary_participation: values.voluntary_participation,
      //   motivation: values.motivation,
      //   attestation: values.attestation,
      // });
      dummyFunction({
        email,
        married: married,
        marriage_anniversary: anniversary_month && anniversary_day
          ? dayjs()
            .month(parseInt(anniversary_month) - 1)
            .date(parseInt(anniversary_day))
            .toISOString()
          : null,
        g20_category: g20_category,
        amount: String(g20_amount),
        voluntary_participation: voluntary_participation,
        motivation: motivation,
        attestation: attestation,
      });

      SuccessHandler("Updated successfully");
      setTimeout(() => {
        // navigate(redirectTo || "/history");
        navigate("/dashboard");
      }, 1500);
    } catch (error: any) {
      console.log("g20 update error", error);
      ErrorHandler(error?.message || "Something went wrong");

    } finally {
      setIsPending(false);
    }
  };

  const married = form.watch("married");

  return (
    <CardWrapper
      titleImg={Logo}
      headerLabel="Update your account"
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
          <div className=" lg:grid grid-cols-1 gap-2 space-y-3 md:space-y-0">
            <AuthInput
              disabled={true}
              type="email"
              placeholder="smith@gmail.com"
              value={email}
              className=" focus-visible:ring-0  h-12 focus-visible:ring-offset-0"
            />
          </div>

          <div className={`md:grid grid-cols-${married === "Yes" ? "2" : "1"} gap-2`}>
            <FormField
              control={form.control}
              name="married"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-1">
                    <FormLabel className="text-gray-600/90 font-normal text-base">Married</FormLabel>
                    <span className="text-red-500 text-base">*</span>
                  </div>
                  <FormControl>
                    <Select disabled={isPending} value={field.value} defaultValue={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="h-12" enforceWhite>
                        <SelectValue placeholder="Select an option" />
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
            {married === "Yes" && (
              <div className="">
                <div className="flex items-center gap-1 pb-2">
                  <FormLabel className="text-gray-600/90 font-normal text-base">Anniversary Day</FormLabel>
                  <span className="text-red-500 text-base">*</span>
                </div>
                <div className="flex gap-x-1">
                  <FormField
                    control={form.control}
                    name="anniversary_month"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select defaultValue={field.value} value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className="w-40 h-12" enforceWhite>
                              <SelectValue placeholder="Anniversary Month" />
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
                    name="anniversary_day"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                            <SelectTrigger className="w-28 h-12" enforceWhite>
                              <SelectValue placeholder="Day" />
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
              </div>)}

          </div>




          <div className={`lg:grid grid-cols-2   gap-2 space-y-3 md:space-y-0`}>
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
              name="g20_amount"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-1">
                    <FormLabel className="text-gray-600/90 font-normal text-base">Amount</FormLabel>
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
          </div>

          <div className={`lg:grid grid-cols-1 gap-2 space-y-3 md:space-y-0`}>

            <FormField
              control={form.control}
              name="voluntary_participation"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-1">
                    <FormLabel className="text-gray-600/90 font-normal text-base">Are you doing this of your own accord?</FormLabel>
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

          </div>

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
          </div>

          <div className=" py-2">
            <FormField
              control={form.control}
              name="attestation"
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
          <Button disabled={isPending} className="w-full text-sm cursor-pointer" size="lg" variant={"custom"} type="submit">
            {isPending ? "Updating.." : "Update Account"}
          </Button>
        </form>
      </Form>
    </CardWrapper >
  );
};
