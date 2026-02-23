import { defineFunction } from "@aws-amplify/backend";

export const backUpData = defineFunction({
  name: "backUpData",
  memoryMB: 256,
  timeoutSeconds: 120,
  resourceGroupName: "LocalCustomResources",
});
