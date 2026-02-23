import { defineFunction } from "@aws-amplify/backend";

export const handlePaymentsBE = defineFunction({
  name: "handlePaymentsBE",
  memoryMB: 256,
  timeoutSeconds: 160,
  runtime: 20,
  environment: {
    GGP_STRIPE_PK: process.env.GGP_STRIPE_PK as string,
    GGP_STRIPE_SK: process.env.GGP_STRIPE_SK as string,
    GGP_PAYSTACK_SK: process.env.GGP_PAYSTACK_SK as string,
  },
});
