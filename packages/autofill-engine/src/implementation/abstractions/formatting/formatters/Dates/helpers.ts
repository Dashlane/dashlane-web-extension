import { parse as dateParser } from "date-fns";
import { DAY_LABELS_MAP } from "./day-labels";
import { DateFormat, DateSeparator, ParsedDate } from "./types";
import { MONTH_LABELS_MAP } from "./month-labels";
export const parseDateFromVault = (date: string): Date | null => {
  if (!date) {
    return null;
  }
  const birthDateParsed = dateParser(date, "yyyy-MM-dd", new Date());
  return birthDateParsed.toString() !== "Invalid Date"
    ? birthDateParsed
    : new Date(date);
};
export const getDateFormat = (
  dateFormat?: string,
  defaultDateFormat: DateFormat = DateFormat.FORMAT_DD_MM_YYYY
) => {
  return dateFormat && Object.keys(DateFormat).includes(dateFormat)
    ? DateFormat[dateFormat as keyof typeof DateFormat]
    : defaultDateFormat;
};
export const getDateSeparator = (
  dateSeparator?: string,
  defaultDateSeparator: DateSeparator = DateSeparator.SEPARATOR_SLASH
) => {
  return dateSeparator && Object.keys(DateSeparator).includes(dateSeparator)
    ? DateSeparator[dateSeparator as keyof typeof DateSeparator]
    : defaultDateSeparator;
};
export const formatDate = (
  dateFormat: DateFormat,
  dateSeparator: DateSeparator,
  date: ParsedDate = { day: "", month: "", year: "" }
): string => {
  if (!date.day && !date.month && !date.year) {
    return "";
  }
  const format = dateFormat.split("_").slice(1);
  const dateArray = format.map((datePart: string) => {
    switch (datePart) {
      case "DD":
        return date.day?.padStart(2, "0");
      case "MM":
        return date.month?.padStart(2, "0");
      case "YY":
        return date.year?.slice(2);
      case "YYYY":
        return date.year;
      default:
        return "";
    }
  });
  return dateArray.join(dateSeparator);
};
export const parseDate = (
  dateString: string,
  dateFormat?: DateFormat
): ParsedDate => {
  const parsedDate = { day: "", month: "", year: "" };
  if (!dateFormat) {
    return parsedDate;
  }
  const separatorRegex = new RegExp("[^A-Za-z0-9_]");
  const dateArray = dateString.split(separatorRegex);
  const format = dateFormat.split("_").slice(1);
  if (dateArray.length === format.length) {
    const dayIndex = format.indexOf("DD");
    const monthIndex = format.indexOf("MM");
    const yearIndex = format.findIndex((datePart) => datePart.includes("YY"));
    parsedDate.day = dayIndex > -1 ? dateArray[dayIndex] : "";
    parsedDate.month = monthIndex > -1 ? dateArray[monthIndex] : "";
    parsedDate.year = yearIndex > -1 ? dateArray[yearIndex] : "";
  }
  return parsedDate;
};
export const canonizeMonth = (month: string) =>
  month
    .toLowerCase()
    .replace(/é/g, "e")
    .replace(/û/g, "u")
    .replace(/ä/g, "a")
    .replace(/[&/\\#,+()$~%.'":*?<>{}!@]/g, "");
export const findMonthInSelectOptions = (
  month: string,
  optionLabels: string[],
  optionValues: string[]
): string => {
  const matchMonth = (value: string) =>
    value === month || MONTH_LABELS_MAP[canonizeMonth(value)] === month;
  const chosenOptionLabelIndex = optionLabels.findIndex(matchMonth);
  if (chosenOptionLabelIndex > -1) {
    return optionValues[chosenOptionLabelIndex];
  }
  const chosenOptionValue = optionValues.find(matchMonth);
  return chosenOptionValue ?? month;
};
export const findDayInSelectOptions = (
  day: string,
  optionLabels: string[],
  optionValues: string[]
): string => {
  const matchDay = (value: string) =>
    value === day || DAY_LABELS_MAP[value] === day;
  const chosenOptionLabelIndex = optionLabels.findIndex(matchDay);
  if (chosenOptionLabelIndex > -1) {
    return optionValues[chosenOptionLabelIndex];
  }
  const chosenOptionValue = optionValues.find(matchDay);
  return chosenOptionValue ?? day;
};
export const getFullYearFromShort = (shortYear: string): string => {
  const currentFullYear = new Date().getFullYear();
  const currentShortYear = currentFullYear.toString().slice(2);
  const currentCentury = currentFullYear.toString().slice(0, 2);
  let result = `${currentCentury}${shortYear}`;
  if (Number(shortYear) < Number(currentShortYear)) {
    result = `${Number(currentCentury) + 1}${shortYear}`;
  }
  return result;
};
const DEFAULT_DATE: {
  day: number;
  month: number;
  year: number;
} = {
  day: 1,
  month: 1,
  year: 1970,
};
export const isDefaultDate = (
  day: number | undefined,
  month: number | undefined,
  year: number | undefined
) => {
  return (
    !!day &&
    !!month &&
    !!year &&
    day === DEFAULT_DATE.day &&
    month === DEFAULT_DATE.month &&
    year === DEFAULT_DATE.year
  );
};
