import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { useEffect, useState } from "react";
import { profileFormSchema, profilePasswordSchema } from "@/lib/schemas";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./../../../components/ui/select";
import { Countries, G20Categories } from "../../../constants/index";
import { Button } from "@/components/ui/button";
import { ProfileCardWrapper } from "./ProfileCard-wapper";
import { FileUpload } from "@/components/FileUpload";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Edit, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { updatePassword } from "aws-amplify/auth";

import { useAppSelector } from "@/redux/hooks";
import { initialiseOptions, genderOptions, monthsOfTheYearOptions, RemissionDayOptions } from "@/lib/utils";
import { SelectOptions } from "@/interfaces/register";
import { updateUser } from "@/services/auth";
import { getFileUrl } from "@/services/storage";
import { SuccessHandler, ErrorHandler } from "@/lib/toastHandlers";
import { PartnerRowType } from "@/supabase/modifiedSupabaseTypes";
import dayjs from "dayjs";
import { G20DashboardHeader } from "@/components/dashboard/g20DashboardHeader";

export const ProfileForm = () => {
  const user = useAppSelector((state) => state.auth.userDetails);
  const appState = useAppSelector((state) => state.app);

  const { DivisionOptions, ChapterOptions } = initialiseOptions(appState);

  const [userProfile, setUserProfile] = useState<PartnerRowType>(user as PartnerRowType);
  const [isOpenProfile, setIsOpenProfile] = useState(false);
  const [isOpenChangePassword, setIsOpenChangePassword] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [current_password, set_current_password] = useState(false);
  const [new_password, set_new_password] = useState(false);
  const [confirm_password, set_confirm_password] = useState(false);
  const [fileUrlToUse, setFileUrlToUse] = useState<string>();

  const profileFormInstance = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      unique_code: userProfile?.unique_code || "",
      last_name: userProfile?.last_name || "",
      first_name: userProfile?.first_name || "",
      phone_number: userProfile?.phone_number || "",
      image_url: userProfile?.image_url || "",
      address: userProfile?.address || "",
      gender: userProfile?.gender || "",
      nationality: userProfile?.nationality || "",
      birth_day: dayjs(userProfile?.date_of_birth).date().toString() || "1",
      birth_month: dayjs(userProfile?.date_of_birth).month().toString() || "0",

      email: userProfile?.email || "",
      division_id: userProfile?.division_id || "",
      chapter_id: userProfile?.chapter_id || "",
      g20_category: userProfile?.g20_category || "",
      g20_amount: userProfile?.g20_amount || 0,
      married: userProfile?.married ? "Yes" : "No",
      anniversary_day: userProfile?.marriage_anniversary ? dayjs(userProfile?.marriage_anniversary).format("DD") : "",
      anniversary_month: userProfile?.marriage_anniversary ? dayjs(userProfile?.marriage_anniversary).format("MM") : "",
      motivation: userProfile?.motivation || "",
    },
  });

  const passwordFormInstance = useForm<z.infer<typeof profilePasswordSchema>>({
    resolver: zodResolver(profilePasswordSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  const handleProfileSubmit = async (values: z.infer<typeof profileFormSchema>) => {
    try {
      setIsPending(false);

      const {
        last_name,
        first_name,
        phone_number,
        address,
        gender,
        image_url,
        nationality,
        birth_day,
        birth_month,
        g20_category,
        g20_amount,
        married,
        anniversary_day,
        anniversary_month,
        motivation,
      } = values;

      const userData = {
        id: userProfile.id,
        last_name,
        first_name,
        phone_number,
        address,
        gender,
        image_url,
        nationality,
        g20_category: g20_category || null,
        g20_amount: Number(g20_amount || 0),
        married: married === "Yes",
        marriage_anniversary:
          married === "Yes" && anniversary_month && anniversary_day
            ? dayjs()
                .month(parseInt(anniversary_month) - 1)
                .date(parseInt(anniversary_day))
                .format("YYYY-MM-DD")
            : null,
        motivation: motivation || null,
        date_of_birth:
          birth_month && birth_day
            ? dayjs()
                .month(parseInt(birth_month) - 1)
                .date(parseInt(birth_day))
                .toISOString()
            : userProfile?.date_of_birth,
        // birth_day_mmdd: date_of_birth ? dayjs(date_of_birth).format("MM-DD") : userProfile?.birth_day_mmdd || "",
      };

      const updatedUserProfile = await updateUser(userData);

      if (updatedUserProfile) {
        setUserProfile(updatedUserProfile);
        SuccessHandler("Profile updated");
        setIsOpenProfile(false);
      } else {
        throw new Error("Could update profile");
      }
    } catch (error) {
      console.log("update profile error", error);
      ErrorHandler("Something went wrong");
    } finally {
      setIsPending(false);
    }
  };

  const handlePasswordSubmit = async (values: z.infer<typeof profilePasswordSchema>) => {
    try {
      setIsPending(true);

      const { current_password, new_password } = values;
      await updatePassword({
        oldPassword: current_password,
        newPassword: new_password,
      });

      setIsOpenChangePassword(false);
      SuccessHandler("Password updated successfully");
    } catch (error) {
      console.log("update password error", error);
      ErrorHandler("Something went wrong");
    } finally {
      setIsPending(false);
    }
  };

  const filePath = user.image_url;

  useEffect(() => {
    const updateFileUrl = async () => {
      const fileUrl = await getFileUrl(filePath as string);
      setFileUrlToUse(fileUrl || "");
    };

    if (filePath) {
      updateFileUrl();
    }
  }, [filePath]);

  return (
    <>
      <G20DashboardHeader page="profile" />

      <ProfileCardWrapper>
        {/* Edit Profile Button */}

        <div className=" flex justify-end md:justify-between items-center mb-4 -mt-2">
          <Link
            to={"/dashboard"}
            className="max-w-fit gap-1 hidden md:flex items-center text-sm font-normal my-4 bg-GGP-lightWight text-GGP-dark p-2 rounded-md"
          >
            <ArrowLeft className=" h-4 w-4" />
            Dashboard
          </Link>
          <Dialog open={isOpenProfile} onOpenChange={setIsOpenProfile}>
            <DialogTrigger asChild>
              <Button variant="custom" onClick={() => setIsOpenProfile(true)}>
                <Edit />
                Edit Profile
              </Button>
            </DialogTrigger>

            <DialogContent>
              <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>

              {/* Profile Update Form */}
              <Form {...profileFormInstance}>
                <form onSubmit={profileFormInstance.handleSubmit(handleProfileSubmit)} className="space-y-4 w-full mx-auto">
                  <div className=" lg:grid grid-cols-3 gap-2 space-y-3 md:space-y-0">
                    <FormField
                      control={profileFormInstance.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-1">
                            <FormLabel className="text-gray-700/90 dark:text-gray-300/90 font-normal text-base">First Name</FormLabel>
                            <span className="text-red-500 text-base">*</span>
                          </div>
                          <FormControl>
                            <Input disabled={isPending} placeholder="Doe" className=" focus-visible:ring-0 focus-visible:ring-offset-0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={profileFormInstance.control}
                      name="last_name"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-1">
                            <FormLabel className="text-gray-700/90 dark:text-gray-300/90 font-normal text-base">Last Name</FormLabel>
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
                      disabled
                      control={profileFormInstance.control}
                      name="unique_code"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-1">
                            <FormLabel className="text-gray-700/90 dark:text-gray-300/90 font-normal text-base">Personal Code</FormLabel>
                            <span className="text-red-500 text-base">*</span>
                          </div>
                          <FormControl>
                            <Input disabled={isPending} placeholder="" className=" focus-visible:ring-0 focus-visible:ring-offset-0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className=" lg:grid grid-cols-3 gap-2 space-y-3 md:space-y-0">
                    <FormField
                      disabled
                      control={profileFormInstance.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-1">
                            <FormLabel className="text-gray-700/90 dark:text-gray-300/90 font-normal text-base">Email</FormLabel>
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
                      control={profileFormInstance.control}
                      name="phone_number"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-1">
                            <FormLabel className="text-gray-700/90 dark:text-gray-300/90 font-normal text-base">Phone Number</FormLabel>
                            <span className="text-red-500 text-base">*</span>
                          </div>
                          <FormControl>
                            <PhoneInput
                              className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>input]:border-none [&>input]:outline-none"
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

                    <FormField
                      control={profileFormInstance.control}
                      name="g20_category"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-1">
                            <FormLabel className="text-gray-700/90 dark:text-gray-300/90 font-normal text-base">G20 Category</FormLabel>
                          </div>
                          <FormControl>
                            <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                              <SelectTrigger className="shad-select-trigger">
                                <SelectValue placeholder="Select your G20 Category" />
                              </SelectTrigger>
                              <SelectContent className="shad-select-content">
                                {G20Categories.map((option) => (
                                  <SelectItem key={option.value} value={String(option.value)}>
                                    {option.name}
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

                  <div className="lg:grid grid-cols-3 gap-2 space-y-3 md:space-y-0">
                    <FormField
                      control={profileFormInstance.control}
                      name="g20_amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700/90 dark:text-gray-300/90 font-normal text-base">G20 Amount</FormLabel>
                          <FormControl>
                            <Input type="number" min={0} step={1} className="focus-visible:ring-0 focus-visible:ring-offset-0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={profileFormInstance.control}
                      name="married"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700/90 dark:text-gray-300/90 font-normal text-base">Married</FormLabel>
                          <FormControl>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger className="shad-select-trigger">
                                <SelectValue placeholder="Select an option" />
                              </SelectTrigger>
                              <SelectContent className="shad-select-content">
                                <SelectItem value="Yes">Yes</SelectItem>
                                <SelectItem value="No">No</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div>
                      <div className="flex items-center gap-1 pb-2">
                        <FormLabel className="text-gray-700/90 dark:text-gray-300/90 font-normal text-base">Marriage Anniversary</FormLabel>
                      </div>
                      <div className="flex gap-x-1">
                        <FormField
                          control={profileFormInstance.control}
                          name="anniversary_month"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Select defaultValue={field.value} value={field.value} onValueChange={field.onChange}>
                                  <SelectTrigger className="w-28 h-12 dark:border-white" allowDark={false} enforceWhite>
                                    <SelectValue placeholder="Month" />
                                  </SelectTrigger>
                                  <SelectContent className="shad-select-content">
                                    {monthsOfTheYearOptions.map((month: any) => (
                                      <SelectItem key={month.value} value={month.value}>
                                        {month.name}
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
                          control={profileFormInstance.control}
                          name="anniversary_day"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                  <SelectTrigger className="w-20 h-12 dark:border-white" allowDark={false} enforceWhite>
                                    <SelectValue placeholder="Day" />
                                  </SelectTrigger>
                                  <SelectContent className="shad-select-content">
                                    {RemissionDayOptions.map((dayOption: string) => (
                                      <SelectItem key={dayOption} value={dayOption}>
                                        {dayOption}
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

                  <div className="lg:grid grid-cols-1 gap-2 space-y-3 md:space-y-0">
                    <FormField
                      control={profileFormInstance.control}
                      name="motivation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700/90 dark:text-gray-300/90 font-normal text-base">Motivation</FormLabel>
                          <FormControl>
                            <Input
                              disabled={isPending}
                              type="text"
                              placeholder="Your conviction about giving"
                              className="focus-visible:ring-0 focus-visible:ring-offset-0"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className=" lg:grid grid-cols-1 gap-2 space-y-3 md:space-y-0">
                    <FormField
                      control={profileFormInstance.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-1">
                            <FormLabel className="text-gray-700/90 dark:text-gray-300/90 font-normal text-base">Address</FormLabel>
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

                  <div className=" lg:grid grid-cols-3 gap-2 space-y-3 md:space-y-0">
                    <div>
                      <div className="flex items-center gap-1 pb-2">
                        <FormLabel className="text-gray-700/90 dark:text-gray-300/90 font-normal text-base">Birth Day</FormLabel>
                        <span className="text-red-500 text-base">*</span>
                      </div>
                      <div className="flex gap-x-1">
                        <FormField
                          control={profileFormInstance.control}
                          name="birth_month"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Select defaultValue={field.value} value={field.value} onValueChange={field.onChange}>
                                  <SelectTrigger className="w-28 h-12 dark:border-white" allowDark={false} enforceWhite>
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
                          control={profileFormInstance.control}
                          name="birth_day"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                  <SelectTrigger className="w-20 h-12 dark:border-white" allowDark={false} enforceWhite>
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
                      control={profileFormInstance.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-1">
                            <FormLabel className="text-gray-700/90 dark:text-gray-300/90 font-normal text-base">Gender</FormLabel>
                            <span className="text-red-500 text-base">*</span>
                          </div>
                          <FormControl>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger className="shad-select-trigger">
                                <SelectValue placeholder="Select your Gender" />
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
                      control={profileFormInstance.control}
                      name="nationality"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-1">
                            <FormLabel className="text-gray-700/90 dark:text-gray-300/90 font-normal text-base">Nationality</FormLabel>
                            <span className="text-red-500 text-base">*</span>
                          </div>
                          <FormControl>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger className="shad-select-trigger">
                                <SelectValue placeholder="Select your Nationality" />
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

                  <div className=" lg:grid grid-cols-2 gap-2 space-y-3 md:space-y-0">
                    <FormField
                      disabled
                      control={profileFormInstance.control}
                      name="division_id"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-1">
                            <FormLabel className="text-gray-700/90 dark:text-gray-300/90 font-normal text-base">Division</FormLabel>
                            <span className="text-red-500 text-base">*</span>
                          </div>
                          <FormControl>
                            <Select disabled onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger className="shad-select-trigger">
                                <SelectValue placeholder="Select your Division" />
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
                      disabled
                      control={profileFormInstance.control}
                      name="chapter_id"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-1">
                            <FormLabel className="text-gray-700/90 dark:text-gray-300/90 font-normal text-base">Chapter</FormLabel>
                            <span className="text-red-500 text-base">*</span>
                          </div>
                          <FormControl>
                            <Select disabled onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger className="shad-select-trigger">
                                <SelectValue placeholder="Select your Chapter" />
                              </SelectTrigger>
                              <SelectContent className="shad-select-content">
                                {ChapterOptions.map((chapter: SelectOptions) => (
                                  <SelectItem key={chapter.value} value={chapter.value as string}>
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
                  </div>

                  <FormField
                    control={profileFormInstance.control}
                    name="image_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className=" text-gray-700/90 dark:text-gray-300/90 font-normal text-base">Profile image</FormLabel>

                        <FormControl>
                          <FileUpload user_id={user.id} filePath={field.value} onChange={field.onChange} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button className="w-full text-sm cursor-pointer" size="lg" variant={"custom"} type="submit">
                    {isPending ? "Submitting.." : "Update Profile"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="">
          <div className=" w-full md:w-1/2 pb-7">
            <p className="text-2xl font-semibold">Personal info</p>
            <p className="text-sm text-gray-500">Update your photo and personal details here.</p>
          </div>
          <hr className="py-4" />

          <Form {...profileFormInstance}>
            <form className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6 justify-between ">
                {/* Text Section */}
                <div className=" w-full md:w-1/2">
                  <p className="text-base font-semibold">Your photo</p>
                  <p className="text-sm text-gray-500">This will be displayed on your profile.</p>
                </div>

                {/* Profile Image */}
                <div className="w-24 h-24 rounded-full overflow-hidden border border-gray-200">
                  {user?.image_url ? (
                    <img src={fileUrlToUse} alt="Profile Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full w-full bg-gray-100">
                      <svg className="w-12 h-12 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.75 0 5-2.25 5-5s-2.25-5-5-5-5 2.25-5 5 2.25 5 5 5zm0 2c-4.418 0-8 3.582-8 8h16c0-4.418-3.582-8-8-8z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Read-only Upload Placeholder */}
                {/* <div className="flex-1 max-sm:hidden">
                <div className="border border-dashed border-gray-300 rounded-md h-40 flex flex-col justify-center items-center">
                  <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V4m0 8l-4-4m4 4l4-4" />
                  </svg>
                  <p className="text-sm font-medium text-yellow-700 mt-1">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-400">SVG, PNG, JPG or GIF (max. 800×400px)</p>
                </div>
              </div> */}
              </div>
            </form>
          </Form>
          <hr className=" mt-7" />

          <div className="lg:flex space-y-7 py-7 items-center gap-x-9">
            <Form {...profileFormInstance}>
              <form className="space-y-4 mx-auto w-full">
                <div className=" lg:grid grid-cols-3 gap-2 space-y-3 md:space-y-0">
                  <div className=" space-y-2">
                    <FormLabel className=" text-gray-700/90 dark:text-gray-300/90 font-normal text-base">First Name</FormLabel>
                    <Input
                      readOnly
                      value={user.first_name}
                      className="focus-visible:ring-0 cursor-not-allowed focus-visible:ring-offset-0"
                      placeholder="First Name"
                    />
                  </div>

                  <div className=" space-y-2">
                    <FormLabel className=" text-gray-700/90 dark:text-gray-300/90 font-normal text-base">Last Name</FormLabel>
                    <Input
                      readOnly
                      value={user.last_name}
                      className="focus-visible:ring-0 cursor-not-allowed focus-visible:ring-offset-0"
                      placeholder="Last Name"
                    />
                  </div>

                  <div className=" space-y-2">
                    <FormLabel className=" text-gray-700/90 dark:text-gray-300/90 font-normal text-base">Personal Code</FormLabel>
                    <Input
                      readOnly
                      value={user.unique_code || ""}
                      className="focus-visible:ring-0 cursor-not-allowed focus-visible:ring-offset-0"
                      placeholder="Unique Code"
                    />
                  </div>
                </div>

                <div className=" lg:grid grid-cols-3 gap-2 space-y-3 md:space-y-0">
                  <div className=" space-y-2">
                    <FormLabel className=" text-gray-700/90 dark:text-gray-300/90 font-normal text-base">Email</FormLabel>
                    <Input readOnly value={user.email} className="focus-visible:ring-0 cursor-not-allowed focus-visible:ring-offset-0" placeholder="Email" />
                  </div>

                  <FormItem>
                    <FormLabel className=" text-gray-700/90 dark:text-gray-300/90 font-normal text-base">Phone number</FormLabel>
                    <FormControl>
                      <div className="pointer-events-none">
                        <PhoneInput
                          readOnly
                          className="flex h-11 w-full cursor-not-allowed rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>input]:border-none [&>input]:outline-none"
                          international
                          onChange={() => {}}
                          value={user.phone_number || ""}
                          defaultCountry="GB"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>

                  <div className=" space-y-2">
                    <FormLabel className=" text-gray-700/90 dark:text-gray-300/90 font-normal text-base">G20 Category</FormLabel>
                    <Input
                      readOnly
                      value={user.g20_category || ""}
                      className="focus-visible:ring-0 cursor-not-allowed focus-visible:ring-offset-0"
                      placeholder="G20 Category"
                    />
                  </div>
                </div>

                <div className=" lg:grid grid-cols-3 gap-2 space-y-3 md:space-y-0">
                  <div className=" space-y-2">
                    <FormLabel className=" text-gray-700/90 dark:text-gray-300/90 font-normal text-base">G20 Amount</FormLabel>
                    <Input
                      readOnly
                      value={user.g20_amount || 0}
                      className="focus-visible:ring-0 cursor-not-allowed focus-visible:ring-offset-0"
                      placeholder="G20 Amount"
                    />
                  </div>

                  <div className=" space-y-2">
                    <FormLabel className=" text-gray-700/90 dark:text-gray-300/90 font-normal text-base">Married</FormLabel>
                    <Input
                      readOnly
                      value={user.married ? "Yes" : "No"}
                      className="focus-visible:ring-0 cursor-not-allowed focus-visible:ring-offset-0"
                      placeholder="Married"
                    />
                  </div>

                  <div className=" space-y-2">
                    <FormLabel className=" text-gray-700/90 dark:text-gray-300/90 font-normal text-base">Marriage Anniversary</FormLabel>
                    <Input
                      readOnly
                      value={user.marriage_anniversary ? dayjs(user.marriage_anniversary).format("DD MMMM") : ""}
                      className="focus-visible:ring-0 cursor-not-allowed focus-visible:ring-offset-0"
                      placeholder="Marriage Anniversary"
                    />
                  </div>
                </div>

                <div className=" lg:grid grid-cols-1 gap-2 space-y-3 md:space-y-0">
                  <div className=" space-y-2">
                    <FormLabel className=" text-gray-700/90 dark:text-gray-300/90 font-normal text-base">Address</FormLabel>
                    <Input
                      readOnly
                      value={user.address || ""}
                      className="focus-visible:ring-0 cursor-not-allowed focus-visible:ring-offset-0"
                      placeholder="Address"
                    />
                  </div>
                </div>

                <div className=" lg:grid grid-cols-1 gap-2 space-y-3 md:space-y-0">
                  <div className=" space-y-2">
                    <FormLabel className=" text-gray-700/90 dark:text-gray-300/90 font-normal text-base">Motivation</FormLabel>
                    <Input
                      readOnly
                      value={user.motivation || ""}
                      className="focus-visible:ring-0 cursor-not-allowed focus-visible:ring-offset-0"
                      placeholder="Motivation"
                    />
                  </div>
                </div>

                <div className=" lg:grid grid-cols-3 gap-2 space-y-3 md:space-y-0">
                  <div className=" space-y-2">
                    <FormLabel className=" text-gray-700/90 dark:text-gray-300/90 font-normal text-base">Date of Birth</FormLabel>
                    <Input
                      readOnly
                      value={user.date_of_birth ? dayjs(user.date_of_birth).format("DD MMMM") : ""}
                      className="focus-visible:ring-0 cursor-not-allowed focus-visible:ring-offset-0"
                      placeholder="Date of Birth"
                    />
                  </div>

                  <div className=" space-y-2">
                    <FormLabel className=" text-gray-700/90 dark:text-gray-300/90 font-normal text-base">Gender</FormLabel>
                    <Input
                      readOnly
                      value={user.gender || ""}
                      className="focus-visible:ring-0 cursor-not-allowed focus-visible:ring-offset-0"
                      placeholder="Gender"
                    />
                  </div>

                  <div className=" space-y-2">
                    <FormLabel className=" text-gray-700/90 dark:text-gray-300/90 font-normal text-base">Nationality</FormLabel>
                    <Input
                      readOnly
                      value={Countries.find((country) => country.value === user.nationality)?.label || ""}
                      className="focus-visible:ring-0 cursor-not-allowed focus-visible:ring-offset-0"
                      placeholder="Nationality"
                    />
                  </div>
                </div>

                <div className=" lg:grid grid-cols-2 gap-2 space-y-3 md:space-y-0">
                  <div className=" space-y-2">
                    <FormLabel className=" text-gray-700/90 dark:text-gray-300/90 font-normal text-base">Division</FormLabel>
                    <Input
                      readOnly
                      value={DivisionOptions.find((division) => division.value === user.division_id)?.name || ""}
                      className="focus-visible:ring-0 cursor-not-allowed focus-visible:ring-offset-0"
                      placeholder="Division"
                    />
                  </div>

                  <div className=" space-y-2">
                    <FormLabel className=" text-gray-700/90 dark:text-gray-300/90 font-normal text-base">Chapter</FormLabel>
                    <Input
                      readOnly
                      value={ChapterOptions.find((chapter) => chapter.value === user.chapter_id)?.name || ""}
                      className="focus-visible:ring-0 cursor-not-allowed focus-visible:ring-offset-0"
                      placeholder="Chapter"
                    />
                  </div>
                </div>
              </form>
            </Form>
          </div>

          <Form {...passwordFormInstance}>
            <form className=" mx-auto py-12  ">
              <h3 className="text-lg font-semibold  dark:text-white text-GGP-dark/75 rounded-md">Change Password</h3>
              <p className="text-[#535862] font-normal text-sm dark:text-white">You can change your password here</p>
              {/* change password dialog */}
              <div className=" flex justify-end mb-4 mt-9">
                <Dialog open={isOpenChangePassword} onOpenChange={setIsOpenChangePassword}>
                  <DialogTrigger asChild>
                    <Button variant="custom" onClick={() => setIsOpenChangePassword(true)}>
                      <Edit />
                      Change password
                    </Button>
                  </DialogTrigger>

                  <DialogContent>
                    <h2 className="text-xl font-semibold mb-4">Change Password</h2>

                    {/* Password Change Form */}
                    <Form {...passwordFormInstance}>
                      <form onSubmit={passwordFormInstance.handleSubmit(handlePasswordSubmit)} className="space-y-4">
                        <FormField
                          control={passwordFormInstance.control}
                          name="current_password"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center gap-1">
                                <FormLabel className="text-gray-700/90 dark:text-gray-300/90 font-normal text-base">Current Password</FormLabel>
                                <span className="text-red-500 text-base">*</span>
                              </div>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    disabled={isPending}
                                    type={current_password ? "text" : "password"}
                                    placeholder="******"
                                    className="focus-visible:ring-0 focus-visible:ring-offset-0 pr-10"
                                    {...field}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => set_current_password((prev) => !prev)}
                                    className="absolute focus-visible:ring-0 focus-visible:ring-offset-0 right-2 top-1/2 -translate-y-1/2 text-sm text-gray-600"
                                  >
                                    {current_password ? <Eye size={18} className="text-gray-600/70  " /> : <EyeOff size={18} className="text-gray-600/70" />}
                                  </button>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className=" lg:grid grid-cols-2 gap-2 space-y-3 md:space-y-0">
                          <FormField
                            control={passwordFormInstance.control}
                            name="new_password"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center gap-1">
                                  <FormLabel className="text-gray-700/90 dark:text-gray-300/90 font-normal text-base">New Password</FormLabel>
                                  <span className="text-red-500 text-base">*</span>
                                </div>
                                <FormControl>
                                  <div className="relative">
                                    <Input
                                      disabled={isPending}
                                      type={new_password ? "text" : "password"}
                                      placeholder="******"
                                      className="focus-visible:ring-0 focus-visible:ring-offset-0 pr-10"
                                      {...field}
                                    />
                                    <button
                                      type="button"
                                      onClick={() => set_new_password((prev) => !prev)}
                                      className="absolute focus-visible:ring-0 focus-visible:ring-offset-0 right-2 top-1/2 -translate-y-1/2 text-sm text-gray-600"
                                    >
                                      {new_password ? <Eye size={18} className="text-gray-600/70 " /> : <EyeOff size={18} className="text-gray-600/70" />}
                                    </button>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={passwordFormInstance.control}
                            name="confirm_password"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center gap-1">
                                  <FormLabel className="text-gray-700/90 dark:text-gray-300/90 font-normal text-base">Confirm Password</FormLabel>
                                  <span className="text-red-500 text-base">*</span>
                                </div>
                                <FormControl>
                                  <div className="relative">
                                    <Input
                                      disabled={isPending}
                                      type={confirm_password ? "text" : "password"}
                                      placeholder="******"
                                      className="focus-visible:ring-0 focus-visible:ring-offset-0 pr-10"
                                      {...field}
                                    />
                                    <button
                                      type="button"
                                      onClick={() => set_confirm_password((prev) => !prev)}
                                      className="absolute focus-visible:ring-0 focus-visible:ring-offset-0 right-2 top-1/2 -translate-y-1/2 text-sm text-gray-600"
                                    >
                                      {confirm_password ? <Eye size={18} className="text-gray-600/70 " /> : <EyeOff size={18} className="text-gray-600/70" />}
                                    </button>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="flex lg:justify-end w-full">
                          <Button type="submit" className=" max-sm:w-full" size={"lg"} variant={"custom"}>
                            {isPending ? "Updating..." : "Update Password"}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
              <div className=" space-y-2 mb-4">
                <FormLabel className="text-gray-700/90 dark:text-gray-300/90 dark:text-white font-normal text-base">Current password</FormLabel>
                <Input readOnly className="focus-visible:ring-0 cursor-not-allowed focus-visible:ring-offset-0" placeholder="Enter current Password" />
              </div>

              <div className=" lg:grid grid-cols-2 gap-2 space-y-3 md:space-y-0">
                <div className=" space-y-2 mb-4">
                  <FormLabel className="text-gray-700/90 dark:text-gray-300/90 dark:text-white font-normal text-base">New password</FormLabel>
                  <Input readOnly className="focus-visible:ring-0 cursor-not-allowed focus-visible:ring-offset-0" placeholder="Enter new password" />
                </div>

                <div className=" space-y-2">
                  <FormLabel className="text-gray-700/90 dark:text-gray-300/90 dark:text-white font-normal text-base">Confirm password</FormLabel>
                  <Input readOnly className="focus-visible:ring-0 cursor-not-allowed focus-visible:ring-offset-0" placeholder="Re-enter new Password" />
                </div>
              </div>
            </form>
          </Form>
        </div>
      </ProfileCardWrapper>
    </>
  );
};
