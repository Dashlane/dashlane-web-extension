import { assertUnreachable } from "../../../libs/assert-unreachable";
import { TranslatorInterface } from "../../../libs/i18n/types";
import { LocaleFormat } from "../../../libs/i18n/helpers";
export enum DatePrecision {
  DAY,
  MONTH,
  YEAR,
  INVALID,
}
export type DateLength = "short" | "long";
const getDatePrecision = (date: string) => {
  switch (date.length) {
    case 4:
      return DatePrecision.YEAR;
    case 7:
      return DatePrecision.MONTH;
    case 10:
      return DatePrecision.DAY;
    default:
      return DatePrecision.INVALID;
  }
};
const getDisplayFormat = (
  precision: DatePrecision,
  length: DateLength
): LocaleFormat | undefined => {
  switch (precision) {
    case DatePrecision.DAY:
      return length === "short" ? LocaleFormat.ll : LocaleFormat.LL;
    case DatePrecision.MONTH:
      return length === "short"
        ? LocaleFormat.MMM_YYYY
        : LocaleFormat.MMMM_YYYY;
    case DatePrecision.YEAR:
      return LocaleFormat.YYYY;
    case DatePrecision.INVALID:
      return undefined;
    default:
      return assertUnreachable(precision);
  }
};
export type BreachDate = {
  date: string;
  precision: DatePrecision;
};
export const getBreachDate = (
  eventDate: string,
  dateLength: DateLength,
  translate: TranslatorInterface
): BreachDate => {
  const precision = getDatePrecision(eventDate);
  if (precision === DatePrecision.INVALID) {
    return {
      date: "",
      precision: DatePrecision.INVALID,
    };
  }
  const shortDate = translate.shortDate(
    new Date(eventDate),
    getDisplayFormat(precision, dateLength)
  );
  return {
    date: shortDate,
    precision,
  };
};
