import { differenceInCalendarDays, fromUnixTime } from "date-fns";
import { Icon, jsx } from "@dashlane/design-system";
import { Button, ClickOrigin, UserClickEvent } from "@dashlane/hermes";
import {
  DASHLANE_B2B_DIRECT_BUY,
  openExternalUrl,
} from "../../../../libs/externalUrls";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { LocaleFormat } from "../../../../libs/i18n/helpers";
import { logEvent } from "../../../../libs/logs/logEvent";
import { MoreToolsListItemClickable } from "../more-tools-list-item/more-tools-list-item-clickable";
import { useTrialInfo } from "./use-trial-info-hook";
const I18N_KEYS = {
  TITLE_BUSINESS: "more_tools/business_trial_title",
  TITLE_TEAM: "more_tools/team_trial_title",
  TRIAL_DAYS_LEFT_EXPLANATION_BUSINESS: "more_tools/trial_end_date_business",
  TRIAL_DAYS_LEFT_EXPLANATION_TEAM: "more_tools/trial_end_date_team_plan",
};
export const BANNER_UTM_SOURCE_PARAM =
  "button:buy_dashlane+click_origin:more_tab_extension+origin_page:settings/more+origin_component:extension_popup";
export const TrialWarningItem = () => {
  const { shortDate, translate } = useTranslate();
  const trialInfo = useTrialInfo();
  if (!trialInfo) {
    return null;
  }
  const {
    subscriptionCode,
    billingInfo,
    trialStatus,
    isTeam,
    isBusiness,
    isTeamSoftDiscontinued,
  } = trialInfo;
  if (!trialStatus?.isFreeTrial) {
    return null;
  }
  if (!isTeam && !isBusiness) {
    return null;
  }
  if (!billingInfo || !trialStatus) {
    return null;
  }
  const shouldShowTrialDaysLeftBanner =
    trialStatus.isFreeTrial &&
    !trialStatus.isGracePeriod &&
    !isTeamSoftDiscontinued;
  if (!shouldShowTrialDaysLeftBanner) {
    return null;
  }
  const formattedEndDate = shortDate(
    fromUnixTime(billingInfo.nextBillingDetails.dateUnix),
    LocaleFormat.LL
  );
  const subCodeAndUTMQueries = `&subCode=${
    subscriptionCode ?? ""
  }&utm_source=${BANNER_UTM_SOURCE_PARAM}`;
  const buyDashlaneLink = isBusiness
    ? `${DASHLANE_B2B_DIRECT_BUY}?plan=business${subCodeAndUTMQueries}`
    : `${DASHLANE_B2B_DIRECT_BUY}?plan=team${subCodeAndUTMQueries}`;
  const lastDayOfTrialUnix = billingInfo.nextBillingDetails.dateUnix;
  const daysLeftInTrial = lastDayOfTrialUnix
    ? differenceInCalendarDays(fromUnixTime(lastDayOfTrialUnix), new Date())
    : undefined;
  const handleBuyDashlane = () => {
    void logEvent(
      new UserClickEvent({
        button: Button.BuyDashlane,
        clickOrigin: ClickOrigin.MoreTabExtension,
      })
    );
    void openExternalUrl(buyDashlaneLink);
  };
  return (
    <MoreToolsListItemClickable
      icon={<Icon name="PremiumOutlined" color="ds.text.neutral.catchy" />}
      onClick={handleBuyDashlane}
      title={
        isBusiness
          ? translate(I18N_KEYS.TITLE_BUSINESS)
          : translate(I18N_KEYS.TITLE_TEAM)
      }
      isWarning={daysLeftInTrial ? daysLeftInTrial <= 7 : false}
      explanation={
        isBusiness
          ? translate(I18N_KEYS.TRIAL_DAYS_LEFT_EXPLANATION_BUSINESS, {
              endDate: formattedEndDate,
            })
          : translate(I18N_KEYS.TRIAL_DAYS_LEFT_EXPLANATION_TEAM, {
              endDate: formattedEndDate,
            })
      }
    />
  );
};
