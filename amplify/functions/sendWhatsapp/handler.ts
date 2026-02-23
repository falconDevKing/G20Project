import twilio from "twilio";

import type { Schema } from "../../data/resource";
import { env } from "$amplify/env/sendWhatsapp";

const client = twilio(process.env.GGP_TWILIO_ACCOUNT_SID!, process.env.GGP_TWILIO_AUTH_TOKEN!);
const from = process.env.GGP_TWILIO_PHONE_NUMBER;
const restrictWhatsapp = process.env.GGP_RESTRICT_TWILIO === "true";

export const handler: Schema["sendWhatsapp"]["functionHandler"] = async (event) => {
  try {
    console.log("event", event);
    console.log("process.env.GGP_SENDER_MAIL", process.env.GGP_SENDER_MAIL);
    console.log("envs", env);

    const { to, contentSid, contentVariables, from: initialFrom } = event.arguments;

    if (restrictWhatsapp) {
      return {
        success: false,
        status: "Not allowed",
        messageId: "",
      };
    }

    if (!to?.length) {
      return {
        success: false,
        status: "No Receiver",
        messageId: "",
      };
    }

    const message = await client.messages.create({
      contentSid,
      contentVariables,
      from: initialFrom || from,
      to,
    });

    return {
      success: true,
      status: message.status,
      messageId: message.sid,
    };
  } catch (error: any) {
    console.error("Whatsapp Error:", error?.message, error);
    return {
      success: false,
      status: "Sending Error",
      messageId: "",
    };
  }
};
