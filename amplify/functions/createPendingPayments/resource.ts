import { defineFunction } from "@aws-amplify/backend";

export const createPendingPayments = defineFunction({
  name: "createPendingPayments",
  memoryMB: 512,
  timeoutSeconds: 160,
  resourceGroupName: "LocalCustomResources",
});
