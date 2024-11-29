import { BillingPeriodicity } from "@dashlane/plans-contracts";
import { TranslateFunction } from "../../i18n/types";
const I18N_KEYS = {
  PER_YEAR_SUBTITLE: "webapp_frozen_state_per_year_subtitle",
  PER_MONTH_SUBTITLE: "webapp_frozen_state_per_month_subtitle",
  PER_YEAR_FOR_MEMBERS_SUBTITLE:
    "webapp_frozen_state_per_year_for_members_subtitle",
};
export const getPeriodicityLabelOfPlan = (
  period: BillingPeriodicity,
  isFamilyPlan: boolean,
  translate: TranslateFunction
): string | null => {
  if (period === "monthly") {
    return translate(I18N_KEYS.PER_MONTH_SUBTITLE);
  } else if (period === "yearly" && !isFamilyPlan) {
    return translate(I18N_KEYS.PER_YEAR_SUBTITLE);
  } else if (period === "yearly" && isFamilyPlan) {
    return translate(I18N_KEYS.PER_YEAR_FOR_MEMBERS_SUBTITLE);
  }
  return null;
};
