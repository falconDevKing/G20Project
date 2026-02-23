import Stripe from "stripe";
import { errorResponseCreator, successResponseCreator } from "../../../utils/responsesFormat";
import SupabaseClient from "../../../utils/supabaseConnection";

const stripeSecretKey = process.env.GGP_STRIPE_SK || "";
const stripe = new Stripe(stripeSecretKey);

export const stripeCreateGuestPaymentIntent = async (reqData: any) => {
  try {
    const { amount, currency, description, paymentMethodOptions, payment_method_types, receipt_email, metadata } = reqData;

    const params = {
      payment_method_types: payment_method_types === "link" ? ["link", "card"] : payment_method_types,
      amount: +amount * 100,
      currency: currency,
      description: description || receipt_email + " One Time Stripe Payment",
      receipt_email,
      payment_method_options: {},
      metadata,
    };

    if (paymentMethodOptions) {
      params.payment_method_options = {
        ...paymentMethodOptions,
        card: {
          request_three_d_secure: "any",
        },
      };
    } else {
      params.payment_method_options = {
        card: {
          request_three_d_secure: "any",
        },
      };
    }

    const paymentIntent = await stripe.paymentIntents.create(params);
    const successRes = successResponseCreator(200, "Guest Payment Intent Created", {
      clientSecret: paymentIntent.client_secret,
      nextAction: paymentIntent.next_action,
    });
    return successRes;
  } catch (err: any) {
    console.log("err", err.message, err);
    const errorRes = errorResponseCreator(400, err.message || "Guest Payment Intent Unsuccessful", err);
    return errorRes;
  }
};

export const stripeCreateGuestRecurringPaymentIntent = async (reqData: any) => {
  try {
    // extract vars
    const { user_name, receipt_email, user_address, phone } = reqData;
    let customer;
    // find or create customer
    const existing = await stripe.customers.list({
      email: receipt_email,
      limit: 1,
    });
    if (existing.data.length > 0) {
      customer = existing.data[0]; // ✅ use existing
      console.log("found existing customer id");
    } else {
      customer = await stripe.customers.create({
        name: user_name,
        email: receipt_email,
        address: user_address,
        phone,
      });
      console.log("new user customer id");
    }
    // create setup intent
    const setupIntent = await stripe.setupIntents.create({
      customer: customer.id,
      payment_method_types: ["card"],
      description: user_name + " setup intent",
    });
    console.log("created new guest setup intent", setupIntent);
    const successRes = successResponseCreator(200, "Guest Setup Intent Created", {
      clientSecret: setupIntent.client_secret,
      customerId: customer.id,
    });
    return successRes;
  } catch (err: any) {
    console.log("err", err.message, err);
    const errorRes = errorResponseCreator(400, err.message || "Guest Recurring Payment Intent Unsuccessful", err);
    return errorRes;
  }
};

export const stripeCreateGuestRecurringPayment = async (reqData: any) => {
  try {
    // extract vars
    const {
      user_id,
      user_name,
      receipt_email,
      amount,
      currency,
      customer_id,
      payment_method_id,
      remission_day,
      description,
      user_description,
      first_payment_day,
    } = reqData;

    await stripe.paymentMethods.attach(payment_method_id, { customer: customer_id });

    await stripe.customers.update(customer_id, {
      invoice_settings: { default_payment_method: payment_method_id },
    });

    console.log("done attaching payment method to customer, and setting method as default for customer invoices");

    const price = await stripe.prices.create({
      unit_amount: amount * 100,
      currency: currency,
      recurring: {
        interval: "month",
      },
      product_data: {
        name: description || user_description || "Monthly Subscription for " + (user_name || receipt_email),
      },
    });
    console.log("created new price, ", price.id, price);

    const nextMonthAnchor =
      first_payment_day === "start_now"
        ? Math.floor(new Date(new Date().getFullYear(), new Date().getMonth() + 1, +remission_day).getTime() / 1000)
        : Math.floor(new Date(first_payment_day).getTime() / 1000);

    const subscriptionCreationObject = {
      customer: customer_id,
      description: user_description || "Monthly Subscription for " + (user_name || receipt_email),
      items: [
        {
          price: price.id,
        },
      ],
      default_payment_method: payment_method_id,
      collection_method: "charge_automatically",

      billing_cycle_anchor_config: {
        day_of_month: +remission_day,
      },
      expand: ["latest_invoice.payment_intent"],
      proration_behavior: "none",
      trial_end: nextMonthAnchor,
    };

    // const subscriptionCreationObject =
    //   first_payment_day === "start_now"
    //     ? {
    //         ...subscriptionCreationInitObject,
    //         payment_behavior: "default_incomplete",
    //         add_invoice_items: [
    //           {
    //             price_data: {
    //               unit_amount: +amount * 100,
    //               currency: currency,
    //               product: price.product,
    //             },
    //           },
    //         ],
    //       }
    //     : subscriptionCreationInitObject;

    const subscription = await stripe.subscriptions.create(subscriptionCreationObject as Stripe.SubscriptionCreateParams);
    console.log("created new guest subscription, ", subscription.id, subscription);

    // attempting immediate payment for start now subscriptions by creating and paying invoice immediately (instead of relying on subscription's auto invoice creation and payment)
    let paidInvoice = null;
    if (first_payment_day === "start_now") {
      // Create a draft invoice first (to avoid accidentally sweeping other pending items)
      const invoice = await stripe.invoices.create({
        customer: customer_id,
        collection_method: "charge_automatically",
        auto_advance: false, // we will finalise ourselves
      });

      // Attach invoice item explicitly to this invoice AND link it to the subscription
      await stripe.invoiceItems.create({
        customer: customer_id,
        invoice: invoice.id, // ensures it goes onto this invoice only
        subscription: subscription.id, // ✅ links it to the subscription
        amount: amount * 100,
        currency,
        description: "First Payment for Subscription",
      });

      // Finalise and pay now
      const finalised = await stripe.invoices.finalizeInvoice(invoice.id);
      paidInvoice = await stripe.invoices.pay(finalised.id);
    }

    // find or create customer
    const { data: customerData, error: findCustomerError } = await SupabaseClient.from("partner").select().ilike("email", receipt_email).maybeSingle();

    if (customerData) {
      // update customer id in db
      const customerSubscriptionIdUpdate = {
        subscription_ids: [customerData.subscription_ids, subscription.id].flat().filter(Boolean),
        active_recurring_remission: true,
        preferred_remission_day: +remission_day,
      };
      const { data: updatedUser, error: updateUserError } = await SupabaseClient.from("partner")
        .update(customerSubscriptionIdUpdate)
        .eq("id", customerData.id)
        .select();
      console.log("updatedUser", updatedUser);
    }

    const successRes = successResponseCreator(200, "Guest Payment Subscription Successful", {
      subscription,
      paidInvoice,
    });
    return successRes;
  } catch (err: any) {
    console.log("err", err.message, err);
    const errorRes = errorResponseCreator(400, err.message || "Guest Recurring Payment Unsuccessful", err);
    return errorRes;
  }
};
