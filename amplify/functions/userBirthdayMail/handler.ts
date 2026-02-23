// import { Amplify } from "aws-amplify";
// import { generateClient } from "aws-amplify/data";
// import { env } from "$amplify/env/userBirthdayMail";
// import { getAmplifyDataClientConfig } from "@aws-amplify/backend/function/runtime";
// import type { Schema } from "../../data/resource";

import UserBirthdayMailTemplate from "./userBirthdayMailTemplate";
import { sendMailWithoutKeys } from "../../utils/sendMailWithoutKeys";
import SupabaseClient from "../../utils/supabaseConnection";
import { PartnerRowType } from "../../interfaces/modifiedSupabaseTypes";
import { findAdmins } from "../../utils/generalHelpers";
import { fetchUsersWithBirthday, getChapterAdmins, sendHappyBirthdayMessage } from "./helper";

export const handler = async (event: any) => {
  console.log("event", event);

  const { nextToken, loop } = event;

  try {
    // GET TODAY BIRTHDAY USERS
    const organisationAdmins = await getChapterAdmins();

    const from = loop ? nextToken || 0 : 0;
    const { organisationUsersWithBirthdayBatch, next } = await fetchUsersWithBirthday(from);
    console.log({ organisationUsersWithBirthdayBatch, next });

    const userBirthdayMailPromises = organisationUsersWithBirthdayBatch.flat().map(async (user) => {
      // RUN BIRTHDAY MAIL FOR USERS
      const { first_name, email, chapter_id, division_id, phone_number } = user;

      const admin = findAdmins(organisationAdmins, chapter_id || "", division_id || "");
      const adminEmails = admin.map((admin) => admin.email).filter(Boolean) as string[];

      const recipientMails = [email || ""];
      const mailSubject = "HAPPY BIRTHDAY!!!";
      const mailBody = UserBirthdayMailTemplate(first_name || "");

      await sendMailWithoutKeys({ recipientMails, mailSubject, mailBody, bccMails: adminEmails });

      await sendHappyBirthdayMessage({ to: phone_number || "", name: first_name || "" });
    });

    await Promise.all(userBirthdayMailPromises);
    console.log({ nextToken: next, loop: !!next });
    return { nextToken: next, loop: !!next };
  } catch (error) {
    console.log("user birthday error", error);
    return { nextToken: null, loop: false };
  }
};
