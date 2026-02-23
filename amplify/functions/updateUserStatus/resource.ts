import { defineFunction } from "@aws-amplify/backend";

export const updateUserStatus = defineFunction({
  name: "updateUserStatus",
  memoryMB: 256,
  timeoutSeconds: 120,
  resourceGroupName: "LocalCustomResources",
});
