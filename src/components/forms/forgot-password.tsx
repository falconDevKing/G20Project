import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import "react-phone-number-input/style.css";
import { useState } from "react";
import { forgotPassword } from "@/lib/schemas";
import { CardWrapper } from "../Card-wapper";
import { resetPassword } from "aws-amplify/auth";
import { ErrorHandler, SuccessHandler } from "@/lib/toastHandlers";
import Logo from "../../assets/G20_logo.png";
import { useNavigate } from "react-router";
import { AuthInput } from "../ui/authInput";

export const ForgotPasswordForm = () => {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof forgotPassword>>({
    resolver: zodResolver(forgotPassword),
    defaultValues: {
      email: "",
    },
  });

  const [isPending, setIsPending] = useState(false);
  // const [error, setError] = useState<string | undefined>('')
  // const [success, setSuccess] = useState<string | undefined>('')
  const [isCompleteField, setIsCompleteField] = useState(false);

  const onSubmit = async (values: z.infer<typeof forgotPassword>) => {
    try {
      setIsPending(true);

      const { email } = values;
      // Additional form input check to avoid spamming
      if (email) {
        setIsCompleteField(true);
        await resetPassword({
          username: email,
        });
        SuccessHandler("Reset request successfully");
        navigate(`/reset-password`);
        // navigate to resetpage
      } else {
        setIsCompleteField(false);
      }
    } catch (error) {
      console.log("request reset error", error);
      ErrorHandler("Something went wrong");
    } finally {
      setIsPending(false);
      setIsCompleteField(false);
    }
  };

  return (
    <CardWrapper
      titleImg={Logo}
      headerLabel="Request password reset"
      backButtenHref="/login"
      backButtonLabel="Back to Login"
      // tradeMark="© 2025 GGP"
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
