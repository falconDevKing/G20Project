import { defineFunction } from "@aws-amplify/backend";

export const sendWhatsapp = defineFunction({
  name: "sendWhatsapp",
  memoryMB: 128,
  timeoutSeconds: 30,
});
