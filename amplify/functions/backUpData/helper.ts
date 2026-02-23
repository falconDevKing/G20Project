import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dayjs from "dayjs";

import BackUpDataMailTemplate from "./backUpDataMailTemplate";
import SupabaseClient from "../../utils/supabaseConnection";
import { ChapterRowType, DivisionRowType, OrganisationRowType, PartnerRowType, PaymentRowType, RegionRowType } from "../../interfaces/modifiedSupabaseTypes";
import { sendMailWithoutKeys } from "../../utils/sendMailWithoutKeys";

const PAGE_SIZE = 1000;

const s3 = new S3Client({ region: process.env.AWS_REGION });

export type dbType = OrganisationRowType | DivisionRowType | RegionRowType | ChapterRowType | PartnerRowType | PaymentRowType | any;

export const fetchOrganisations = async () => {
  const organisationData: OrganisationRowType[][] = [];

  let from = 0;

  const fetchOrganisationData = async (): Promise<void> => {
    const { data: organisation, error } = await SupabaseClient.from("organisation")
      .select()
      .order("id", { ascending: true }) // 👈 Ensures consistent range-based pagination
      .range(from, from + PAGE_SIZE - 1);

    if (error) {
      console.log("Error fetching division", error);
      throw error;
    }

    if (organisation && organisation.length > 0) {
      organisationData.push(organisation);

      if (organisation.length === PAGE_SIZE) {
        from += PAGE_SIZE;
        await fetchOrganisationData(); //  Recursive call
      }
    }
  };

  await fetchOrganisationData();
  console.log("organisationData", organisationData.flat().length);

  return organisationData.flat();
};

export const fetchDivisions = async () => {
  const divisionsData: DivisionRowType[][] = [];

  let from = 0;

  const fetchDivisionsData = async (): Promise<void> => {
    const { data: divisions, error } = await SupabaseClient.from("division")
      .select()
      .order("id", { ascending: true }) // 👈 Ensures consistent range-based pagination
      .range(from, from + PAGE_SIZE - 1);

    if (error) {
      console.log("Error fetching division", error);
      throw error;
    }

    if (divisions && divisions.length > 0) {
      divisionsData.push(divisions);

      if (divisions.length === PAGE_SIZE) {
        from += PAGE_SIZE;
        await fetchDivisionsData(); //  Recursive call
      }
    }
  };

  await fetchDivisionsData();
  console.log("divisionsData", divisionsData.flat().length);

  return divisionsData.flat();
};

export const fetchRegions = async () => {
  const regionsData: RegionRowType[][] = [];

  let from = 0;

  const fetchRegionsData = async (): Promise<void> => {
    const { data: regions, error } = await SupabaseClient.from("region")
      .select()
      .order("id", { ascending: true }) // 👈 Ensures consistent range-based pagination
      .range(from, from + PAGE_SIZE - 1);

    if (error) {
      console.log("Error fetching regions", error);
      throw error;
    }

    if (regions && regions.length > 0) {
      regionsData.push(regions);

      if (regions.length === PAGE_SIZE) {
        from += PAGE_SIZE;
        await fetchRegionsData(); //  Recursive call
      }
    }
  };

  await fetchRegionsData();
  console.log("regionsData", regionsData.flat().length);

  return regionsData.flat();
};

export const fetchChapters = async () => {
  const chaptersData: ChapterRowType[][] = [];

  let from = 0;

  const fetchChaptersData = async (): Promise<void> => {
    const { data: chapters, error } = await SupabaseClient.from("chapter")
      .select()
      .order("id", { ascending: true }) // 👈 Ensures consistent range-based pagination
      .range(from, from + PAGE_SIZE - 1);

    if (error) {
      console.log("Error fetching chapters", error);
      throw error;
    }

    if (chapters && chapters.length > 0) {
      chaptersData.push(chapters);

      if (chapters.length === PAGE_SIZE) {
        from += PAGE_SIZE;
        await fetchChaptersData(); //  Recursive call
      }
    }
  };

  await fetchChaptersData();
  console.log("chaptersData", chaptersData.flat().length);

  return chaptersData.flat();
};

export const fetchPartners = async () => {
  const partnersData: PartnerRowType[][] = [];

  let from = 0;

  const fetchPartnersData = async (): Promise<void> => {
    const { data: partners, error } = await SupabaseClient.from("partner")
      .select()
      .order("id", { ascending: true }) // 👈 Ensures consistent range-based pagination
      .range(from, from + PAGE_SIZE - 1);

    if (error) {
      console.log("Error fetching partners", error);
      throw error;
    }

    if (partners && partners.length > 0) {
      partnersData.push(partners);

      if (partners.length === PAGE_SIZE) {
        from += PAGE_SIZE;
        await fetchPartnersData(); //  Recursive call
      }
    }
  };

  await fetchPartnersData();
  console.log("partnersData", partnersData.flat().length);

  return partnersData.flat();
};

export const fetchPayments = async () => {
  const paymentsData: PaymentRowType[][] = [];

  let from = 0;

  const fetchPaymentsData = async (): Promise<void> => {
    const { data: payments, error } = await SupabaseClient.from("payment")
      .select()
      .order("id", { ascending: true }) // 👈 Ensures consistent range-based pagination
      .range(from, from + PAGE_SIZE - 1);

    if (error) {
      console.log("Error fetching payments", error);
      throw error;
    }

    if (payments && payments.length > 0) {
      paymentsData.push(payments);

      if (payments.length === PAGE_SIZE) {
        from += PAGE_SIZE;
        await fetchPaymentsData(); //  Recursive call
      }
    }
  };

  await fetchPaymentsData();
  console.log("paymentsData", paymentsData.flat().length);

  return paymentsData.flat();
};

export const fetchG20Partners = async () => {
  const G20PartnersData: any[][] = [];

  let from = 0;

  const fetchG20PartnersData = async (): Promise<void> => {
    const { data: G20Partners, error } = await SupabaseClient.from("g20_partner")
      .select()
      .order("id", { ascending: true }) // 👈 Ensures consistent range-based pagination
      .range(from, from + PAGE_SIZE - 1);

    if (error) {
      console.log("Error fetching G20Partners", error);
      throw error;
    }

    if (G20Partners && G20Partners.length > 0) {
      G20PartnersData.push(G20Partners);

      if (G20Partners.length === PAGE_SIZE) {
        from += PAGE_SIZE;
        await fetchG20PartnersData(); //  Recursive call
      }
    }
  };

  await fetchG20PartnersData();
  console.log("G20PartnersData", G20PartnersData.flat().length);

  return G20PartnersData.flat();
};

export const fetchPaystackPendingPayments = async () => {
  const PaystackPendingPaymentsData: any[][] = [];

  let from = 0;

  const fetchPaystackPendingPaymentsData = async (): Promise<void> => {
    const { data: PaystackPendingPayments, error } = await SupabaseClient.from("paystack_pending_payments")
      .select()
      .order("id", { ascending: true }) // 👈 Ensures consistent range-based pagination
      .range(from, from + PAGE_SIZE - 1);

    if (error) {
      console.log("Error fetching PaystackPendingPayments", error);
      throw error;
    }

    if (PaystackPendingPayments && PaystackPendingPayments.length > 0) {
      PaystackPendingPaymentsData.push(PaystackPendingPayments);

      if (PaystackPendingPayments.length === PAGE_SIZE) {
        from += PAGE_SIZE;
        await fetchPaystackPendingPaymentsData(); //  Recursive call
      }
    }
  };

  await fetchPaystackPendingPaymentsData();
  console.log("PaystackPendingPaymentsData", PaystackPendingPaymentsData.flat().length);

  return PaystackPendingPaymentsData.flat();
};

export const fetchPaystackRecurringPayments = async () => {
  const PaystackRecurringPaymentsData: any[][] = [];

  let from = 0;

  const fetchPaystackRecurringPaymentsData = async (): Promise<void> => {
    const { data: PaystackRecurringPayments, error } = await SupabaseClient.from("paystack_recurring_payments")
      .select()
      .order("id", { ascending: true }) // 👈 Ensures consistent range-based pagination
      .range(from, from + PAGE_SIZE - 1);

    if (error) {
      console.log("Error fetching PaystackRecurringPayments", error);
      throw error;
    }

    if (PaystackRecurringPayments && PaystackRecurringPayments.length > 0) {
      PaystackRecurringPaymentsData.push(PaystackRecurringPayments);

      if (PaystackRecurringPayments.length === PAGE_SIZE) {
        from += PAGE_SIZE;
        await fetchPaystackRecurringPaymentsData(); //  Recursive call
      }
    }
  };

  await fetchPaystackRecurringPaymentsData();
  console.log("PaystackRecurringPaymentsData", PaystackRecurringPaymentsData.flat().length);

  return PaystackRecurringPaymentsData.flat();
};

export const fetchMailingMedia = async () => {
  const MailingMediaData: any[][] = [];

  let from = 0;

  const fetchMailingMediaData = async (): Promise<void> => {
    const { data: MailingMedia, error } = await SupabaseClient.from("mailing_media")
      .select()
      .order("id", { ascending: true }) // 👈 Ensures consistent range-based pagination
      .range(from, from + PAGE_SIZE - 1);

    if (error) {
      console.log("Error fetching MailingMedia", error);
      throw error;
    }

    if (MailingMedia && MailingMedia.length > 0) {
      MailingMediaData.push(MailingMedia);

      if (MailingMedia.length === PAGE_SIZE) {
        from += PAGE_SIZE;
        await fetchMailingMediaData(); //  Recursive call
      }
    }
  };

  await fetchMailingMediaData();
  console.log("MailingMediaData", MailingMediaData.flat().length);

  return MailingMediaData.flat();
};

export const uploadDBackUpToS3 = async (dataFetchCall: () => Promise<dbType[]>, fileName: string) => {
  try {
    console.log("Uploading to S3 for " + fileName);
    const bucketName = process.env.BUCKET_NAME!;
    const key = `backUp/${fileName}.json`;

    const dataArray = await dataFetchCall();

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: JSON.stringify(dataArray, null, 2), // pretty JSON
      ContentType: "application/json",
    });

    await s3.send(command);

    console.log("Uploaded to S3 for " + fileName);

    const message = "Upload successful for " + fileName;
    return message;
  } catch (error) {
    console.log("Error uploading to S3 for " + fileName, error);
    const message = "Unsuccessful  upload for " + fileName;
    return message;
  }
};

export const sendEveningMail = async () => {
  const hour = dayjs().hour();
  const isEvening = hour >= 18 && hour < 24;

  if (isEvening) {
    await sendMailWithoutKeys({
      // recipientMails: ["emmanueloyekan33@gmail.com", "info@globalgospelpartnership.org"],
      recipientMails: ["emmanueloyekan33@gmail.com"],
      mailSubject: "Backup Completed Successfully",
      mailBody: BackUpDataMailTemplate(process.env.GGP_BASE_URL || 'localhost'),
    });
  }
};
