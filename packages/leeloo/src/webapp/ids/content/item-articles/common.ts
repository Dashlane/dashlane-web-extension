import dateFormatter from "date-fns/format";
import differenceInDays from "date-fns/differenceInDays";
import differenceInMonths from "date-fns/differenceInMonths";
import { TranslatorInterface } from "../../../../libs/i18n/types";
export enum Criticality {
  EXPIRED = "expired",
  DAYSLEFT = "daysleft",
  MONTHSLEFT = "monthsleft",
}
const getCriticalityStatus = (daysDiff: number, monthsDiff: number) => {
  if (daysDiff < 0) {
    return Criticality.EXPIRED;
  }
  if (monthsDiff === 0) {
    return Criticality.DAYSLEFT;
  }
  if (monthsDiff < 6) {
    return Criticality.MONTHSLEFT;
  }
  return undefined;
};
const getAdditionnalDescription = (
  criticalityStatus: Criticality,
  monthsDiff: number,
  I18N_KEYS: Record<string, string>,
  translate: TranslatorInterface
) => {
  if (criticalityStatus === Criticality.EXPIRED) {
    return translate(I18N_KEYS.EXPIRED);
  }
  if (criticalityStatus === Criticality.DAYSLEFT) {
    return translate(I18N_KEYS.EXPIRES_DAYS);
  }
  if (criticalityStatus === Criticality.MONTHSLEFT) {
    return translate(I18N_KEYS.EXPIRES_MONTHS, {
      months: (monthsDiff + 1).toString(),
    });
  }
  return undefined;
};
export const getDescriptions = (
  expirationDateString: string,
  I18N_KEYS: Record<string, string>,
  isExpiredLabelforIDEnabled: boolean,
  translate: TranslatorInterface
): [string?, Criticality?] => {
  if (!expirationDateString) {
    return [undefined, undefined];
  }
  const expirationDate = new Date(expirationDateString);
  const daysDiff = differenceInDays(expirationDate, new Date());
  const monthsDiff = differenceInMonths(expirationDate, new Date());
  const criticalityStatus = isExpiredLabelforIDEnabled
    ? getCriticalityStatus(daysDiff, monthsDiff)
    : undefined;
  const additionalDescription = criticalityStatus
    ? getAdditionnalDescription(
        criticalityStatus,
        monthsDiff,
        I18N_KEYS,
        translate
      )
    : translate(I18N_KEYS.EXPIRES, {
        date: dateFormatter(expirationDate, "MM/yy"),
      });
  return [additionalDescription, criticalityStatus];
};
