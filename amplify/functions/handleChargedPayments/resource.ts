import { defineFunction } from "@aws-amplify/backend";

export const handleChargedPayments = defineFunction({
  name: "handleChargedPayments",
  memoryMB: 256,
  timeoutSeconds: 160,
  environment: {
    GGP_STRIPE_PK: process.env.GGP_STRIPE_PK as string,
    GGP_STRIPE_SK: process.env.GGP_STRIPE_SK as string,
  },
});
