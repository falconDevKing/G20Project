import { defineFunction } from "@aws-amplify/backend";

export const userWeddingAnniversaryMail = defineFunction({
  name: "userWeddingAnniversaryMail",
  memoryMB: 256,
  timeoutSeconds: 120,
  resourceGroupName: "LocalCustomResources",
});
