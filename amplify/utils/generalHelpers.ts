import { PartnerRowType } from "../interfaces/modifiedSupabaseTypes";

export function findAdmins(partners: Partial<PartnerRowType>[], chapterId: string, divisionId: string): Partial<PartnerRowType>[] {
  if (!Array.isArray(partners) || partners.length === 0) {
    return [];
  }

  const admins = [];
  // First: find chapter admins
  const chapterAdmins = partners.filter((p) => p.chapter_id === chapterId);
  if (chapterAdmins.length > 0) admins.push(chapterAdmins);

  // If none: find division admins
  const divisionAdmins = partners.filter((p) => p.division_id === divisionId);
  if (divisionAdmins.length > 0) admins.push(divisionAdmins);

  // If neither: return empty
  return admins.flat();
}
