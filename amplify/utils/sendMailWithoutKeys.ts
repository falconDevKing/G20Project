import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { Resend } from "resend";

const REGION = process.env.AWS_REGION || "";

const sesClient = new SESClient({
  region: REGION,
});
const SENDER_MAIL = process.env.GGP_SENDER_MAIL;

const GGP_RESEND_KEY = process.env.GGP_RESEND_KEY || "";
const resend = new Resend(GGP_RESEND_KEY);
const allowResend = process.env.GGP_ALLOW_RESEND === "true";

export const sendMailWithoutKeys = async ({
  recipientMails,
  mailSubject,
  mailBody,
  ccMails,
  bccMails,
}: {
  recipientMails: string[];
  mailSubject: string;
  mailBody: string;
  ccMails?: string[];
  bccMails?: string[];
}) => {
  try {
    if (allowResend) {
      const resendDestinationData: { to: string[]; cc?: string[]; bcc?: string[] } = {
        to: recipientMails,
      };

      if (ccMails?.length) {
        resendDestinationData.cc = ccMails;
      }

      if (bccMails?.length) {
        resendDestinationData.bcc = bccMails;
      }

      const { data, error } = await resend.emails.send({
        from: `"GGP Office" <${SENDER_MAIL}>`,
        subject: mailSubject,
        html: mailBody,
        ...resendDestinationData,
      });

      return {
        success: !!data?.id,
        messageId: data?.id,
      };
    }

    const DestinationData: { ToAddresses: string[]; CcAddresses?: string[]; BccAddresses?: string[] } = {
      ToAddresses: recipientMails,
    };

    if (ccMails?.length) {
      DestinationData.CcAddresses = ccMails;
    }

    if (bccMails?.length) {
      DestinationData.BccAddresses = bccMails;
    }

    const senderParams = {
      Source: `"GGP Office" <${SENDER_MAIL}>`,
      Destination: DestinationData,
      Message: {
        Subject: { Data: mailSubject },
        Body: {
          Html: {
            Data: mailBody,
          },
        },
      },
    };

    if (recipientMails.length && mailSubject && mailBody) {
      console.log("sending to", { recipientMails, mailSubject });
      const command = new SendEmailCommand(senderParams);
      await sesClient.send(command);

      [ccMails, bccMails].flat().length
        ? console.log(`Mail sent to users with email: ${recipientMails}, with copies to ${[ccMails, bccMails].flat().join(", ")}`)
        : console.log(`Mail sent to users with email: ${recipientMails}`);
    } else {
      throw new Error("Kindly fill all required fields. Thank you.");
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        response: "Success",
        message: "Mail sent successfully",
      }),
    };
  } catch (e) {
    console.log(`Mail not sent to users with email: ${recipientMails}`);
    console.log(recipientMails, e);
  }
};
