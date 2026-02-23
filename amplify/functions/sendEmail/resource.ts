import { defineFunction } from "@aws-amplify/backend";

export const sendEmail = defineFunction({
  name: "sendEmail",
  memoryMB: 128,
  timeoutSeconds: 30,
});
