import UserWeddingAnniversaryMailTemplate from "./userWeddingAnniversaryMailTemplate";
import { sendMailWithoutKeys } from "../../utils/sendMailWithoutKeys";
import { findAdmins } from "../../utils/generalHelpers";
import { fetchUsersWithWeddingAnniversary, getChapterAdmins } from "./helper";

export const handler = async (event: any) => {
  console.log("event", event);

  const { nextToken, loop } = event;

  try {
    const organisationAdmins = await getChapterAdmins();
    const from = loop ? nextToken || 0 : 0;
    const { organisationUsersWithWeddingAnniversaryBatch, next } = await fetchUsersWithWeddingAnniversary(from);

    const anniversaryMailPromises = organisationUsersWithWeddingAnniversaryBatch.flat().map(async (user) => {
      const { first_name, email, chapter_id, division_id } = user;

      if (!email) {
        return;
      }

      const admin = findAdmins(organisationAdmins, chapter_id || "", division_id || "");
      const adminEmails = admin.map((adminUser) => adminUser.email).filter(Boolean) as string[];

      await sendMailWithoutKeys({
        recipientMails: [email],
        mailSubject: "Happy Wedding Anniversary!",
        mailBody: UserWeddingAnniversaryMailTemplate(first_name || ""),
        bccMails: adminEmails,
      });
    });

    await Promise.all(anniversaryMailPromises);
    console.log({ nextToken: next, loop: !!next });
    return { nextToken: next, loop: !!next };
  } catch (error) {
    console.log("user wedding anniversary error", error);
    return { nextToken: null, loop: false };
  }
};
