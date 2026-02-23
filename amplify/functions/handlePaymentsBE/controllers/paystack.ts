import { errorResponseCreator, successResponseCreator } from "../../../utils/responsesFormat";

const paystackSecretKey = process.env.GGP_PAYSTACK_SK || "";

export const paystackInitTransaction = async (reqData: any) => {
  try {
    // extract vars
    const { amount, email, currency, user_id, user_name, monthly, phone_number } = reqData;
    const body = {
      email,
      amount: Math.round(Number(amount) * 100),
      metadata: {
        user_id,
        user_name,
        phone_number,
      },
      channels: ["card", "bank", "apple_pay", "ussd", "qr", "mobile_money", "bank_transfer", "eft", "payattitude"],
      callback_url: null, // we will rely on Inline close + verify + webhook
    };

    if (monthly) {
      body.channels = ["card"];
    }

    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok || !data.status) {
      throw new Error("Initialised Failed");
    }

    console.log("initTransaction data data", data.data);
    console.log("initTransaction data", data);

    const successRes = successResponseCreator(200, "Initialised Paystack Payment Successful", {
      authorization_url: data.data.authorization_url,
      access_code: data.data.access_code,
      reference: data.data.reference,
    });
    return successRes;
  } catch (err: any) {
    console.log("err", err.message, err);
    const errorRes = errorResponseCreator(400, err.message || "Guest Recurring Payment Unsuccessful", err);
    return errorRes;
  }
};

export const paystackVerifyTransaction = async (reqData: any) => {
  try {
    const { reference } = reqData;

    if (!reference) {
      throw new Error("Missing reference");
    }

    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`,
      },
    });

    const data = await response.json();

    if (!response.ok || !data.status) {
      throw new Error("Verification failed" + data?.message || "");
    }

    console.log("verifyTransaction trx data", data.data);
    console.log("verifyTransaction data", data);

    const trx = data.data;
    const success = trx.status === "success";

    const successRes = successResponseCreator(200, "Verify Paystack Payment Successful", {
      verified: success,
      transaction: trx,
    });
    return successRes;
  } catch (err: any) {
    console.log("err", err.message, err);
    const errorRes = errorResponseCreator(400, err.message || "Guest Recurring Payment Unsuccessful", err);
    return errorRes;
  }
};

export const paystackChargeAuthorization = async (reqData: any) => {
  try {
    const { authorization_code, email, amount, currency, user_id, user_name } = reqData;

    if (!authorization_code || !email || !amount) {
      throw new Error("Missing fields");
    }

    const body = {
      authorization_code,
      email,
      amount: Math.round(Number(amount) * 100),
      metadata: {
        user_id,
        user_name,
      },
    };

    const response = await fetch("https://api.paystack.co/transaction/charge_authorization", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok || !data.status) {
      // log failed attempt in payments table
      throw new Error("charge vauthorisation failed - " + data.message);
    }

    // TODO: record a new payments row with status 'processing', wait for webhook or poll verify
    const successRes = successResponseCreator(200, "Verify Paystack Payment Successful", {
      ok: true,
      charge: data.data,
    });

    return successRes;
  } catch (err: any) {
    console.log("err", err.message, err);
    const errorRes = errorResponseCreator(400, err.message || "Guest Recurring Payment Unsuccessful", err);
    return errorRes;
  }
};
