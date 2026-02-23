import twilio from "twilio";
import dayjs from "dayjs";

import SupabaseClient from "../../utils/supabaseConnection";
import { PartnerRowType } from "../../interfaces/modifiedSupabaseTypes";

const client = twilio(process.env.GGP_TWILIO_ACCOUNT_SID!, process.env.GGP_TWILIO_AUTH_TOKEN!);
const from = process.env.GGP_TWILIO_PHONE_NUMBER;

const restrictWhatsapp = process.env.GGP_RESTRICT_TWILIO === "true";
const PAGE_SIZE = 1000;

const organisationId = process.env.GGP_ORG_ID as string;
interface SendHappyBirthdayMessageParams {
  to: string;

  name: string;
}

export const sendHappyBirthdayMessage = async ({ to, name }: SendHappyBirthdayMessageParams) => {
  try {
    if (restrictWhatsapp) {
      return;
    }

    if (!to) {
      return;
    }

    const message = await client.messages.create({
      contentSid: "HX3cf2597dc9f3c870e84911b36c65fc8c",
      contentVariables: JSON.stringify({ 1: name }),
      from: `whatsapp:${from}`,
      to: `whatsapp:${to}`,
    });

    console.log("sendHappyBirthdayMessage", message.body);
  } catch (err) {
    console.log("error sendHappyBirthdayMessage", err);
  }
};

export const getChapterAdmins = async () => {
  const organisationAdmins: Partial<PartnerRowType>[] = [];

  const fetchChaptersAdmin = async (from: number = 0): Promise<void> => {
    const to = from + PAGE_SIZE - 1;

    const { data, error } = await SupabaseClient.from("partner")
      .select("id, email, chapter_id, division_id ", { count: "exact" })
      .neq("permission_type", "individual")
      .order("id", { ascending: true })
      .range(from, to);

    if (error) {
      console.error("Supabase fetch error:", error);
      throw error;
    }

    if (data?.length) {
      organisationAdmins.push(...data);

      if (data.length === PAGE_SIZE) {
        await fetchChaptersAdmin(from + PAGE_SIZE); // recursively fetch next page
      }
    }
  };

  console.log("fetched admins", organisationAdmins.length);
  return organisationAdmins;
};

export const fetchUsersWithBirthday = async (
  from: number = 0,
): Promise<{
  organisationUsersWithBirthdayBatch: Partial<PartnerRowType>[];
  next: number | null;
}> => {
  const todayMMDD = dayjs().format("MM-DD");
  console.log(todayMMDD);

  const to = from + PAGE_SIZE - 1;

  const { data, error } = await SupabaseClient.from("partner")
    .select("id, first_name, email, chapter_id, division_id, phone_number", { count: "exact" })
    .eq("organisation_id", organisationId)
    .eq("birth_day_mmdd", todayMMDD)
    .order("id", { ascending: true })
    .range(from, to);

  if (error) {
    console.error("Supabase fetch error:", error);
    throw error;
  }

  console.log("organisationUsersWithBirthdayBatch from ", from, data.length);
  return {
    organisationUsersWithBirthdayBatch: data,
    next: data.length === PAGE_SIZE ? from + PAGE_SIZE : null,
  };
};

await fetchUsersWithBirthday();
