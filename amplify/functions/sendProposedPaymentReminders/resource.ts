import { defineFunction } from "@aws-amplify/backend";

export const sendProposedPaymentReminders = defineFunction({
  name: "sendProposedPaymentReminders",
  memoryMB: 512,
  timeoutSeconds: 240,
  resourceGroupName: "LocalCustomResources",
});
