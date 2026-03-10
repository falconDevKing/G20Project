import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import "react-phone-number-input/style.css";
import { useState } from "react";
// import { SuccessForm } from './success-form'
// import { ErrorForm } from './error-form'
import { resetPassword } from "@/lib/schemas";
import { CardWrapper } from "../Card-wapper";
import { confirmResetPassword } from "aws-amplify/auth";
import { useNavigate, useSearchParams } from "react-router";
import { SuccessHandler, ErrorHandler } from "@/lib/toastHandlers";
import { Eye, EyeOff } from "lucide-react";
import Logo from "../../assets/G20_logo.png";
import { AuthInput } from "../ui/authInput";

export const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const email = searchParams.get("email") || "";
  const code = searchParams.get("code") || "";

  const form = useForm<z.infer<typeof resetPassword>>({
    resolver: zodResolver(resetPassword),
    defaultValues: {
      email,
      code,
      new_password: "",
      confirm_password: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isCompleteField, setIsCompleteField] = useState(false);

  const onSubmit = async (values: z.infer<typeof resetPassword>) => {
    try {
      setIsPending(true);

      // Additional form input check to avoid spamming
      if (values) {
        setIsCompleteField(true);
        const { email, code, new_password } = values;

        await confirmResetPassword({
          username: email,
          confirmationCode: code,
          newPassword: new_password,
        });
        SuccessHandler("Password reset successful");
        navigate(`/login`);
      } else {
        setIsCompleteField(false);
      }
    } catch (error) {
      console.log("reset password error", error);
      ErrorHandler("Reset password error");
    } finally {
      setIsPending(false);
      setIsCompleteField(false);
    }
  };

  return (
    <CardWrapper
      // title="GGP"
      titleImg={Logo}
      headerLabel="Request Password Reset"
      backButtenHref="/login"
      backButtonLabel="Back to Login"
      // showSocials
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 mx-auto">
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
            name="code"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-1">
                  <FormLabel className="text-[#111c30] font-normal text-base">Code</FormLabel>
                  <span className="text-red-500 text-base">*</span>
                </div>
                <FormControl>
                  <AuthInput disabled={isPending} type="text" placeholder="ABC123" className=" focus-visible:ring-0 focus-visible:ring-offset-0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="new_password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-1">
                  <FormLabel className="text-[#111c30] font-normal text-base">New password</FormLabel>
                  <span className="text-red-500 text-base">*</span>
                </div>
                <FormControl>
                  <div className="relative">
                    <AuthInput
                      {...field}
                      type={showPassword ? "text" : "password"}
                      className="focus-visible:ring-0 focus-visible:ring-offset-0"
                      placeholder="Enter new Password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute focus-visible:ring-0 focus-visible:ring-offset-0 right-2 top-1/2 -translate-y-1/2 text-sm text-gray-600"
                    >
                      {showPassword ? <Eye size={18} className="text-gray-600/70 " /> : <EyeOff size={18} className="text-gray-600/70" />}
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
                  <FormLabel className="text-[#111c30] font-normal text-base">Confirm password</FormLabel>
                  <span className="text-red-500 text-base">*</span>
                </div>
                <FormControl>
                  <div className="relative">
                    <AuthInput
                      {...field}
                      type={showPassword ? "text" : "password"}
                      className="focus-visible:ring-0 focus-visible:ring-offset-0"
                      placeholder="Re-enter new Password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute focus-visible:ring-0 focus-visible:ring-offset-0 right-2 top-1/2 -translate-y-1/2 text-sm text-gray-600"
                    >
                      {showPassword ? <Eye size={18} className="text-gray-600/70 " /> : <EyeOff size={18} className="text-gray-600/70" />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* {success && (
         <SuccessForm message={success}/>
       )} */}
          {/* {error && (
         <ErrorForm message={error}/>
      )} */}
          <Button variant={"custom"} disabled={isCompleteField || isPending} className="w-full text-sm cursor-pointer" size="lg" type="submit">
            {isPending ? "Submitting.." : "Reset password"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
