import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import "react-phone-number-input/style.css";
import { useEffect, useState } from "react";
import { verifyEmail } from "@/lib/schemas";
import { CardWrapper } from "../Card-wapper";
import { useSearchParams, useNavigate } from "react-router";
import { confirmSignUp } from "aws-amplify/auth";
import { verifyUser } from "@/services/auth";
import { ErrorHandler, SuccessHandler } from "@/lib/toastHandlers";
import { AuthInput } from "../ui/authInput";

export const VerifyEmailForm = () => {
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const email = searchParams.get("email") || "";
  const code = searchParams.get("code") || "";

  const form = useForm<z.infer<typeof verifyEmail>>({
    resolver: zodResolver(verifyEmail),
    defaultValues: {
      code: code,
    },
  });

  const [isPending, setIsPending] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState<boolean>(false);

  const [isCompleteField, setIsCompleteField] = useState(false);

  const onSubmit = async (values: z.infer<typeof verifyEmail>) => {
    try {
      setIsPending(true);
      // Additional form input check to avoid spamming
      if (values) {
        setIsCompleteField(true);

        const { code: confirmationCode } = values;

        const { isSignUpComplete } = await confirmSignUp({
          username: email,
          confirmationCode,
        });

        await verifyUser(email);

        SuccessHandler("Email verified Successful" + isSignUpComplete);

        setIsVerified(true);
        setTimeout(() => {
          navigate(`/login`);
        }, 1000);
      } else {
        setIsCompleteField(false);
      }
    } catch (error) {
      console.log("verify error", error);
      ErrorHandler("Something went wrong");
    } finally {
      setIsCompleteField(false);
      setIsPending(false);
    }
  };

  useEffect(() => {
    if (email && code) {
      onSubmit({ code });
    }
  }, [email, code]);

  return (
    <CardWrapper
      // title="GGP"
      headerLabel={`Verify your email for  ${email}`}
      backButtenHref=""
      backButtonLabel=""
      // showSocials
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 mx-auto">
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

          {/* {success && (
         <SuccessForm message={success}/>
       )} */}
          {/* {error && (
         <ErrorForm message={error}/>
      )} */}
          <Button variant={"custom"} disabled={isCompleteField || isPending || isVerified} className="w-full text-sm cursor-pointer" size="lg" type="submit">
            {isPending ? "Verifying.." : "Verify Email"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
