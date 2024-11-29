export enum Period {
  LAST_DAY = "last_day",
  LAST_WEEK = "last_week",
  LAST_MONTH = "last_month",
  LAST_3_MONTHS = "last_3_months",
  LAST_6_MONTHS = "last_6_months",
  LAST_YEAR = "last_year",
  YEAR_TO_DATE = "year_to_date",
}
export type DateRange = {
  startDate: number;
  endDate: number;
};
