import { defineFunction } from "@aws-amplify/backend";

export const adminBirthdayMail = defineFunction({
  name: "adminBirthdayMail",
  memoryMB: 512,
  timeoutSeconds: 120,
  resourceGroupName: "LocalCustomResources",
});
