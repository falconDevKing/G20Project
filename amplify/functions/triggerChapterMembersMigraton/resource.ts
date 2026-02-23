import { defineFunction } from "@aws-amplify/backend";

export const triggerChapterMembersMigraton = defineFunction({
  name: "triggerChapterMembersMigraton",
  memoryMB: 128,
  resourceGroupName: "LocalCustomResources",
  timeoutSeconds: 120,
});
