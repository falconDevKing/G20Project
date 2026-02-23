import axios from "axios";

type ExchangeData = {
  rates?: Record<string, number>;
  gbp?: Record<string, number>;
  data?: Record<string, number>;
};

export const FetchGBPExchangeRates = async () => {
  const endpoints = [
    {
      name: "Fawaz (Minified)",
      url: "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/gbp.min.json",
      extract: (data: ExchangeData) => data?.gbp,
    },
    {
      name: "LatestCurrency (Minified)",
      url: "https://latest.currency-api.pages.dev/v1/currencies/gbp.min.json",
      extract: (data: ExchangeData) => data?.gbp,
    },
    {
      name: "Fawaz (Full)",
      url: "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/gbp.json",
      extract: (data: ExchangeData) => data?.gbp,
    },
    {
      name: "LatestCurrency (Full)",
      url: "https://latest.currency-api.pages.dev/v1/currencies/gbp.json",
      extract: (data: ExchangeData) => data?.gbp,
    },
    {
      name: "FreeCurrencyAPI",
      url: "https://api.freecurrencyapi.com/v1/latest?apikey=YOUR_API_KEY&base_currency=GBP", // Replace with your key
      extract: (data: ExchangeData) => data?.data,
    },
    {
      name: "OpenExchangeRates",
      url: `https://openexchangerates.org/api/latest.json?app_id=YOUR_APP_ID`, // Replace with actual app_id
      extract: (data: ExchangeData) => data?.rates,
    },
  ];

  for (const { name, url, extract } of endpoints) {
    try {
      const res = await axios.get(url);
      const rates = extract(res.data);
      console.info(`✅ Success from: ${name}`);
      return rates;
      // return rates;
    } catch (err: any) {
      console.warn(`❌ Failed: ${name}`, err?.message);
    }
  }

  throw new Error("All currency sources failed.");
};

const FetchGBPExchangeRatesValue = async (currency: string) => {
  const rates = await FetchGBPExchangeRates();

  return rates?.[currency?.toLowerCase()] || rates?.[currency?.toUpperCase()] || 1;
};

export default FetchGBPExchangeRatesValue;
