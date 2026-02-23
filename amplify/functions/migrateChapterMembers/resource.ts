import { defineFunction } from "@aws-amplify/backend";

export const migrateChapterMembers = defineFunction({
  name: "migrateChapterMembers",
  memoryMB: 256,
  timeoutSeconds: 180,
  resourceGroupName: "LocalCustomResources",
});
