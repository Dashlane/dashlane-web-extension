import { fromUnixTime } from "date-fns";
import { ButtonMood, IconName } from "@dashlane/design-system";
import {
  GetTeamTrialStatusResult,
  NextBillingDetails,
} from "@dashlane/team-admin-contracts";
import { TranslatorInterface } from "../../../../libs/i18n/types";
import { LOCALE_FORMAT } from "../../../../libs/i18n/helpers";
import { getRemainingPlanDuration, SubscriptionPhases } from "../helpers";
const I18N_KEYS = {
  ACTIVE_BADGE: "account_summary_active_badge",
  EXPIRED_BADGE: "account_summary_expired_badge",
  TRIAL_BADGE: "account_summary_trial_badge",
  TRIAL_EXTENDED_BADGE: "account_summary_trial_extended_badge",
  TRIAL_ENDED_BADGE: "account_summary_trial_ended_badge",
  DAYS_LEFT: "account_summary_days_left",
  MONTHS_LEFT: "account_summary_months_left",
  YEARS_LEFT: "account_summary_years_left",
  DAYS_AGO: "account_summary_days_ago",
  ENDS_ON_HEADER: "account_summary_ends_on_header",
  ENDED_ON_HEADER: "account_summary_ended_on_header",
  RENEWS_ON_HEADER: "account_summary_renews_on_header",
  ACTIVE_CC_EXPIRED_TITLE: "account_summary_active_cc_expired_title",
  ACTIVE_CC_EXPIRED_DESCRIPTION:
    "account_summary_active_cc_expired_description",
  DISCONTINUED_CC_EXPIRED_TITLE:
    "account_summary_discontinued_cc_expired_title",
  DISCONTINUED_CC_EXPIRED_DESCRIPTION:
    "account_summary_discontinued_cc_expired_description",
};
interface HeaderElements {
  badgeLabel: string;
  badgeMood: ButtonMood;
  supportingDescription: string;
  dateHeader: string;
  withCtaButton?: boolean;
  alertInfobox?: {
    mood: ButtonMood;
    icon: IconName;
    title: string;
    description: string;
  };
}
export const getHeaderElements = (
  translate: TranslatorInterface,
  subscriptionPhase: SubscriptionPhases,
  nextBillingDetails: NextBillingDetails,
  trialStatus: GetTeamTrialStatusResult
): HeaderElements => {
  const renewalOrEndDate = fromUnixTime(nextBillingDetails.dateUnix);
  const {
    months = 0,
    days = 0,
    years = 0,
  } = getRemainingPlanDuration(renewalOrEndDate);
  const daysLeftInTrial = trialStatus.daysLeftInTrial;
  const displayDaysMonthsYearsLeft = `
  ${years > 0 ? translate(I18N_KEYS.YEARS_LEFT, { count: years }) : ""}
  ${translate(I18N_KEYS.MONTHS_LEFT, {
    count: months,
  })} ${translate(I18N_KEYS.DAYS_LEFT, {
    count: days,
  })}`;
  switch (subscriptionPhase) {
    case "ACTIVE":
      return {
        badgeLabel: translate(I18N_KEYS.ACTIVE_BADGE),
        badgeMood: "positive",
        supportingDescription: displayDaysMonthsYearsLeft,
        dateHeader: translate(I18N_KEYS.RENEWS_ON_HEADER, {
          date: translate.shortDate(renewalOrEndDate, LOCALE_FORMAT.ll),
        }),
      };
    case "ACTIVE CANCELED":
      return {
        badgeLabel: translate(I18N_KEYS.ACTIVE_BADGE),
        badgeMood: "positive",
        supportingDescription: `${translate(I18N_KEYS.MONTHS_LEFT, {
          count: months,
        })} ${translate(I18N_KEYS.DAYS_LEFT, {
          count: days,
        })}`,
        dateHeader: translate(I18N_KEYS.ENDS_ON_HEADER, {
          date: translate.shortDate(renewalOrEndDate, LOCALE_FORMAT.ll),
        }),
      };
    case "ACTIVE CARD EXPIRED":
      return {
        badgeLabel: translate(I18N_KEYS.ACTIVE_BADGE),
        badgeMood: "positive",
        supportingDescription: `${translate(I18N_KEYS.MONTHS_LEFT, {
          count: months,
        })} ${translate(I18N_KEYS.DAYS_LEFT, {
          count: days,
        })}`,
        dateHeader: translate(I18N_KEYS.RENEWS_ON_HEADER, {
          date: translate.shortDate(renewalOrEndDate, LOCALE_FORMAT.ll),
        }),
        alertInfobox: {
          title: translate(I18N_KEYS.ACTIVE_CC_EXPIRED_TITLE, {
            date: translate.shortDate(renewalOrEndDate, LOCALE_FORMAT.LL),
          }),
          description: translate(I18N_KEYS.ACTIVE_CC_EXPIRED_DESCRIPTION),
          icon: "FeedbackWarningOutlined",
          mood: "warning",
        },
      };
    case "DISCONTINUED CANCELED":
      return {
        badgeLabel: translate(I18N_KEYS.EXPIRED_BADGE),
        badgeMood: "danger",
        supportingDescription: translate(I18N_KEYS.DAYS_AGO, {
          count: Math.abs(daysLeftInTrial),
        }),
        dateHeader: translate(I18N_KEYS.ENDED_ON_HEADER, {
          date: translate.shortDate(renewalOrEndDate, LOCALE_FORMAT.ll),
        }),
      };
    case "DISCONTINUED CARD EXPIRED":
      return {
        badgeLabel: translate(I18N_KEYS.EXPIRED_BADGE),
        badgeMood: "danger",
        supportingDescription: translate(I18N_KEYS.DAYS_AGO, {
          count: Math.abs(daysLeftInTrial),
        }),
        dateHeader: translate(I18N_KEYS.ENDED_ON_HEADER, {
          date: translate.shortDate(renewalOrEndDate, LOCALE_FORMAT.ll),
        }),
        alertInfobox: {
          title: translate(I18N_KEYS.DISCONTINUED_CC_EXPIRED_TITLE),
          description: translate(I18N_KEYS.DISCONTINUED_CC_EXPIRED_DESCRIPTION),
          icon: "FeedbackFailOutlined",
          mood: "danger",
        },
      };
    case "DISCONTINUED TRIAL":
      return {
        badgeLabel: translate(I18N_KEYS.TRIAL_ENDED_BADGE),
        badgeMood: "danger",
        supportingDescription: translate(I18N_KEYS.DAYS_AGO, {
          count: Math.abs(daysLeftInTrial),
        }),
        dateHeader: translate(I18N_KEYS.ENDED_ON_HEADER, {
          date: translate.shortDate(renewalOrEndDate, LOCALE_FORMAT.ll),
        }),
        withCtaButton: true,
      };
    case "GRACE PERIOD":
      return {
        badgeLabel: translate(I18N_KEYS.TRIAL_EXTENDED_BADGE),
        badgeMood: "warning",
        supportingDescription: translate(I18N_KEYS.DAYS_LEFT, {
          count: daysLeftInTrial,
        }),
        dateHeader: translate(I18N_KEYS.ENDS_ON_HEADER, {
          date: translate.shortDate(renewalOrEndDate, LOCALE_FORMAT.ll),
        }),
        withCtaButton: true,
      };
    case "TRIAL":
      return {
        badgeLabel: translate(I18N_KEYS.TRIAL_BADGE),
        badgeMood: "brand",
        supportingDescription: translate(I18N_KEYS.DAYS_LEFT, {
          count: daysLeftInTrial,
        }),
        dateHeader: translate(I18N_KEYS.ENDS_ON_HEADER, {
          date: translate.shortDate(renewalOrEndDate, LOCALE_FORMAT.ll),
        }),
        withCtaButton: true,
      };
  }
};
