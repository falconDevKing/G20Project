import Stripe from "stripe";
import { errorResponseCreator, successResponseCreator } from "../../../utils/responsesFormat";
import SupabaseClient from "../../../utils/supabaseConnection";

const stripeSecretKey = process.env.GGP_STRIPE_SK || "";
const stripe = new Stripe(stripeSecretKey);

export const stripeFetchSubscription = async (reqData: any) => {
  try {
    const { subscriptionId } = reqData;

    // check theres subscription
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    const successRes = successResponseCreator(200, "Subscription Fetched Successfully", {
      subscription,
    });
    return successRes;
  } catch (err: any) {
    console.log("err", err.message, err);
    const errorRes = errorResponseCreator(400, err.message || "Error Fetching Subscription", err);
    return errorRes;
  }
};

export const stripePauseSubscription = async (reqData: any) => {
  try {
    const { subscriptionId, userId } = reqData;

    // check theres subscription
    await stripe.subscriptions.retrieve(subscriptionId);

    // pause subscription
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      pause_collection: {
        behavior: "void",
      },
    });

    const { data: updatedUser, error: updateUserError } = await SupabaseClient.from("partner")
      .update({ g20_active_recurring_remission: false })
      .eq("id", userId)
      .select();
    console.log("updatedUser", updatedUser);

    const successRes = successResponseCreator(200, "Subscription Paused Successfully", {
      subscription,
    });
    return successRes;
  } catch (err: any) {
    console.log("err", err.message, err);
    const errorRes = errorResponseCreator(400, err.message || "Error Pausing Subscription", err);
    return errorRes;
  }
};

export const stripeResumeSubscription = async (reqData: any) => {
  try {
    const { subscriptionId, userId } = reqData;

    // check theres subscription
    await stripe.subscriptions.retrieve(subscriptionId);

    // resume subscription
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      pause_collection: null,
    });

    const { data: updatedUser, error: updateUserError } = await SupabaseClient.from("partner")
      .update({ g20_active_recurring_remission: true })
      .eq("id", userId)
      .select();
    console.log("updatedUser", updatedUser);

    const successRes = successResponseCreator(200, "Subscription Resumed Successfully", {
      subscription,
    });
    return successRes;
  } catch (err: any) {
    console.log("err", err.message, err);
    const errorRes = errorResponseCreator(400, err.message || "Error Resuming Subscription", err);
    return errorRes;
  }
};

export const stripeUpdateSubscriptionAmountAndDay = async (reqData: any) => {
  try {
    const { subscriptionId, amount, currency, remission_day, user_name, user_id } = reqData;

    // 1. check theres subscription
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    if (!subscription) {
      throw new Error("No subscription found");
    }

    let subscriptionUpdateObject: Stripe.SubscriptionUpdateParams = {
      items: [] as any[],
      trial_end: 0,
      proration_behavior: "none",
    };

    // 2. Create a new Price object
    if (amount) {
      const price = await stripe.prices.create({
        unit_amount: amount * 100,
        currency: currency,
        recurring: {
          interval: "month",
        },
        product_data: {
          name: user_name + " updated monthly remission",
        },
      });

      subscriptionUpdateObject.items = [
        {
          id: subscription.items.data[0].id,
          price: price.id,
        },
      ];
    } else {
      delete subscriptionUpdateObject.items;
    }

    if (remission_day) {
      // 3. get new billing cycle anchor
      const today = new Date();
      let targetMonth, targetYear;

      if (today.getDate() > +remission_day) {
        // If today is after our target day, set for next month
        targetMonth = today.getMonth() + 1;
        targetYear = today.getFullYear();
      } else {
        // If today is before or on our target day, we can use current month
        targetMonth = today.getMonth();
        targetYear = today.getFullYear();
      }

      // Handle month overflow (December -> January)
      if (targetMonth > 11) {
        targetMonth = 0;
        targetYear++;
      }
      const newBillingDate = new Date(targetYear, targetMonth, +remission_day);
      const newBillingTimestamp = Math.floor(newBillingDate.getTime() / 1000);

      subscriptionUpdateObject.trial_end = newBillingTimestamp;
    } else {
      delete subscriptionUpdateObject.trial_end;
    }

    // 3. Update subscription with new price and billing cycle config
    const updatedSubscription = await stripe.subscriptions.update(subscriptionId, subscriptionUpdateObject);

    const { data: updatedUser, error: updateUserError } = await SupabaseClient.from("partner")
      .update({ preferred_remission_day: +remission_day })
      .eq("id", user_id)
      .select();

    const successRes = successResponseCreator(200, "Subscription Updated Successfully", {
      subscription: updatedSubscription,
    });
    return successRes;
  } catch (err: any) {
    console.log("err", err.message, err);
    const errorRes = errorResponseCreator(400, err.message || "Error Updating Subscription", err);
    return errorRes;
  }
};

export const stripeUpdateRecurringPaymentIntent = async (reqData: any) => {
  try {
    // extract vars
    const { user_id, user_name, user_email, user_address, phone, customer_id } = reqData;

    // create setup intent
    const setupIntent = await stripe.setupIntents.create({
      customer: customer_id,
      payment_method_types: ["card"],
      description: user_name + " updated setup intent",
    });
    console.log("updating setup intent", setupIntent);

    const successRes = successResponseCreator(200, "Setup Intent Updated Successfully", {
      clientSecret: setupIntent.client_secret,
    });

    return successRes;
  } catch (err: any) {
    console.log("err", err.message, err);
    const errorRes = errorResponseCreator(400, err.message || "Recurring Payment Intent Unsuccessful", err);
    return errorRes;
  }
};

export const stripeUpdateRecurringPayment = async (reqData: any) => {
  try {
    // extract vars
    const { customer_id, payment_method_id, subscriptionId } = reqData;

    // Attach the payment method to the customer
    await stripe.paymentMethods.attach(payment_method_id, {
      customer: customer_id,
    });

    // Step 2: Set as the default payment method for the customer
    const customer = await stripe.customers.update(customer_id, {
      invoice_settings: {
        default_payment_method: payment_method_id,
      },
    });

    // Update the subscription
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      default_payment_method: payment_method_id,
    });
    console.log("updated subscription payment, ", subscription.id, subscription);

    const successRes = successResponseCreator(200, "Payment Method Updated Successfully", {
      subscription,
    });

    return successRes;
  } catch (err: any) {
    console.log("err", err.message, err);
    const errorRes = errorResponseCreator(400, err.message || "Payment Method Update Unsuccessful", err);
    return errorRes;
  }
};
