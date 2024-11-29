import { DateRange, Period } from "./date-ranges.type";
const DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;
const getDateRangeFromTodayUnix = (sinceNumberOfDays: number): DateRange => {
  const now = Date.now();
  const startDate = now - sinceNumberOfDays * DAY_IN_MILLISECONDS;
  return {
    startDate: Math.floor(startDate / 1000),
    endDate: Math.ceil(now / 1000),
  };
};
const getDateRangeForYearToDate = (): DateRange => {
  const currentDate = new Date();
  const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
  const daysSinceStartOfYear = Math.floor(
    (currentDate.getTime() - startOfYear.getTime()) / DAY_IN_MILLISECONDS
  );
  return getDateRangeFromTodayUnix(daysSinceStartOfYear);
};
export const getDateRangeForPeriod = (period: Period) => {
  switch (period) {
    case Period.LAST_DAY:
      return getDateRangeFromTodayUnix(1);
    case Period.LAST_WEEK:
      return getDateRangeFromTodayUnix(7);
    case Period.LAST_MONTH:
      return getDateRangeFromTodayUnix(30);
    case Period.LAST_3_MONTHS:
      return getDateRangeFromTodayUnix(3 * 30);
    case Period.LAST_6_MONTHS:
      return getDateRangeFromTodayUnix(6 * 30);
    case Period.LAST_YEAR:
      return getDateRangeFromTodayUnix(12 * 30);
    case Period.YEAR_TO_DATE:
      return getDateRangeForYearToDate();
  }
};
