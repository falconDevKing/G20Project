import { defineFunction } from "@aws-amplify/backend";

export const sendUserMessages = defineFunction({
  name: "sendUserMessages",
  memoryMB: 256,
  timeoutSeconds: 720,
});
