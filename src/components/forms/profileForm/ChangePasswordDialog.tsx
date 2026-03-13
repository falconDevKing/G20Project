import * as z from "zod";
import { Eye, EyeOff } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { profilePasswordSchema } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type ChangePasswordDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  form: UseFormReturn<z.infer<typeof profilePasswordSchema>>;
  isPending: boolean;
  onSubmit: (values: z.infer<typeof profilePasswordSchema>) => Promise<void>;
  currentPasswordVisible: boolean;
  setCurrentPasswordVisible: (value: boolean | ((prev: boolean) => boolean)) => void;
  newPasswordVisible: boolean;
  setNewPasswordVisible: (value: boolean | ((prev: boolean) => boolean)) => void;
  confirmPasswordVisible: boolean;
  setConfirmPasswordVisible: (value: boolean | ((prev: boolean) => boolean)) => void;
  trigger?: React.ReactNode;
};

export const ChangePasswordDialog = ({
  open,
  setOpen,
  form,
  isPending,
  onSubmit,
  currentPasswordVisible,
  setCurrentPasswordVisible,
  newPasswordVisible,
  setNewPasswordVisible,
  confirmPasswordVisible,
  setConfirmPasswordVisible,
  trigger,
}: ChangePasswordDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent>
        <h2 className="mb-4 text-xl font-semibold">Change Password</h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
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
                        type={currentPasswordVisible ? "text" : "password"}
                        placeholder="******"
                        className="focus-visible:ring-0 focus-visible:ring-offset-0 pr-10"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setCurrentPasswordVisible((prev) => !prev)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-600 focus-visible:ring-0 focus-visible:ring-offset-0"
                      >
                        {currentPasswordVisible ? <Eye size={18} className="text-gray-600/70" /> : <EyeOff size={18} className="text-gray-600/70" />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="lg:grid grid-cols-2 gap-2 space-y-3 md:space-y-0">
              <FormField
                control={form.control}
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
                          type={newPasswordVisible ? "text" : "password"}
                          placeholder="******"
                          className="focus-visible:ring-0 focus-visible:ring-offset-0 pr-10"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setNewPasswordVisible((prev) => !prev)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-600 focus-visible:ring-0 focus-visible:ring-offset-0"
                        >
                          {newPasswordVisible ? <Eye size={18} className="text-gray-600/70" /> : <EyeOff size={18} className="text-gray-600/70" />}
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
                      <FormLabel className="text-gray-700/90 dark:text-gray-300/90 font-normal text-base">Confirm Password</FormLabel>
                      <span className="text-red-500 text-base">*</span>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Input
                          disabled={isPending}
                          type={confirmPasswordVisible ? "text" : "password"}
                          placeholder="******"
                          className="focus-visible:ring-0 focus-visible:ring-offset-0 pr-10"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setConfirmPasswordVisible((prev) => !prev)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-600 focus-visible:ring-0 focus-visible:ring-offset-0"
                        >
                          {confirmPasswordVisible ? <Eye size={18} className="text-gray-600/70" /> : <EyeOff size={18} className="text-gray-600/70" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex w-full lg:justify-end">
              <Button type="submit" className="max-sm:w-full" size={"lg"} variant={"custom"}>
                {isPending ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
