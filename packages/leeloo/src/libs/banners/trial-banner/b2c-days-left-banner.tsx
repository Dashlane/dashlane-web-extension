import { DataStatus } from "@dashlane/carbon-api-consumers";
import { mergeSx } from "@dashlane/design-system";
import { GET_PREMIUM_URL } from "../../../app/routes/constants";
import {
  useIsFreeB2CUser,
  useNodePremiumStatus,
} from "../../carbon/hooks/useNodePremiumStatus";
import { useSubscriptionCode } from "../../hooks/use-subscription-code";
import useTranslate from "../../i18n/useTranslate";
import {
  getDaysExpiredAfterTrial,
  getDaysLeftInTrial,
} from "../../trial/helpers";
import { logBuyDashlaneClick } from "./logs";
import { SX_STYLES } from "./style";
const I18N_KEYS = {
  FREE_TRIAL_1_DAY_LEFT: "trial_banner_b2c_free_trial_1_day_left_markup",
  FREE_TRIAL_OTHER_DAYS_LEFT:
    "trial_banner_b2c_free_trial_other_days_left_markup",
  FREE_TRIAL_BUY_DASHLANE: "trial_banner_buy_dashlane",
  POST_TRIAL_1_DAY_EXPIRED: "b2c_post_trial_banner_1_day_expired",
  POST_TRIAL_OTHER_DAYS_EXPIRED: "b2c_post_trial_banner_other_days_expired",
  POST_TRIAL_BUY_DASHLANE: "b2c_post_trial_banner_buy_dashlane",
};
const MIN_DAYS_EXP = 1;
export const B2CTrialDaysLeftBanner = () => {
  const { translate } = useTranslate();
  const subscriptionCode = useSubscriptionCode();
  const buyDashlaneLink = `${GET_PREMIUM_URL}?subCode=${
    subscriptionCode ?? ""
  }`;
  const getNodePremiumStatus = useNodePremiumStatus();
  const useIsFreeB2C = useIsFreeB2CUser();
  const premiumStatus =
    getNodePremiumStatus.status === DataStatus.Success &&
    getNodePremiumStatus.data;
  if (!premiumStatus || useIsFreeB2C.isLoading) {
    return null;
  }
  const daysLeft = getDaysLeftInTrial(premiumStatus.endDateUnix ?? 0);
  const daysExpired = getDaysExpiredAfterTrial(
    premiumStatus.previousPlan?.endDateUnix ?? 0
  );
  return (
    <>
      {premiumStatus.isTrial ? (
        <div
          role="banner"
          sx={mergeSx([SX_STYLES.BANNER, SX_STYLES.FREE_TRIAL_STAGE_ONE])}
        >
          <span>
            {daysLeft === 1
              ? translate.markup(I18N_KEYS.FREE_TRIAL_1_DAY_LEFT)
              : translate.markup(I18N_KEYS.FREE_TRIAL_OTHER_DAYS_LEFT, {
                  daysLeft,
                })}
          </span>
          <a
            sx={SX_STYLES.LINK}
            href={buyDashlaneLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={logBuyDashlaneClick}
          >
            {translate(I18N_KEYS.FREE_TRIAL_BUY_DASHLANE)}
          </a>
        </div>
      ) : null}
      {useIsFreeB2C.isFreeB2CInPostTrial ? (
        <div
          role="banner"
          sx={mergeSx([SX_STYLES.BANNER, SX_STYLES.GRACE_PERIOD])}
        >
          <span>
            {daysExpired === MIN_DAYS_EXP
              ? translate(I18N_KEYS.POST_TRIAL_1_DAY_EXPIRED)
              : translate(I18N_KEYS.POST_TRIAL_OTHER_DAYS_EXPIRED, {
                  daysExpired,
                })}
          </span>
          <a
            sx={SX_STYLES.LINK}
            href={buyDashlaneLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={logBuyDashlaneClick}
          >
            {translate(I18N_KEYS.POST_TRIAL_BUY_DASHLANE)}
          </a>
        </div>
      ) : null}
    </>
  );
};
