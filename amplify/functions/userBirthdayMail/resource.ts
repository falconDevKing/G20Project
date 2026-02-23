import { defineFunction } from "@aws-amplify/backend";

export const userBirthdayMail = defineFunction({
  name: "userBirthdayMail",
  memoryMB: 256,
  timeoutSeconds: 120,
  resourceGroupName: "LocalCustomResources",
});
