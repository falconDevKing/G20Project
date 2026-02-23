import { defineFunction } from "@aws-amplify/backend";

export const postPaymentProcessor = defineFunction({
  name: "postPaymentProcessor",
  memoryMB: 512,
  timeoutSeconds: 160,
  // resourceGroupName: "LocalCustomResources",
  environment: {
    GGP_PAYSTACK_SK: process.env.GGP_PAYSTACK_SK as string,
    GGP_STRIPE_PK: process.env.GGP_STRIPE_PK as string,
    GGP_STRIPE_SK: process.env.GGP_STRIPE_SK as string,
  },
});
