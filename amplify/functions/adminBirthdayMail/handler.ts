import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../data/resource";
import { env } from "$amplify/env/adminBirthdayMail";
import { getAmplifyDataClientConfig } from "@aws-amplify/backend/function/runtime";
import dayjs from "dayjs";
import AdminBirthdayMailTemplate from "./adminBirthdayMailTemplate";
import { sendMailWithoutKeys } from "../../utils/sendMailWithoutKeys";
import { getAdminRepsData, getChapters, fetchChapterUsersWithBirthday, sendAdminBirthdayReminderMessage } from "./helpers";
import { addMessageToQueue, removeMessageFromQueue } from "../../utils/sqs";

const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(env);

Amplify.configure(resourceConfig, libraryOptions);

export const handler = async (event: any) => {
  console.log("event", event);

  const { chapterFocusIndex, nextToken, loop } = event;

  try {
    const chapters = await getChapters();
    const chapterIdInUse = chapters[chapterFocusIndex]?.id;
    const chapter = chapters.find((chapter) => chapter.id === chapterIdInUse);
    const { chapterRepsMails, divisionRepsMails, repsData } = await getAdminRepsData(chapterIdInUse);

    // fetch chapters users and update
    const from = loop ? nextToken || 0 : 0;
    const { chapterUsersWithBDay, next } = await fetchChapterUsersWithBirthday(chapterIdInUse, from);

    const userBirthdayData = chapterUsersWithBDay.map((user) => {
      const { name, phone_number, date_of_birth } = user;

      return { name: name || "", phoneNumber: phone_number || "", dateofBirth: dayjs(date_of_birth).format("DD MMM") };
    });

    const uniqueAdminMails = Array.from(new Set([...chapterRepsMails, ...divisionRepsMails]));

    const mailSubject = "🎉 Birthday Alert — Partners Under Your Care" + `${chapter?.name ? " in " + chapter.name : ""}`;
    const mailBody = AdminBirthdayMailTemplate(userBirthdayData);

    userBirthdayData.length && (await sendMailWithoutKeys({ recipientMails: uniqueAdminMails, mailSubject, mailBody, ccMails: divisionRepsMails }));

    //SEND WHATSAPP MESSAGE
    const sendAdminBirthdayReminderWhatsappMessagePromises = uniqueAdminMails.map(async (adminMail) => {
      const adminPhoneNumber = repsData.find((rep) => rep?.email === adminMail)?.phone_number;

      await sendAdminBirthdayReminderMessage({ to: adminPhoneNumber });
    });

    await Promise.all(sendAdminBirthdayReminderWhatsappMessagePromises);

    return { chapterFocusIndex: next ? chapterFocusIndex : +chapterFocusIndex + 1, nextToken: next, loop: !!next || chapterFocusIndex < chapters?.length };
  } catch (error) {
    console.log("admin birthday error", error);
    return { nextToken: null, loop: false };
  }
};
