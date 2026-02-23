export const numberWithCurrencyFormatter = (currency: string = "USD", amount: number = 0, locale = "en-US") => {
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(amount);
};

export const getCurrencySymbol = (code: string) =>
  (0)
    .toLocaleString("en", { style: "currency", currency: code || "GBP" })
    .replace(/\d|\.|,/g, "")
    .trim();

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

export type DivisionsDataType = {
  id: string;
  name: string;
  organisation_id: string;
  reps: never[] | Record<string, any>;
};

export type ChaptersDataType = {
  id: string;
  name: string;
  division_id: string;
  organisation_id: string;
  base_currency: string;
  country: string;
  reps: Record<string, any> | never[];
};

export const formatDivisionName = (divisionsData: DivisionsDataType[], divisionId: string) => {
  return divisionsData.find((division) => division.id === divisionId)?.name || "";
};

export const formatChapterName = (chaptersData: ChaptersDataType[], chapterId: string) => {
  return chaptersData.find((chapter) => chapter.id === chapterId)?.name || "";
};

export const getFirstPaymentDateSequence = (dayOfMonth: number) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const currentDate = now.getDate();

  const dates = [];

  const createDate = (year: number, month: number, day: number) => {
    const date = new Date(year, month, day);

    // If day doesn't exist in that month (e.g., Feb 31), // JS Date will roll over to next month, so we need to check
    if (date.getDate() !== day) {
      // If the day doesn't exist, adjust to last day of the month
      return new Date(year, month + 1, 0).toISOString();
    }
    return date.toISOString();
  };

  if (dayOfMonth <= currentDate) {
    // Case: Day is in the past (relative to current day of month) or today
    dates.push({ value: "start_now", name: "Start Now" });
    dates.push({
      value: createDate(currentYear, currentMonth + 1, dayOfMonth),
      name: formatDateToMonthDay(createDate(currentYear, currentMonth + 1, dayOfMonth)),
    });
  } else {
    // Case: Day is in the future
    dates.push({ value: "start_now", name: "Start Now" });
    dates.push({ value: createDate(currentYear, currentMonth, dayOfMonth), name: formatDateToMonthDay(createDate(currentYear, currentMonth, dayOfMonth)) });
    dates.push({
      value: createDate(currentYear, currentMonth + 1, dayOfMonth),
      name: formatDateToMonthDay(createDate(currentYear, currentMonth + 1, dayOfMonth)),
    });
  }

  return dates;
};
