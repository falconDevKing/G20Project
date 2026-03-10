import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import "react-phone-number-input/style.css";
import { useEffect, useState } from "react";
import { loginSchema } from "@/lib/schemas";
import { CardWrapper } from "../Card-wapper";
import { Link, useNavigate } from "react-router";
import { getLoggedInUser, logInuser, resolveEmailFromIdentifier, resolvePostAuthRoute } from "@/services/auth";
import { Eye, EyeOff } from "lucide-react";
import { ErrorHandler, SuccessHandler } from "@/lib/toastHandlers";
import { DoNothing } from "@/lib/utils";
import Logo from "../../assets/G20_logo.png";
import { AuthInput } from "../ui/authInput";

export const LoginForm = () => {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isCompleteField, setIsCompleteField] = useState(false);

  // Watch form values
  const { identifier, password } = form.watch();
  const isFormEmpty = !identifier || !password; // Check if fields are empty

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      DoNothing(values);

      setIsPending(true);
      if (isFormEmpty) {
        setIsCompleteField(false);
        return;
      }

      setIsCompleteField(true); // Disable button while processing

      const email = await resolveEmailFromIdentifier(identifier);
      const userDetails = await logInuser(email, password);

      if (!userDetails) {
        throw new Error("No logged in");
      } else {
        SuccessHandler("Logged In successfully");
      }

      setTimeout(() => {
        navigate(resolvePostAuthRoute(userDetails));
      }, 100);
    } catch (error: any) {
      console.log("login error", error);
      ErrorHandler(error?.message || "Something went wrong");
    } finally {
      setIsPending(false);
      setIsCompleteField(false);
    }
  };

  useEffect(() => {
    const autoDirectUser = async () => {
      const isLoggedIn = await getLoggedInUser();

      if (isLoggedIn) {
        navigate(resolvePostAuthRoute(isLoggedIn));
      }
    };

    autoDirectUser();
  }, []);

  return (
    <CardWrapper
      // title="GGP"
      titleImg={Logo}
      headerLabel="Login to your account"
      backButtonLabel="Don't have an account? Sign up Today"
      backButtenHref="/register"
      // homeHref="/"
      // homeLable="Go to home page"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 mx-auto">
          <FormField
            control={form.control}
            name="identifier"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-1">
                  <FormLabel className="text-[#111c30]  font-normal text-base">Email or Partner Code</FormLabel>
                  <span className="text-red-500 text-base">*</span>
                </div>
                <FormControl>
                  <AuthInput
                    disabled={isPending}
                    type="text"
                    placeholder="smith@gmail.com or XY-AB1C2"
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
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <FormLabel className="text-[#111c30] font-normal text-base">Password</FormLabel>
                    <span className="text-red-500 text-base">*</span>
                  </div>
                  <Link className="text-[#111c30] font-normal text-base hover:underline" to={"/forgot-password"}>
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <AuthInput
                    disabled={isPending}
                    type={showPassword ? "text" : "password"}
                    placeholder="******"
                    className="focus-visible:ring-0 focus-visible:ring-offset-0 pr-10"
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute focus-visible:ring-0 focus-visible:ring-offset-0 right-2 top-1/2 -translate-y-1/2 text-sm text-gray-600"
                  >
                    {showPassword ? <Eye size={18} className="text-gray-600/70 " /> : <EyeOff size={18} className="text-gray-600/70" />}
                  </button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            disabled={isFormEmpty || isCompleteField || isPending}
            variant={"custom"}
            className={`w-full text-sm ${
              isFormEmpty || isCompleteField || isPending
                ? "cursor-not-allowed opacity-50" // Correct styles when disabled
                : "cursor-pointer opacity-100"
            }`}
            size="lg"
            type="submit"
          >
            {isPending ? "Submitting.." : "Login"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
