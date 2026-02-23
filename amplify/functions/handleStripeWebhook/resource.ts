import { defineFunction } from "@aws-amplify/backend";

export const handleStripeWebhook = defineFunction({
  name: "handleStripeWebhook",
  memoryMB: 256,
  timeoutSeconds: 160,
  runtime: 20,
  environment: {
    GGP_STRIPE_PK: process.env.GGP_STRIPE_PK as string,
    GGP_STRIPE_SK: process.env.GGP_STRIPE_SK as string,
    GGP_STRIPE_WEBHOOK_SECRET: process.env.GGP_STRIPE_WEBHOOK_SECRET as string,
  },
});
