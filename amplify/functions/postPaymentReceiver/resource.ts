import { defineFunction } from "@aws-amplify/backend";

export const postPaymentReceiver = defineFunction({
  name: "postPaymentReceiver",
  memoryMB: 512,
  timeoutSeconds: 160,
  // resourceGroupName: "LocalCustomResources",
  environment: {
    GGP_PAYSTACK_SK: process.env.GGP_PAYSTACK_SK as string,
  },
});
