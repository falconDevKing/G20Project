import { PartnerMetrics, RemissionMetrics } from "@/supabase/rpcTypes";

export const addFiltersToPartnerMetrics = (objectA: PartnerMetrics): PartnerMetrics => {
  const statusQueries: Record<string, Record<string, string>> = {
    "Total Partners": { status: "all" },
    "Consistent Partners": { status: "consistent" },
    "Active Partners": { status: "active" },
    "Passive Partners": { status: "passive" },
  };

  const output: Partial<PartnerMetrics> = {};

  for (const key in objectA) {
    output[key as keyof PartnerMetrics] = objectA[key as keyof PartnerMetrics].map((item) => {
      let defaultQuery;
      let navTo = "/users";

      if (key === "Status" && statusQueries[item.title]) {
        defaultQuery = statusQueries[item.title];
      }

      return defaultQuery ? { ...item, defaultQuery, navTo } : item;
    });
  }

  return output as PartnerMetrics;
};

export const addFiltersToRemissionsMetrics = (objectA: Partial<RemissionMetrics>): RemissionMetrics => {
  const output: Partial<RemissionMetrics> = {};

  for (const key in objectA) {
    output[key as keyof RemissionMetrics] = (objectA[key as keyof RemissionMetrics] || []).map((item) => {
      let defaultQuery;
      let navTo;

      if (key === "Payment_Inflow") {
        if (item.title.toLowerCase().includes("month")) {
          defaultQuery = { payment_date: NormaliseDateRange("month"), status: "Paid" };
        } else if (item.title.toLowerCase().includes("quarter")) {
          defaultQuery = { payment_date: NormaliseDateRange("quarter"), status: "Paid" };
        } else if (item.title.toLowerCase().includes("year")) {
          defaultQuery = { payment_date: NormaliseDateRange("year"), status: "Paid" };
        }
        navTo = "/remissions";
      }

      if (key === "Pending_Remissions") {
        navTo = "/pending-remissions";
      }

      if (defaultQuery || navTo) {
        return { ...item, defaultQuery, navTo };
      } else {
        return item;
      }

      // return defaultQuery || navTo ? { ...item, defaultQuery, navTo } : item;
    });
  }

  return output as RemissionMetrics;
};

type DateRangeType = "month" | "quarter" | "year";

interface PaymentDateRange {
  from?: Date | string;
  to?: Date | string;
}

export const NormaliseDateRange = (type: DateRangeType, referenceDate: Date = new Date(), payment_date: PaymentDateRange = {}): PaymentDateRange => {
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth(); // 0-indexed

  let fromDate: Date;
  let toDate: Date;

  switch (type) {
    case "month":
      fromDate = new Date(year, month, 1);
      toDate = new Date(year, month + 1, 0); // last day of the month
      break;

    case "quarter": {
      const quarterStartMonth = Math.floor(month / 3) * 3;
      fromDate = new Date(year, quarterStartMonth, 1);
      toDate = new Date(year, quarterStartMonth + 3, 0); // last day of quarter
      break;
    }

    case "year":
      fromDate = new Date(year, 0, 1);
      toDate = new Date(year, 11, 31);
      break;

    default:
      throw new Error(`Unsupported type: ${type}`);
  }

  return {
    from: payment_date.from ? new Date(payment_date.from) : fromDate,
    to: payment_date.to ? new Date(payment_date.to) : toDate,
  };
};

export type TotalRow = { currency: string; total_value: number };

export const rebasePartnershipTotalsToCurrency = ({
  totals,
  rates,
  desiredCurrencyBase = "gbp",
}: {
  totals: TotalRow[];
  rates: Record<string, number> | undefined;
  desiredCurrencyBase: string;
}) => {
  if (!rates) {
    throw new Error("Rates are undefined");
  }

  const desiredRate = rates[desiredCurrencyBase || "gbp"];

  let sumInGPBCurrency = 0;

  const missing: string[] = [];

  for (const row of totals) {
    const from = row.currency?.toLowerCase();
    const rateFrom = rates[from];

    const amount = row.total_value;

    if (!Number.isFinite(amount)) continue;

    if (!rateFrom || rateFrom <= 0) {
      missing.push(from);
      continue;
    }

    // convert "from" -> ratesBaseCurrency
    sumInGPBCurrency += amount / rateFrom;
  }

  // convert ratesBaseCurrency -> desiredCurrencyBase
  const rebasedTotal = sumInGPBCurrency * desiredRate;

  return {
    desiredCurrencyBase,
    total: rebasedTotal,
    sumInGPBCurrency: sumInGPBCurrency,
    missingCurrencies: Array.from(new Set(missing)), // optional diagnostics so you can show warnings in UI
  };
};

export type RemissionTotalsRow = {
  currency: string;
  total_value: number | string;
  online_value: number | string;
  offline_value?: number | string;
  total_count?: number;
  online_count?: number;
};

export const defaultRemissionTotal = {
  currency: "GBP",
  total_value: 0,
  online_value: 0,
  offline_value: 0,
  total_count: 0,
  online_count: 0,
  missingCurrencies: [] as string[],
};

const toNumber = (v: unknown): number => {
  if (v === null || v === undefined) return 0;
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
};

export const rebaseRemissionTotalsToCurrency = ({
  totals,
  rates,
  desiredCurrencyBase = "gbp",
}: {
  totals: RemissionTotalsRow[];
  rates: Record<string, number> | undefined;
  desiredCurrencyBase?: string;
}) => {
  if (!rates) {
    throw new Error("Rates are undefined");
  }

  const desiredKey = desiredCurrencyBase.toLowerCase();
  const desiredRate = rates[desiredKey];

  if (!desiredRate || desiredRate <= 0) {
    throw new Error(`Missing or invalid rate for ${desiredCurrencyBase}`);
  }

  // ---- monetary accumulators (in rates base currency, eg GBP)
  let sumTotalBase = 0;
  let sumOnlineBase = 0;
  let sumOfflineBase = 0;

  // ---- count accumulators (no currency logic)
  let totalCount = 0;
  let onlineCount = 0;

  const missing: string[] = [];

  for (const row of totals) {
    const from = row.currency?.toLowerCase();
    if (!from) continue;

    const rateFrom = rates[from];
    if (!rateFrom || rateFrom <= 0) {
      missing.push(from);
      continue;
    }

    const total = toNumber(row.total_value);
    const online = toNumber(row.online_value);
    const offline = row.offline_value !== undefined ? toNumber(row.offline_value) : total - online;

    // ---- monetary conversion: from -> base
    if (Number.isFinite(total)) sumTotalBase += total / rateFrom;
    if (Number.isFinite(online)) sumOnlineBase += online / rateFrom;
    if (Number.isFinite(offline)) sumOfflineBase += offline / rateFrom;

    // ---- counts (simple sum)
    totalCount += row.total_count ?? 0;
    onlineCount += row.online_count ?? 0;
  }

  // ---- base -> desired currency
  return {
    currency: desiredKey,

    total_value: sumTotalBase * desiredRate,
    online_value: sumOnlineBase * desiredRate,
    offline_value: sumOfflineBase * desiredRate,

    total_count: totalCount,
    online_count: onlineCount,

    missingCurrencies: Array.from(new Set(missing)),
  };
};

export const getMonthYearOptionsSinceDec2025 = (): string[] => {
  const result: string[] = [];

  const startYear = 2025;
  const startMonthIndex = 11; // December (0-based)

  const now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth();

  while (year > startYear || (year === startYear && month >= startMonthIndex)) {
    const label = new Date(year, month).toLocaleString("en-GB", {
      month: "long",
      year: "numeric",
    });

    result.push(label);

    month -= 1;
    if (month < 0) {
      month = 11;
      year -= 1;
    }
  }

  return result;
};
