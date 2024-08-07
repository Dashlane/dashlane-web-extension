import { parse as dateParser, isValid } from "date-fns";
import { canonizeMonth, formatDate } from "./helpers";
import { DateFormat, DateSeparator, ParsedDate } from "./types";
import { MONTH_LABELS_MAP } from "./month-labels";
export const formatBirthdateForDataCapture = (
  birthDateParsed: ParsedDate
): string => {
  if (
    birthDateParsed.day &&
    birthDateParsed.month &&
    birthDateParsed.year?.length === 4
  ) {
    const date = { ...birthDateParsed };
    if (canonizeMonth(birthDateParsed.month) in MONTH_LABELS_MAP) {
      date.month = MONTH_LABELS_MAP[canonizeMonth(birthDateParsed.month)];
    }
    const formattedMonth = birthDateParsed.month.padStart(2, "0");
    const formattedDay = birthDateParsed.day.padStart(2, "0");
    const formattedDate = `${birthDateParsed.year}-${formattedMonth}-${formattedDay}`;
    if (isValid(dateParser(formattedDate, "yyyy-MM-dd", new Date()))) {
      return formattedDate;
    }
  }
  return "";
};
