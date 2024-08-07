import { PassportAutofillView } from "@dashlane/autofill-contracts";
import { isDefaultDate } from "../Dates/helpers";
export const formatPassportDate = (
  item: PassportAutofillView,
  propertyName: keyof Pick<
    PassportAutofillView,
    | "expirationDay"
    | "expirationMonth"
    | "expirationYear"
    | "issueDay"
    | "issueMonth"
    | "issueYear"
  >
) => {
  if (
    propertyName.includes("expiration")
      ? isDefaultDate(
          item.expirationDay,
          item.expirationMonth,
          item.expirationYear
        )
      : isDefaultDate(item.issueDay, item.issueMonth, item.issueYear)
  ) {
    return "";
  }
  return item[propertyName].toString();
};
