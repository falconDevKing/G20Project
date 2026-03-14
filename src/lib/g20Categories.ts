import type { SelectOptions } from "@/interfaces/register";
import { findChapterDetails } from "@/services/payment";

export const G20_CATEGORIES_BY_CURRENCY = {
  NGN: [
    { rank: "Bronze", amount: "₦1,000,000 - ₦2,000,000" },
    { rank: "Silver", amount: "₦2,000,000 - ₦5,000,000" },
    { rank: "Gold", amount: "₦5,000,000 - ₦10,000,000" },
    { rank: "Diamond", amount: "₦10,000,000 - ₦25,000,000" },
    { rank: "Platinum", amount: "Above ₦25,000,000" },
  ],
  GBP: [
    { rank: "Bronze", amount: "£700 - £1,500" },
    { rank: "Silver", amount: "£1,500 - £3,000" },
    { rank: "Gold", amount: "£3,000 - £6,000" },
    { rank: "Diamond", amount: "£6,000 - £15,000" },
    { rank: "Platinum", amount: "Above £15,000" },
  ],
  USD: [
    { rank: "Bronze", amount: "$1000 - $2,000" },
    { rank: "Silver", amount: "$2,000 - $4,000" },
    { rank: "Gold", amount: "$4,000 - $10,000" },
    { rank: "Diamond", amount: "$10,000 - $20,000" },
    { rank: "Platinum", amount: "Above $20,000" },
  ],
  CAD: [
    { rank: "Bronze", amount: "CA$1,000 - CA$2,000" },
    { rank: "Silver", amount: "CA$2,000 - CA$5,000" },
    { rank: "Gold", amount: "CA$5,000 - CA$10,000" },
    { rank: "Diamond", amount: "CA$10,000 - CA$25,000" },
    { rank: "Platinum", amount: "Above CA$25,000" },
  ],
  GHS: [
    { rank: "Bronze", amount: "GH₵10,000 - GH₵20,000" },
    { rank: "Silver", amount: "GH₵20,000 - GH₵40,000" },
    { rank: "Gold", amount: "GH₵40,000 - GH₵80,000" },
    { rank: "Diamond", amount: "GH₵80,000 - GH₵200,000" },
    { rank: "Platinum", amount: "Above GH₵200,000" },
  ],
  ZAR: [
    { rank: "Bronze", amount: "R15,000 - R25,000" },
    { rank: "Silver", amount: "R25,000 - R65,000" },
    { rank: "Gold", amount: "R65,000 - R150,000" },
    { rank: "Diamond", amount: "R150,000 - R320,000" },
    { rank: "Platinum", amount: "Above R320,000" },
  ],
  EUR: [
    { rank: "Bronze", amount: "€700 - €1,500" },
    { rank: "Silver", amount: "€1,500 - €3,500" },
    { rank: "Gold", amount: "€3,500 - €6,500" },
    { rank: "Diamond", amount: "€6,500 - €16,000" },
    { rank: "Platinum", amount: "Above €16,000" },
  ],
  MXN: [
    { rank: "Bronze", amount: "MX$15,000 - MX$30,000" },
    { rank: "Silver", amount: "MX$30,000 - MX$65,000" },
    { rank: "Gold", amount: "MX$65,000 - MX$130,000" },
    { rank: "Diamond", amount: "MX$130,000 - MX$325,000" },
    { rank: "Platinum", amount: "Above MX$325,000" },
  ],
  PHP: [
    { rank: "Bronze", amount: "₱50,000 - ₱100,000" },
    { rank: "Silver", amount: "₱100,000 - ₱250,000" },
    { rank: "Gold", amount: "₱250,000 - ₱450,000" },
    { rank: "Diamond", amount: "₱450,000 - ₱1,000,000" },
    { rank: "Platinum", amount: "Above ₱1,000,000" },
  ],
  AED: [
    { rank: "Bronze", amount: "AED 2,700 - AED 5,500" },
    { rank: "Silver", amount: "AED 5,500 - AED 15,000" },
    { rank: "Gold", amount: "AED 15,000 - AED 30,000" },
    { rank: "Diamond", amount: "AED 30,000 - AED 70,000" },
    { rank: "Platinum", amount: "Above AED 70,000" },
  ],
  USDAF: [
    { rank: "Bronze", amount: "$750 - $1,500" },
    { rank: "Silver", amount: "$1,500 - $3,600" },
    { rank: "Gold", amount: "$3,600 - $7,200" },
    { rank: "Diamond", amount: "$7,200 - $18,000" },
    { rank: "Platinum", amount: "Above $18,000" },
  ],
} as const;

export type G20CurrencyCode = keyof typeof G20_CATEGORIES_BY_CURRENCY;
export type G20CategoryEntry = (typeof G20_CATEGORIES_BY_CURRENCY)[G20CurrencyCode][number];
export type G20CategoryRank = G20CategoryEntry["rank"];

const DEFAULT_G20_CURRENCY: G20CurrencyCode = "USD";

type ResolveG20CurrencyArgs = {
  chapterId?: string | null;
  locationCurrency?: string | null;
  fallbackCurrency?: string | null;
};

const isSupportedCurrency = (currency?: string | null): currency is G20CurrencyCode => !!currency && currency in G20_CATEGORIES_BY_CURRENCY;

export const resolveG20Currency = ({ chapterId, locationCurrency, fallbackCurrency }: ResolveG20CurrencyArgs = {}): G20CurrencyCode => {
  const chapterCurrency = chapterId ? findChapterDetails(chapterId).currency : "";

  if (isSupportedCurrency(chapterCurrency)) return chapterCurrency;
  if (isSupportedCurrency(locationCurrency)) return locationCurrency;
  if (isSupportedCurrency(fallbackCurrency)) return fallbackCurrency;

  return DEFAULT_G20_CURRENCY;
};

export const getResolvedG20Categories = (args: ResolveG20CurrencyArgs = {}): readonly G20CategoryEntry[] => {
  const currency = resolveG20Currency(args);
  return G20_CATEGORIES_BY_CURRENCY[currency];
};

export const getG20CategoryOptions = (args: ResolveG20CurrencyArgs = {}): SelectOptions[] => {
  return getResolvedG20Categories(args).map((category) => ({
    value: category.rank,
    name: `${category.rank} - ${category.amount}`,
  }));
};

export const getG20CategoryLabel = (rank?: string | null, args: ResolveG20CurrencyArgs = {}): string => {
  if (!rank) return "";

  const entry = getResolvedG20Categories(args).find((category) => category.rank === rank);
  return entry ? `${entry.rank} - ${entry.amount}` : rank;
};

export const getG20CategoryAmount = (rank?: string | null, args: ResolveG20CurrencyArgs = {}): string => {
  if (!rank) return "";

  return getResolvedG20Categories(args).find((category) => category.rank === rank)?.amount || "";
};

export const getBronzeCategory = (args: ResolveG20CurrencyArgs = {}): G20CategoryEntry => {
  return getResolvedG20Categories(args).find((category) => category.rank === "Bronze") || getResolvedG20Categories(args)[0];
};

export const getBronzeMinimumValue = (args: ResolveG20CurrencyArgs = {}): string => {
  const bronzeAmount = getBronzeCategory(args)?.amount || "";
  const [minimumValue] = bronzeAmount.split(" - ");
  return minimumValue || bronzeAmount;
};
