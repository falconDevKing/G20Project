import express from "express";
import Stripe from "stripe";
import cors from "cors";
import serverless from "serverless-http";

import { paystackChargeAuthorization, paystackInitTransaction, paystackVerifyTransaction } from "./controllers/paystack";
import { stripeCreatePaymentIntent, stripeCreateRecurringPayment, stripeCreateRecurringPaymentIntent } from "./controllers/stripeRegisteredUsers";
import {
  stripeFetchSubscription,
  stripePauseSubscription,
  stripeResumeSubscription,
  stripeUpdateSubscriptionAmountAndDay,
  stripeUpdateRecurringPaymentIntent,
  stripeUpdateRecurringPayment,
} from "./controllers/stripeRegisteredUsersUpdates";
import { stripeCreateGuestPaymentIntent, stripeCreateGuestRecurringPaymentIntent, stripeCreateGuestRecurringPayment } from "./controllers/stripeGuestUsers";

const app = express();
app.use(express.json());

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://globalgospelpartnership.org",
    "https://globalgospelpartnership.com",
    "https://www.globalgospelpartnership.org",
    "https://www.globalgospelpartnership.com",
  ],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

app.get("/createPaymentIntent", (req, res) => {
  res.send("Welcome to Supabase");
});

app.post("/createPaymentIntent", async (req, res) => {
  console.log("req", req);
  console.log("reqbody", req.body);
  const response = await stripeCreatePaymentIntent(req.body);
  res.status(response.statusCode).json(response);
});

app.post("/createRecurringPaymentIntent", async (req, res) => {
  console.log("req", req);
  console.log("reqbody", req.body);
  const response = await stripeCreateRecurringPaymentIntent(req.body);
  res.status(response.statusCode).json(response);
});

app.post("/createRecurringPayment", async (req, res) => {
  console.log("req", req);
  console.log("reqbody", req.body);
  const response = await stripeCreateRecurringPayment(req.body);
  res.status(response.statusCode).json(response);
});

app.post("/fetchSubscription", async (req, res) => {
  console.log("req", req);
  console.log("reqbody", req.body);
  const response = await stripeFetchSubscription(req.body);
  res.status(response.statusCode).json(response);
});

app.post("/pauseSubscription", async (req, res) => {
  console.log("req", req);
  console.log("reqbody", req.body);
  const response = await stripePauseSubscription(req.body);
  res.status(response.statusCode).json(response);
});

app.post("/resumeSubscription", async (req, res) => {
  console.log("req", req);
  console.log("reqbody", req.body);
  const response = await stripeResumeSubscription(req.body);
  res.status(response.statusCode).json(response);
});

app.post("/updateSubscriptionAmountAndDay", async (req, res) => {
  console.log("req", req);
  console.log("reqbody", req.body);
  const response = await stripeUpdateSubscriptionAmountAndDay(req.body);
  res.status(response.statusCode).json(response);
});

app.post("/updateRecurringPaymentIntent", async (req, res) => {
  console.log("req", req);
  console.log("reqbody", req.body);
  const response = await stripeUpdateRecurringPaymentIntent(req.body);
  res.status(response.statusCode).json(response);
});

app.post("/updateRecurringPayment", async (req, res) => {
  console.log("req", req);
  console.log("reqbody", req.body);
  const response = await stripeUpdateRecurringPayment(req.body);
  res.status(response.statusCode).json(response);
});

app.post("/createGuestPaymentIntent", async (req, res) => {
  console.log("req", req);
  console.log("reqbody", req.body);
  const response = await stripeCreateGuestPaymentIntent(req.body);
  res.status(response.statusCode).json(response);
});

app.post("/createGuestRecurringPaymentIntent", async (req, res) => {
  console.log("req", req);
  console.log("reqbody", req.body);
  const response = await stripeCreateGuestRecurringPaymentIntent(req.body);
  res.status(response.statusCode).json(response);
});

app.post("/createGuestRecurringPayment", async (req, res) => {
  console.log("req", req);
  console.log("reqbody", req.body);
  const response = await stripeCreateGuestRecurringPayment(req.body);
  res.status(response.statusCode).json(response);
});

app.post("/paystack/initTransaction", async (req, res) => {
  console.log("req", req);
  console.log("reqbody", req.body);
  const response = await paystackInitTransaction(req.body);
  res.status(response.statusCode).json(response);
});

app.post("/paystack/verifyTransaction", async (req, res) => {
  console.log("req", req);
  console.log("reqbody", req.body);
  const response = await paystackVerifyTransaction(req.body);
  res.status(response.statusCode).json(response);
});

app.post("/paystack/charge_authorization", async (req, res) => {
  console.log("req", req);
  console.log("reqbody", req.body);
  const response = await paystackChargeAuthorization(req.body);
  res.status(response.statusCode).json(response);
});

// Export Lambda handler
export const handler = serverless(app);
