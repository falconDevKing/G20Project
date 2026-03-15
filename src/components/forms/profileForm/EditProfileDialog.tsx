import * as z from "zod";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { UseFormReturn } from "react-hook-form";

import { Countries } from "../../../constants/index";
import { SelectOptions } from "@/interfaces/register";
import { genderOptions, monthsOfTheYearOptions, RemissionDayOptions } from "@/lib/utils";
import { profileFormSchema } from "@/lib/schemas";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/FileUpload";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type EditProfileDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  form: UseFormReturn<z.infer<typeof profileFormSchema>>;
  isPending: boolean;
  onSubmit: (values: z.infer<typeof profileFormSchema>) => Promise<void>;
  userId: string;
  trigger?: React.ReactNode;
  DivisionOptions: SelectOptions[];
  ChapterOptions: SelectOptions[];
  g20CategoryOptions: SelectOptions[];
};

export const EditProfileDialog = ({
  open,
  setOpen,
  form,
  isPending,
  onSubmit,
  userId,
  trigger,
  DivisionOptions,
  ChapterOptions,
  g20CategoryOptions,
}: EditProfileDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent>
        <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full mx-auto">
            <div className="lg:grid grid-cols-3 gap-2 space-y-3 md:space-y-0">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-1">
                      <FormLabel className="text-gray-700/90 dark:text-gray-300/90 font-normal text-base">First Name</FormLabel>
                      <span className="text-red-500 text-base">*</span>
                    </div>
                    <FormControl>
                      <Input disabled={isPending} placeholder="Doe" className="focus-visible:ring-0 focus-visible:ring-offset-0" {...field} />
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
                      <FormLabel className="text-gray-700/90 dark:text-gray-300/90 font-normal text-base">Last Name</FormLabel>
                      <span className="text-red-500 text-base">*</span>
                    </div>
                    <FormControl>
                      <Input disabled={isPending} placeholder="Smith" className="focus-visible:ring-0 focus-visible:ring-offset-0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unique_code"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-1">
                      <FormLabel className="text-gray-700/90 dark:text-gray-300/90 font-normal text-base">Personal Code</FormLabel>
                      <span className="text-red-500 text-base">*</span>
                    </div>
                    <FormControl>
                      <Input disabled={isPending} className="focus-visible:ring-0 focus-visible:ring-offset-0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="lg:grid grid-cols-3 gap-2 space-y-3 md:space-y-0">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-1">
                      <FormLabel className="text-gray-700/90 dark:text-gray-300/90 font-normal text-base">Email</FormLabel>
                      <span className="text-red-500 text-base">*</span>
                    </div>
                    <FormControl>
                      <Input disabled={isPending} type="email" className="focus-visible:ring-0 focus-visible:ring-offset-0" {...field} />
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
                control={form.control}
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
                          {g20CategoryOptions.map((option) => (
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
                control={form.control}
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
                control={form.control}
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
                    control={form.control}
                    name="anniversary_month"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select defaultValue={field.value} value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className="w-28 h-12 dark:border-white" enforceWhite>
                              <SelectValue placeholder="Month" />
                            </SelectTrigger>
                            <SelectContent className="shad-select-content">
                              {monthsOfTheYearOptions.map((month: SelectOptions) => (
                                <SelectItem key={month.value} value={month.value as string}>
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
                    control={form.control}
                    name="anniversary_day"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                            <SelectTrigger className="w-20 h-12 dark:border-white" enforceWhite>
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
                control={form.control}
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

            <div className="lg:grid grid-cols-1 gap-2 space-y-3 md:space-y-0">
              <FormField
                control={form.control}
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
                        className="focus-visible:ring-0 focus-visible:ring-offset-0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="lg:grid grid-cols-3 gap-2 space-y-3 md:space-y-0">
              <div>
                <div className="flex items-center gap-1 pb-2">
                  <FormLabel className="text-gray-700/90 dark:text-gray-300/90 font-normal text-base">Birth Day</FormLabel>
                  <span className="text-red-500 text-base">*</span>
                </div>
                <div className="flex gap-x-1">
                  <FormField
                    control={form.control}
                    name="birth_month"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select defaultValue={field.value} value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className="w-28 h-12 dark:border-white" enforceWhite>
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
                      <FormItem>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                            <SelectTrigger className="w-20 h-12 dark:border-white" enforceWhite>
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

              <FormField
                control={form.control}
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
                          {genderOptions.map((option: SelectOptions) => (
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

            <div className="lg:grid grid-cols-2 gap-2 space-y-3 md:space-y-0">
              <FormField
                control={form.control}
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
                          {DivisionOptions.map((division) => (
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
                      <FormLabel className="text-gray-700/90 dark:text-gray-300/90 font-normal text-base">Chapter</FormLabel>
                      <span className="text-red-500 text-base">*</span>
                    </div>
                    <FormControl>
                      <Select disabled onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="shad-select-trigger">
                          <SelectValue placeholder="Select your Chapter" />
                        </SelectTrigger>
                        <SelectContent className="shad-select-content">
                          {ChapterOptions.map((chapter) => (
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
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700/90 dark:text-gray-300/90 font-normal text-base">Profile image</FormLabel>
                  <FormControl>
                    <FileUpload user_id={userId} filePath={field.value} onChange={field.onChange} />
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
  );
};
