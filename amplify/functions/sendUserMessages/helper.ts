import { ChapterRowType, DivisionRowType, PartnerRowType } from "../../interfaces/modifiedSupabaseTypes";

export const formatDateToMMDD = (input: string | Date): string => {
  const date = new Date(input);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${month}-${day}`;
};

export const formatDateToMonthDay = (input: string | Date): string => {
  const date = new Date(input);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "2-digit",
  });
};

export const formatMMDDToMonthDay = (value: string): string => {
  const fakeDate = `2000-${value}`;
  return formatDateToMonthDay(fakeDate);
};

export const CapitaliseText = (text: string): string => text.charAt(0).toUpperCase() + text.slice(1);
export const CapitaliseWords = (text: string): string =>
  text
    .split(" ")
    .map((word) => CapitaliseText(word))
    .join(" ");

export const formatDivisionName = (divisionsData: DivisionRowType[], divisionId: string) => {
  return divisionsData.find((division) => division.id === divisionId)?.name || "";
};

export const formatChapterName = (chaptersData: ChapterRowType[], chapterId: string) => {
  return chaptersData.find((chapter) => chapter.id === chapterId)?.name || "";
};

export const personaliseMessage = (template: string, user: PartnerRowType, divisions: DivisionRowType[], chapters: ChapterRowType[]): string => {
  return template.replace(/{(.*?)}/g, (_, key) => {
    const rawValue = user[key as keyof PartnerRowType];
    if (!rawValue) {
      return "_";
    }

    switch (key) {
      case "division_id":
        return formatDivisionName(divisions, rawValue as string);
      case "chapter_id":
        return formatChapterName(chapters, rawValue as string);
      case "date_of_birth":
        return formatDateToMonthDay(rawValue as string);
      case "birth_day_mmdd":
        return formatMMDDToMonthDay(rawValue as string);
      default:
        return Array.isArray(rawValue) ? CapitaliseWords(rawValue.join(", ")) : CapitaliseWords(String(rawValue));
    }
  });
};

export const getRemissionsMonthsBetween = (start: Date, end: Date): string[] => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const result: string[] = [];

  startDate.setDate(1); // Ensure start at the beginning of the month

  while (startDate <= endDate) {
    result.push(
      startDate.toLocaleString("en-GB", {
        month: "long",
        year: "numeric",
      }),
    );

    startDate.setMonth(startDate.getMonth() + 1); // Go to next month
  }

  return result;
};

export const chunk = <T>(arr: T[], size: number): T[][] => {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};
