import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import { env } from "$amplify/env/backUpData";
import { getAmplifyDataClientConfig } from "@aws-amplify/backend/function/runtime";
import type { Schema } from "../../data/resource";
import {
  fetchRegions,
  fetchPartners,
  fetchPayments,
  fetchChapters,
  fetchDivisions,
  fetchG20Partners,
  fetchOrganisations,
  fetchPaystackPendingPayments,
  fetchPaystackRecurringPayments,
  uploadDBackUpToS3,
  sendEveningMail,
  fetchMailingMedia,
} from "./helper";

const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(env);
Amplify.configure(resourceConfig, libraryOptions);
const client = generateClient<Schema>();

export const handler = async (event: any) => {
  console.log("event", event);

  const timestamp = new Date().toISOString();

  try {
    await uploadDBackUpToS3(fetchOrganisations, timestamp + "/organisations");
    await uploadDBackUpToS3(fetchDivisions, timestamp + "/divisions");
    await uploadDBackUpToS3(fetchRegions, timestamp + "/regions");
    await uploadDBackUpToS3(fetchChapters, timestamp + "/chapters");
    await uploadDBackUpToS3(fetchPartners, timestamp + "/partners");
    await uploadDBackUpToS3(fetchPayments, timestamp + "/payments");
    await uploadDBackUpToS3(fetchG20Partners, timestamp + "/g20_partners");
    await uploadDBackUpToS3(fetchPaystackPendingPayments, timestamp + "/paystack_pending_payments");
    await uploadDBackUpToS3(fetchPaystackRecurringPayments, timestamp + "/paystack_recurring_payments");
    await uploadDBackUpToS3(fetchMailingMedia, timestamp + "/mailing_media");

    await sendEveningMail();
  } catch (error) {
    console.log("backup error", error);
  }

  return event;
};
