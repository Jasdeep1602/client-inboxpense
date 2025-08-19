// Type for the /monthly endpoint response
export type MonthlySummaryData = {
  month: string;
  totalCredit: number;
  totalDebit: number;
};

// Type for the /spending-by-category endpoint response
export type CategorySpendingData = {
  name: string;
  value: number;
  color: string;
};
