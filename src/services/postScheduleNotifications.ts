import PostConfirmationTemplate from "@/mailTemplates/postConfirmationTemplateNew";
import { sendEmail } from "@/services/sendMail";
import { sendWelcomeMessage } from "@/services/twilioMessaging";
import type { PartnerRowType, ProposedPaymentScheduleRowType } from "@/supabase/modifiedSupabaseTypes";

const MAIL_SUBJECT = "Welcome to the House of Greats! You're Officially a G20 Partner.";

type SendPostScheduleWelcomeParams = {
  user: PartnerRowType;
  rows: ProposedPaymentScheduleRowType[];
  hideDefaultPassword: boolean;
};

const normalizeRows = (rows: ProposedPaymentScheduleRowType[]) => [...rows].sort((a, b) => Number(a.schedule_index || 0) - Number(b.schedule_index || 0));

export const sendPostScheduleWelcomeNotifications = async ({ user, rows, hideDefaultPassword }: SendPostScheduleWelcomeParams) => {
  const normalizedRows = normalizeRows(rows);
  const errors: string[] = [];

  if (user?.email) {
    const mailBody = PostConfirmationTemplate(user.first_name || "", user.unique_code || "", hideDefaultPassword, Number(user.g20_amount || 0), normalizedRows);

    const emailResult = await sendEmail({
      to: [user.email],
      mailSubject: MAIL_SUBJECT,
      mailBody,
    });

    if (!emailResult.success && emailResult.error) {
      errors.push(emailResult.error);
    }
  }

  if (user?.phone_number) {
    const whatsappResult = await sendWelcomeMessage({
      to: user.phone_number,
      name: user.first_name || "",
      ggp_code: user.unique_code || "",
    });

    if (!whatsappResult?.success) {
      errors.push(whatsappResult?.error || "Failed to send WhatsApp welcome message.");
    }
  }

  return {
    success: errors.length === 0,
    errors,
  };
};
