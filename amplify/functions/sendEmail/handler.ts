import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { Resend } from "resend";
import type { Schema } from "../../data/resource";

import { env } from "$amplify/env/sendEmail";

const REGION = process.env.AWS_REGION || "";
const ses = new SESClient({ region: REGION });

const GGP_RESEND_KEY = process.env.GGP_RESEND_KEY || "";
const resend = new Resend(GGP_RESEND_KEY);
const allowResend = process.env.GGP_ALLOW_RESEND === "true";

interface EmailParams {
  to: string[];
  subject: string;
  body: string;
  from?: string; // Defaults to verified SES identity
  cc?: string[];
  bcc?: string[];
}

const senderEmail = process.env.GGP_SENDER_MAIL as string;

export const handler: Schema["sendEmail"]["functionHandler"] = async (event) => {
  try {
    console.log("event", event);
    console.log("process.env.GGP_SENDER_MAIL", process.env.GGP_SENDER_MAIL);
    console.log("envs", env);

    const { to, subject, body, from, ccMails, bccMails } = event.arguments;

    const cc = (ccMails || []).filter(Boolean) as string[];
    const bcc = (bccMails || []).filter(Boolean) as string[];

    if (!to?.length) {
      return {
        success: false,
        messageId: "",
      };
    }

    if (allowResend) {
      const { data, error } = await resend.emails.send({
        from: `"G20 Office" <${from || senderEmail}>`,
        to,
        subject,
        html: body,
        cc,
        bcc,
      });

      return {
        success: !!data?.id,
        messageId: data?.id,
      };
    }

    const command = new SendEmailCommand({
      Source: `"G20 Office" <${from || senderEmail}>`,
      Destination: { ToAddresses: to, CcAddresses: cc, BccAddresses: bcc },
      Message: {
        Subject: { Data: subject },
        Body: {
          Html: { Data: body }, // For HTML emails
          // Text: { Data: body } // For plaintext
        },
      },
    });

    const response = await ses.send(command);
    console.log("Email sent:", response.MessageId);

    return {
      success: true,
      messageId: response.MessageId,
    };
  } catch (error) {
    console.error("SES Error:", error);
    throw new Error("Failed to send email", {
      cause: error instanceof Error ? error : undefined,
    });
  }
};
