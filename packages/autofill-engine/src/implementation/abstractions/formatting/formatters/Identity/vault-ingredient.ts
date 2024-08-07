import { IdentityAutofillView } from "@dashlane/autofill-contracts";
import { FieldFormat } from "../../../../../types";
import {
  findDayInSelectOptions,
  findMonthInSelectOptions,
  formatDate,
  getDateFormat,
  getDateSeparator,
  parseDateFromVault,
} from "../Dates/helpers";
import { DateFormat, DateSeparator, ParsedDate } from "../Dates/types";
export function formatFullName(identity: IdentityAutofillView): string {
  let middleOrLastName = "";
  let fullName = "";
  if (identity.middleName) {
    middleOrLastName = `${identity.middleName} ${identity.lastName}`;
  } else if (identity.lastName2) {
    middleOrLastName = `${identity.lastName} ${identity.lastName2}`;
  } else {
    middleOrLastName = `${identity.lastName}`;
  }
  fullName = `${identity.firstName} ${middleOrLastName}`;
  return fullName;
}
export function formatMiddleInitial(identity: IdentityAutofillView): string {
  const formattedMiddleName = identity.middleName
    .split(" ")
    .map((name: string) => name.charAt(0))
    .join(". ");
  return `${formattedMiddleName}.`;
}
export const getParsedIdentityBirthDate = (
  identity: IdentityAutofillView
): ParsedDate | undefined => {
  const date = parseDateFromVault(identity.birthDate);
  if (!date) {
    return undefined;
  }
  return {
    day: date.getDate().toString().padStart(2, "0"),
    month: (date.getMonth() + 1).toString().padStart(2, "0"),
    year: date.getFullYear().toString().padStart(4, "0"),
  };
};
const formatBirthDate = (
  identity: IdentityAutofillView,
  fieldFormat?: FieldFormat
): string => {
  const parsedDate = getParsedIdentityBirthDate(identity);
  if (!parsedDate) {
    return "";
  }
  return formatDate(
    getDateFormat(fieldFormat?.dateFormat, DateFormat.FORMAT_MM_DD_YYYY),
    getDateSeparator(fieldFormat?.dateSeparator, DateSeparator.SEPARATOR_SLASH),
    parsedDate
  );
};
export const formatBirthDay = (
  identity: IdentityAutofillView,
  fieldFormat?: FieldFormat
): string => {
  const day = formatBirthDate(identity, {
    dateFormat: DateFormat.FORMAT_DD,
    dateSeparator: DateSeparator.SEPARATOR_NOTHING,
  });
  if (fieldFormat?.optionLabels && fieldFormat.optionValues) {
    return findDayInSelectOptions(
      day,
      fieldFormat.optionLabels,
      fieldFormat.optionValues
    );
  }
  return day;
};
export const formatBirthMonth = (
  identity: IdentityAutofillView,
  fieldFormat?: FieldFormat
): string => {
  const month = formatBirthDate(identity, {
    dateFormat: DateFormat.FORMAT_MM,
    dateSeparator: DateSeparator.SEPARATOR_NOTHING,
  });
  if (fieldFormat?.optionLabels && fieldFormat.optionValues) {
    return findMonthInSelectOptions(
      month,
      fieldFormat.optionLabels,
      fieldFormat.optionValues
    );
  }
  return month;
};
