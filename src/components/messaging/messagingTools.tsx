import { formatChapterName, formatDateToMonthDay, formatDivisionName, formatMMDDToMonthDay, ChaptersDataType, DivisionsDataType } from "@/lib/numberUtils";
import { CapitaliseWords } from "@/lib/textUtils";
import { Editor } from "@tiptap/react";
import { PartnerRowType } from "@/supabase/modifiedSupabaseTypes";

export const insertPlaceholder = (editor: Editor, key: keyof PartnerRowType): void => {
  if (editor) {
    editor.chain().focus().insertContent(`{${key}}`).run();
  }
};

export const personaliseMessage = (
  template: string,
  user: PartnerRowType,
  modifiedDivisions: DivisionsDataType[],
  modifiedChapters: ChaptersDataType[],
): string => {
  return template.replace(/{(.*?)}/g, (_, key) => {
    const rawValue = user[key as keyof PartnerRowType];
    if (!rawValue) {
      return "_";
    }

    switch (key) {
      case "division_id":
        return formatDivisionName(modifiedDivisions, rawValue as string);
      case "chapter_id":
        return formatChapterName(modifiedChapters, rawValue as string);
      case "date_of_birth":
        return formatDateToMonthDay(rawValue as string);
      case "birth_day_mmdd":
        return formatMMDDToMonthDay(rawValue as string);
      default:
        return Array.isArray(rawValue) ? CapitaliseWords(rawValue.join(", ")) : CapitaliseWords(String(rawValue));
    }
  });
};
