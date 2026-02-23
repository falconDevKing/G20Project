import z from "zod";

export const registerSchema = z
  .object({
    last_name: z.string().min(1, { message: "Surname is required" }),
    first_name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email().min(1, { message: "Email is required" }),
    division_id: z.string().min(1, { message: "You must select a division" }),
    chapter_id: z.string().min(1, { message: "You must select a chapter" }),
    ggp_category: z.string().min(1, { message: "You must select a GGP Category" }),
    // partner_type: z.string().min(1, { message: "You must select a Partner Type" }),
    birth_day: z.string().min(1, { message: "You must select a birth day" }),
    birth_month: z.string().min(1, { message: "You must select a birth month Type" }),
    // date_of_birth: z
    //   .string()
    //   .min(1, { message: "Your Birth date is required" }) // Now required as a string
    //   .refine(
    //     (date) => {
    //       const parsedDate = new Date(date);
    //       return !isNaN(parsedDate.getTime()) && parsedDate <= new Date();
    //     },
    //     { message: "Invalid birth date or date is in the future" },
    //   ),

    phone_number: z
      .string()
      .min(1, { message: "Phone Number is required" })
      .refine((phone) => /^\+\d{10,15}$/.test(phone), "Invalid phone number"),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
      .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
      .regex(/\d/, { message: "Password must contain at least one number" })
      .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character (!@#$%^&*)" }),
    confirm_password: z.string().min(8, { message: "Confirm password is required" }),
    accept_terms: z.boolean().refine((val) => val === true, { message: "You must accept the terms and conditions" }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export const g20UpdateAuthSchema = z
  .object({
    married: z.enum(["Yes", "No"], { message: "Please select an option" }),
    // marriage_anniversary: z.string().optional(),

    anniversary_day: z.string().optional(),
    anniversary_month: z.string().optional(),

    g20_category: z.string().min(1, { message: "You must select a G20 Category" }),
    g20_amount: z.coerce.number().min(1, "Amount is required"),

    voluntary_participation: z.enum(["Yes", "No"], { message: "Please select an option" }),
    motivation: z.string().min(50, { message: "You must put in your motivation statement" }),

    attestation: z.boolean().refine((val) => val === true, {
      message: "You must acknowledge the attestation",
    }),
  })
  .superRefine((data, ctx) => {
    if (data.married === "Yes" && data.anniversary_day && data.anniversary_month) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Marriage anniversary is required",
        path: ["marriage_anniversary"],
      });
    }
  });

export const g20RegisterSchemaBase = z.object({
  last_name: z.string().min(1, { message: "Surname is required" }),
  first_name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email().min(1, { message: "Email is required" }),
  division_id: z.string().min(1, { message: "You must select a division" }),
  chapter_id: z.string().min(1, { message: "You must select a chapter" }),
  motivation: z.string().min(1, { message: "You must put in your motivation statement" }),
  phone_number: z
    .string()
    .min(1, { message: "Phone Number is required" })
    .refine((phone) => /^\+\d{10,15}$/.test(phone), "Invalid phone number"),
  accept_terms: z.boolean().refine((val) => val === true, { message: "You must accept the terms and conditions" }),
});

// If remitted is YES → forced is required
const remittedYes = z.object({
  remitted: z.literal("Yes"),
  forced: z.string().min(1, {
    message: "You must select an indication of voluntary giving",
  }),
  amount: z.coerce.number().min(1, "Amount is required"),
  g20_category: z.string().min(1, { message: "You must select a G20 Category" }),
});

// If remitted is NO → forced is optional
const remittedNo = z.object({
  remitted: z.literal("No"),
  forced: z.string().optional(),
  amount: z.coerce.number().optional(),
  g20_category: z.string().optional(),
});

const remittedEmpty = z.object({
  remitted: z.literal(""),
  forced: z.string().optional(),
  amount: z.coerce.number().optional(),
  g20_category: z.string().optional(),
});

export const g20RegisterSchema = z.intersection(g20RegisterSchemaBase, z.discriminatedUnion("remitted", [remittedYes, remittedNo, remittedEmpty]));

export const signupSchema = z.object({
  last_name: z.string().min(1, { message: "Surname is required" }),
  first_name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email().min(1, { message: "Email is required" }),

  phone_number: z
    .string()
    .min(1, { message: "Phone Number is required" })
    .refine((phone) => /^\+\d{10,15}$/.test(phone), "Invalid phone number"),
  division_id: z.string().min(1, { message: "You must select a division" }),
  chapter_id: z.string().min(1, { message: "You must select a chapter" }),
  ggp_category: z.string().min(1, { message: "You must select a GGP category" }),
  // partner_type: z.string().min(1, { message: "You must select a partner type" }),
  permission_type: z.string().min(1, { message: "You must select a permission level" }),

  address: z.string().min(5, "Address must be at least 5 characters").max(120, "Address must be at most 120 characters"),
  birth_day: z.string().min(1, { message: "You must select a birth day" }),
  birth_month: z.string().min(1, { message: "You must select a birth month Type" }),
  gender: z.string().min(1, { message: "Gender is required" }),
  nationality: z.string().min(1, { message: "You must select your Nationality" }),
});

export const profileFormSchema = z.object({
  unique_code: z.string(),
  last_name: z.string().min(1, { message: "Surname is required" }),
  first_name: z.string().min(1, { message: "Name is required" }),
  birth_day: z.string().min(1, { message: "You must select a birth day" }),
  birth_month: z.string().min(1, { message: "You must select a birth month Type" }),
  address: z.string().min(5, "Address must be at least 5 characters").max(500, "Address must be at most 500 characters"),
  email: z.string().email(),
  gender: z.string().min(1, { message: "Gender is required" }),
  division_id: z.string().min(1, { message: "You must select your division" }),

  chapter_id: z.string().min(1, { message: "You must select your chapter" }),
  nationality: z.string().min(1, { message: "You must select your Nationality" }),
  ggp_category: z.string().min(1, { message: "You must select a GGP Category" }),
  image_url: z.string().optional(),
  phone_number: z.string().refine((phone) => /^\+\d{10,15}$/.test(phone), "Invalid phone number"),
});

export const profilePasswordSchema = z
  .object({
    current_password: z.string().min(1, { message: "Password must be at least 1 character long" }),
    new_password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
      .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
      .regex(/\d/, { message: "Password must contain at least one number" })
      .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character (!@#$%^&*)" }),
    confirm_password: z.string().min(8, { message: "Confirm password is required" }),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export const paymentFormSchema = z.object({
  unique_code: z.string().min(1, "Personal Code is required"),
  description: z.string().optional(),
  amount: z.coerce.number().min(1, "Amount is required"),
  payment_date: z.string().min(1, "Payment Date is required"),
  remission_period: z.string().min(1, "Remission Period is required"),
  division_id: z.string().min(1, { message: "You must select a division" }),
  chapter_id: z.string().min(1, { message: "You must select a chapter" }),
  proof_of_payment: z.string().optional(),

  is_converted: z.boolean(),
  conversion_description: z.string(),
  conversion_amount: z.coerce.number(),
  conversion_rate: z.coerce.number(),
  conversion_currency: z.string(),
  conversion_time: z.string(),
});

export const onlinePaymentFormSchema = z.object({
  unique_code: z.string().min(1, "Personal Code is required"),
  description: z.string().optional(),
  remission_period: z.string().min(1, "Remission Period is required"),
  amount: z.coerce.number().min(1, "Amount is required"),
  division_id: z.string().min(1, { message: "You must select a division" }),
  chapter_id: z.string().min(1, { message: "You must select a chapter" }),
});

export const onlineMonthlyPaymentFormSchema = z.object({
  unique_code: z.string().min(1, "Personal Code is required"),
  description: z.string().optional(),
  remission_day: z.string().min(1, "Remission Day is required"),
  first_payment_day: z.string(),
  amount: z.coerce.number().min(1, "Amount is required"),
  division_id: z.string().min(1, { message: "You must select a division" }),
  chapter_id: z.string().min(1, { message: "You must select a chapter" }),
});

export const onlineMonthlyPaymentFormStripeSchema = z.object({
  unique_code: z.string().min(1, "Personal Code is required"),
  description: z.string().optional(),
  remission_day: z.string().min(1, "Remission Day is required"),
  first_payment_day: z.string().min(1, "First Payment Day is required"),
  amount: z.coerce.number().min(1, "Amount is required"),
  division_id: z.string().min(1, { message: "You must select a division" }),
  chapter_id: z.string().min(1, { message: "You must select a chapter" }),
});

export const updateOnlineMonthlyPaymentFormSchema = z.object({
  unique_code: z.string().min(1, "Personal Code is required"),
  description: z.string().optional(),
  remission_day: z.string().min(1, "Remission Day is required"),
  amount: z.coerce.number().min(1, "Amount is required"),
});

export const visitorOnlinePaymentFormSchema = z
  .object({
    updateState: z.string().min(1, { message: "Mode is required" }),
    first_name: z.string().min(1, { message: "Name is required" }),
    last_name: z.string().min(1, { message: "Surname is required" }),
    email: z.string().email().min(1, { message: "Email is required" }),
    phone_number: z
      .string()
      .min(1, { message: "Phone Number is required" })
      .refine((phone) => /^\+\d{10,15}$/.test(phone), "Invalid phone number"),
    currency: z.string().min(1, { message: "Currency is required" }),
    amount: z.coerce.number().min(1, "Amount is required"),
    description: z.string().optional(),
    remission_day: z.string().optional(),
    first_payment_day: z.string().optional(),
    // unique_code: z.string().min(1, "Personal Code is required"),
  })
  .refine((data) => data.updateState !== "Monthly Seed" || (data.updateState === "Monthly Seed" && !!data?.remission_day), {
    message: "Remission Day is required",
    path: ["remission_day"],
  })
  .refine(
    (data) =>
      data.updateState !== "Monthly Seed" ||
      (data.updateState === "Monthly Seed" && data.currency === "NGN") ||
      (data.updateState === "Monthly Seed" && data.currency !== "NGN" && !!data?.first_payment_day),
    {
      message: "First Payment Day is required",
      path: ["first_payment_day"],
    },
  );

const PARTNER_CODE_REGEX = /^[A-Za-z]{2}-[A-Za-z0-9]{5}$/;

export const isEmail = (value: string) => z.string().email().safeParse(value).success;
export const isPartnerCode = (value: string) => PARTNER_CODE_REGEX.test(value);

export const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, { message: "Enter your email or partner code" })
    .transform((s) => s.trim())
    .refine((val) => isEmail(val) || isPartnerCode(val), { message: "Enter a valid email or partner code like AB-12C3D" }),
  password: z.string().min(1, { message: "Password required" }),
});

export const forgotPassword = z.object({
  email: z.string().email(),
});

export const resetPassword = z
  .object({
    email: z.string().email(),
    code: z.string(),
    new_password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
      .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
      .regex(/\d/, { message: "Password must contain at least one number" })
      .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character (!@#$%^&*)" }),
    confirm_password: z.string().min(8, { message: "Confirm password is required" }),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export const verifyEmail = z.object({
  code: z.string(),
});

export const dynamicFilterSchema = z.object({
  filters: z
    .array(
      z.object({
        field: z.enum([
          "name_code",
          "chapter_id",
          "division_id",
          "status",
          "birth_day_mmdd",
          "ggp_category",
          "permission_type",
          "amount",
          "user_name",
          "payment_date",
          "remission_period",
          "active_recurring_remission",
          "preferred_remission_day",
          "online_payment",
        ]),
        operator: z.enum(["Equals", "Contains", "Within", "Not Equals"]),
        // value: z.string().nonempty("Value is required"),
        value: z.union([
          z.string().min(1, "Value is required"),
          // z.date(),
          z.object({
            from: z.string(),
            to: z.string(),
          }),
          z.object({
            from: z.date(),
            to: z.date(),
          }),
        ]),
      }),
    )
    .min(1, "At least one filter is required"),
});

export type DynamicFilterSchema = z.infer<typeof dynamicFilterSchema>;
