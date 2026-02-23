import SupabaseClient from "../../utils/supabaseConnection";
import { PartnerRowType } from "../../interfaces/modifiedSupabaseTypes";

const PAGE_SIZE = 1000;

export const fetchChapterUsers = async (
  chapterId: string,
  from: number = 0,
): Promise<{
  chapterUsers: Partial<PartnerRowType>[];
  next: number | null;
}> => {
  const to = from + PAGE_SIZE - 1;

  const { data, error } = await SupabaseClient.from("partner")
    .select("id, first_name, email, chapter_id, division_id", { count: "exact" })
    .eq("chapter_id", chapterId)
    .order("id", { ascending: true })
    .range(from, to);

  if (error) {
    console.error("error fetch chapter users:", error);
    throw error;
  }

  console.log("chapterusersBatch from ", from, data.length);
  return {
    chapterUsers: data,
    next: data.length === PAGE_SIZE ? from + PAGE_SIZE : null,
  };
};

export const updateChapterUsersDivision = async (division_id: string, userIds: string[]): Promise<Partial<PartnerRowType>[]> => {
  const { data, error } = await SupabaseClient.from("partner")
    .update({ division_id })
    .in("id", userIds)
    .select("id, first_name, email, chapter_id, division_id");

  if (error) {
    console.error("error updating chapter users division:", error);
    throw error;
  }

  console.log("chapterusersdivisionupdateBatch ", data.length);
  return data;
};
