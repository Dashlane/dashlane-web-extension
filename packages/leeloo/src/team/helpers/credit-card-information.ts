import { isPast } from "date-fns";
import { BillingInformation } from "@dashlane/communication";
export const isBillingMethodExpired = (
  billingInformation?: BillingInformation
) => {
  return billingInformation?.exp_year && billingInformation?.exp_month
    ? isPast(
        new Date(billingInformation.exp_year, billingInformation.exp_month, 0)
      )
    : false;
};
export const formatCardLast4Digits = (cardLast4Digits: number) => {
  return cardLast4Digits.toLocaleString("en-US", {
    minimumIntegerDigits: 4,
    useGrouping: false,
  });
};
