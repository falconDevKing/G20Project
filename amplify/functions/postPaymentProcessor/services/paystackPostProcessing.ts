import { findUser, findUserByEmail, handleMailingAndStatusUpdates, makePayment } from "../helpers";
import FetchGBPExchangeRatesValue from "../../../utils/fetchGBPExchangeRatesValue";
import SupabaseClient from "../../../utils/supabaseConnection";

const AppOrganisationId = process.env.GGP_ORG_ID || "";
const guestUserId = process.env.GGP_GUEST_USER_ID || "";
export const processPaystackPaymentVerification = async ({
  currency,
  user_id,
  monthly,
  amount,
  email,
  remission_day,
  transaction,

  unique_code,
  remission_period,
  description,
  user_name,
}: {
  currency: string;
  user_id: string;
  monthly: boolean;
  amount: number;
  email: string;
  remission_day: string;
  unique_code: string;
  remission_period: string;
  description: string;
  user_name: string;
  transaction: Record<string, any>;
}) => {
  const { authorization = {}, customer } = transaction;
  const customer_code = customer?.customer_code;
  const customer_id = customer?.id;

  let existingUser = await findUserByEmail(email);

  const { authorization_code, brand, last4, reusable, exp_month, exp_year, card_type, country_code } = authorization;

  if (existingUser) {
    const authorisation_details = {
      authorization_code,
      brand,
      last4,
      reusable,
      exp_month,
      exp_year,
      card_type,
      country_code,
    };

    const paystackCustomerData: {
      paystack_customer_code: string | undefined;
      paystack_customer_id: any;
      paystack_authorization_code?: string;
      paystack_authorization_details?: Record<string, any>;
      paystack_monthly_payment?: boolean;
    } = {
      paystack_customer_code: customer_code,
      paystack_customer_id: customer_id,
      paystack_authorization_code: "",
      paystack_authorization_details: {},
      paystack_monthly_payment: false,
    };

    if (reusable) {
      paystackCustomerData.paystack_authorization_code = authorization_code;
      paystackCustomerData.paystack_authorization_details = authorisation_details;

      if (monthly) {
        paystackCustomerData.paystack_monthly_payment = true;
      } else {
        delete paystackCustomerData.paystack_monthly_payment;
      }
    } else {
      delete paystackCustomerData.paystack_authorization_details;
      delete paystackCustomerData.paystack_authorization_code;
      delete paystackCustomerData.paystack_monthly_payment;
    }

    // update customerDetails
    const { data: updatedUser, error: updateUserError } = await SupabaseClient.from("partner")
      .update(paystackCustomerData)
      .eq("id", existingUser.id)
      .select()
      .maybeSingle();

    console.log("updateUserError", updateUserError);
    console.log("user", paystackCustomerData, updatedUser);
  }

  if (reusable && monthly) {
    // save a recurring payment
    const newRecurringEntry = {
      user_id: existingUser?.id || null,
      active: true,
      currency,
      amount,
      chapter_id: existingUser?.chapter_id,
      email,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      authorization_code,
      customer_code,
      frequency: "monthly",
      charge_day: +remission_day,
    };

    const { data: recurring_payment_record, error: error_recurring_payment } = await SupabaseClient.from("paystack_recurring_payments")
      .upsert(newRecurringEntry, {
        onConflict: "email",
      })
      .select();

    console.log("error_recurring_payment", error_recurring_payment);
    console.log("recurring_payment_record", recurring_payment_record);

    if (recurring_payment_record?.length && existingUser) {
      const customerRecurringDetails = {
        paystack_monthly_payment_id: recurring_payment_record[0]?.id,
      };

      const { data: updatedUserRecurringIdData, error: updateUserRecurringError } = await SupabaseClient.from("partner")
        .update(customerRecurringDetails)
        .eq("id", existingUser.id)
        .select()
        .maybeSingle();

      console.log("updateUserRecurringError", updateUserRecurringError);
      console.log("updatedUserRecurringIdData", updatedUserRecurringIdData);
    }

    return true;
  }
};

export const savePaystackPaymentRecord = async ({
  user_id,
  amount,
  unique_code,
  remission_period,
  description,
  user_name,
  provider,

  currency,
  monthly,
  email,
  remission_day,
  transaction,
  successfulMonthly,
}: {
  currency: string;
  user_id: string;
  monthly: boolean;
  amount: number;
  email: string;
  remission_day: string;
  unique_code: string;
  remission_period: string;
  description: string;
  user_name: string;

  provider: string;
  transaction: Record<string, any>;
  successfulMonthly: boolean;
}) => {
  try {
    let existingUser = await findUserByEmail(email);
    const fallbackUser = existingUser ? existingUser : await findUser(guestUserId);

    const { id: fallbackUserId, unique_code, chapter_id, division_id, phone_number, remission_start_date } = fallbackUser;
    const rate = await FetchGBPExchangeRatesValue(currency);

    const guestPhoneNumber = transaction.metadata?.phone_number;

    const payment_date = new Date().toISOString();
    const newEntry = {
      unique_code,
      currency,
      amount: +amount,
      payment_date,
      remission_month: remission_period.split(" ")[0],
      remission_year: remission_period.split(" ")[1],
      remission_period,
      status: "Paid",
      description: description || "GGP remission for " + remission_period,

      user_name,
      approved_by: `Online ${monthly && successfulMonthly ? "Monthly" : ""}  ${provider}`,
      approved_by_id: `Online ${monthly && successfulMonthly ? "Monthly" : ""}  ${provider}`,
      approved_by_image: `Online ${monthly && successfulMonthly ? "Monthly" : ""}  ${provider}`,
      gbp_equivalent: +amount / +(rate || 1),

      organisation_id: AppOrganisationId,
      division_id,
      chapter_id,
      user_id: fallbackUserId,
    };

    console.log(newEntry);

    const newPaymentRecord = await makePayment(newEntry);

    await handleMailingAndStatusUpdates({
      user_id: fallbackUserId,
      currency,
      amount,
      remission_period,
      email,
      user_name,
      chapter_id,
      phone_number: guestPhoneNumber || phone_number,
      remission_start_date,
      successfulMonthly,
      remission_day,
    });
  } catch (error) {
    console.log("savePaystackPaymentRecord error", error);
  }
};
