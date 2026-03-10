type PartnerMetricItem = {
  title: string;
  value: number;
  convertCurrency?: boolean;
  defaultQuery?: Record<string, any>;
  navTo?: string;
};

export type PartnerMetrics = {
  Nationality: PartnerMetricItem[];
  Status: PartnerMetricItem[];
  G20_Category: PartnerMetricItem[];
  Partner_Type: PartnerMetricItem[];
};

export type RemissionMetrics = {
  Payment_Inflow: PartnerMetricItem[];
  Annual_Payment_Overview: PartnerMetricItem[];
  Pending_Remissions: PartnerMetricItem[];
};

export type GetPartnerMetricsFilteredResponse = {
  get_partner_metrics_filtered: PartnerMetrics;
};
