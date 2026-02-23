import { sendWhatsapp } from "./sendMail";

const from = import.meta.env.VITE_APP_TWILIO_PHONE_NUMBER;
const restrictWhatsapp = import.meta.env.VITE_APP_RESTRICT_TWILIO === "true";

interface SendDefaultPasswordMessageParams {
  to: string;
}

export const sendDefaultPaswordMessage = async ({ to }: SendDefaultPasswordMessageParams) => {
  try {
    if (restrictWhatsapp) {
      return;
    }

    await sendWhatsapp({
      contentSid: "HXb0a17270b00f5b1de49f27399de5371b",
      contentVariables: JSON.stringify({}),
      from: `whatsapp:${from}`,
      to: `whatsapp:${to}`,
    });
  } catch (err) {
    console.log("error sendDefaultPaswordMessage", err);
  }
};

interface SendWelcomeMessageParams {
  to: string;
  name: string;
  ggp_code: string;
}

export const sendWelcomeMessage = async ({ to, name, ggp_code }: SendWelcomeMessageParams) => {
  try {
    if (restrictWhatsapp) {
      return;
    }

    await sendWhatsapp({
      contentSid: "HX6ae8c510fc9c63d3b29923aa239fad1f",
      contentVariables: JSON.stringify({ 1: name, 2: ggp_code }),
      from: `whatsapp:${from}`,
      to: `whatsapp:${to}`,
    });
  } catch (err) {
    console.log("error sendWelcomeMessage", err);
  }
};

interface SendPaymentLogNotificationMessageParams {
  to: string;

  name: string;
  remission_period: string;
  remission_amount: string;
  payment_date: string;
  chapter_name: string;
}

export const sendPaymentLogNotificationMessage = async ({
  to,
  name,
  remission_period,
  remission_amount,
  payment_date,
  chapter_name,
}: SendPaymentLogNotificationMessageParams) => {
  try {
    if (restrictWhatsapp) {
      return;
    }

    await sendWhatsapp({
      contentSid: "HXbcfd1779845645047449719465f0357f",
      contentVariables: JSON.stringify({
        1: name,
        2: remission_amount,
        3: remission_period,
        4: remission_period,
        5: remission_amount,
        6: payment_date,
        7: chapter_name,
      }),
      from: `whatsapp:${from}`,
      to: `whatsapp:${to}`,
    });
  } catch (err) {
    console.log("error sendPaymentLogNotificationMessage", err);
  }
};

interface SendPaymentReceivedMessageParams {
  to: string;
  name: string;
  amount: string;
  period: string;
  approved_by_name: string;
  remission_period: string;
  remission_amount: string;
  payment_date: string;
  chapter_name: string;
}

export const sendPaymentReceivedMessage = async ({
  to,
  name,
  amount,
  period,
  remission_period,
  remission_amount,
  payment_date,
  chapter_name,
  approved_by_name,
}: SendPaymentReceivedMessageParams) => {
  try {
    if (restrictWhatsapp) {
      return;
    }

    await sendWhatsapp({
      contentSid: "HXcb271774359c849dac6b3f32d056547e",
      contentVariables: JSON.stringify({
        1: name,
        2: amount,
        3: period,
        4: remission_period,
        5: remission_amount,
        6: payment_date,
        7: chapter_name,
        8: approved_by_name,
      }),
      from: `whatsapp:${from}`,
      to: `whatsapp:${to}`,
    });
  } catch (err) {
    console.log("error sendPaymentReceivedMessage", err);
  }
};
