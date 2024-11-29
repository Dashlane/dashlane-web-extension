export const SEVEN_DAYS_IN_MILLISECONDS = 7 * 24 * 60 * 60 * 1000;
const formatDateToUnix = (date: number): number => {
  const d = new Date(0);
  d.setUTCSeconds(date);
  return d.getTime();
};
export const currentDateisLessThanSevenDaysBefore = (
  endDate: number
): boolean => {
  const formatedDate = formatDateToUnix(endDate);
  if (endDate) {
    return formatedDate - Date.now() < SEVEN_DAYS_IN_MILLISECONDS;
  }
  return false;
};
