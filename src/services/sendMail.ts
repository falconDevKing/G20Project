import { generateClient } from "aws-amplify/api";
import type { Schema } from "../../amplify/data/resource"; // Path to your schema

const client = generateClient<Schema>();

interface EmailParams {
  to: string[];
  mailSubject: string;
  mailBody: string;
  from?: string; // Defaults to verified SES identity
  cc?: string[];
  bcc?: string[];
}

interface WhatsappParams {
  to: string;
  from: string;
  contentVariables: string;
  contentSid: string;
}

export const sendEmail = async ({ to, mailSubject, mailBody, cc, bcc }: EmailParams) => {
  try {
    const { errors } = await client.queries.sendEmail({
      to: to.filter(Boolean),
      subject: mailSubject,
      body: mailBody,
      ccMails: (cc || [])?.filter(Boolean) || [],
      bccMails: (bcc || [])?.filter(Boolean) || [],
    });

    if (errors) throw new Error(errors[0].message);
    return { success: true };
  } catch (error) {
    console.error("Email failed:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export const sendWhatsapp = async ({ to, from, contentVariables, contentSid }: WhatsappParams) => {
  try {
    const { errors } = await client.queries.sendWhatsapp({
      contentSid,
      contentVariables,
      from,
      to,
    });

    if (errors) throw new Error(errors[0].message);
    return { success: true };
  } catch (error) {
    console.error("Whatsapp failed:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
