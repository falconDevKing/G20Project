import dayjs from "dayjs";

import SupabaseClient from "../../utils/supabaseConnection";
import { PartnerRowType } from "../../interfaces/modifiedSupabaseTypes";
import { getChapterAdmins } from "../userBirthdayMail/helper";

const PAGE_SIZE = 1000;
const organisationId = process.env.GGP_ORG_ID as string;

export { getChapterAdmins };

export const fetchUsersWithWeddingAnniversary = async (
  from: number = 0,
): Promise<{
  organisationUsersWithWeddingAnniversaryBatch: Partial<PartnerRowType>[];
  next: number | null;
}> => {
  const to = from + PAGE_SIZE - 1;
  const todayMMDD = dayjs().format("MM-DD");

  const { data, error } = await SupabaseClient.from("partner")
    .select("id, first_name, email, chapter_id, division_id, marriage_anniversary", { count: "exact" })
    .eq("organisation_id", organisationId)
    .eq("marriage_anniversary_mmdd", todayMMDD)
    .order("id", { ascending: true })
    .range(from, to);

  if (error) {
    console.error("Supabase fetch error:", error);
    throw error;
  }

  console.log("organisationUsersWithWeddingAnniversaryBatch from ", from, data.length);

  return {
    organisationUsersWithWeddingAnniversaryBatch: data,
    next: (data || []).length === PAGE_SIZE ? from + PAGE_SIZE : null,
  };
};
