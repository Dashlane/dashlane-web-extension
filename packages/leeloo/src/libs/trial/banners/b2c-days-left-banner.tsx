import { Fragment } from 'react';
import { DataStatus } from '@dashlane/carbon-api-consumers';
import { jsx, mergeSx } from '@dashlane/design-system';
import { useFeatureFlip } from '@dashlane/framework-react';
import { FEATURE_FLIPS_WITHOUT_MODULE } from '@dashlane/framework-dashlane-application';
import { GET_PREMIUM_URL } from 'app/routes/constants';
import { useNodePremiumStatus } from 'libs/carbon/hooks/useNodePremiumStatus';
import { useAccountInfo } from 'libs/carbon/hooks/useAccountInfo';
import useTranslate from 'libs/i18n/useTranslate';
import { getDaysExpiredAfterTrial, getDaysLeftInTrial, handleClickOnBuyDashlane, } from '../helpers';
import { SX_STYLES } from './banners-sx-styling';
const B2C_POST_TRIAL_BANNER_FEATURE_FLIP = FEATURE_FLIPS_WITHOUT_MODULE.B2CWebPostTrialBanner;
const I18N_KEYS = {
    FREE_TRIAL_1_DAY_LEFT: 'trial_banner_b2c_free_trial_1_day_left_markup',
    FREE_TRIAL_OTHER_DAYS_LEFT: 'trial_banner_b2c_free_trial_other_days_left_markup',
    FREE_TRIAL_BUY_DASHLANE: 'trial_banner_buy_dashlane',
    POST_TRIAL_1_DAY_EXPIRED: 'b2c_post_trial_banner_1_day_expired',
    POST_TRIAL_OTHER_DAYS_EXPIRED: 'b2c_post_trial_banner_other_days_expired',
    POST_TRIAL_BUY_DASHLANE: 'b2c_post_trial_banner_buy_dashlane',
};
const MIN_DAYS_EXP = 1;
const MAX_DAYS_EXP = 15;
export const B2CTrialDaysLeftBanner = () => {
    const { translate } = useTranslate();
    const accountInfo = useAccountInfo();
    const buyDashlaneLink = `${GET_PREMIUM_URL}?subCode=${accountInfo?.subscriptionCode ?? ''}`;
    const getNodePremiumStatus = useNodePremiumStatus();
    const premiumStatus = getNodePremiumStatus.status === DataStatus.Success &&
        getNodePremiumStatus.data
        ? getNodePremiumStatus.data
        : null;
    const hasB2CPostTrialBannerFF = useFeatureFlip(B2C_POST_TRIAL_BANNER_FEATURE_FLIP);
    if (!premiumStatus) {
        return null;
    }
    const daysLeft = getDaysLeftInTrial(premiumStatus.endDateUnix ?? 0);
    const daysExpired = getDaysExpiredAfterTrial(premiumStatus.previousPlan?.endDateUnix ?? 0);
    return (<>
      {premiumStatus.isTrial ? (<div sx={mergeSx([SX_STYLES.BANNER, SX_STYLES.FREE_TRIAL_STAGE_ONE])}>
          <span>
            {daysLeft === 1
                ? translate.markup(I18N_KEYS.FREE_TRIAL_1_DAY_LEFT)
                : translate.markup(I18N_KEYS.FREE_TRIAL_OTHER_DAYS_LEFT, {
                    daysLeft,
                })}
          </span>
          <a sx={SX_STYLES.LINK} href={buyDashlaneLink} target="_blank" rel="noopener noreferrer" onClick={handleClickOnBuyDashlane}>
            {translate(I18N_KEYS.FREE_TRIAL_BUY_DASHLANE)}
          </a>
        </div>) : null}
      {hasB2CPostTrialBannerFF &&
            daysExpired >= MIN_DAYS_EXP &&
            daysExpired <= MAX_DAYS_EXP ? (<div sx={mergeSx([SX_STYLES.BANNER, SX_STYLES.GRACE_PERIOD])}>
          <span>
            {daysExpired === MIN_DAYS_EXP
                ? translate(I18N_KEYS.POST_TRIAL_1_DAY_EXPIRED)
                : translate(I18N_KEYS.POST_TRIAL_OTHER_DAYS_EXPIRED, {
                    daysExpired,
                })}
          </span>
          <a sx={SX_STYLES.LINK} href={buyDashlaneLink} target="_blank" rel="noopener noreferrer" onClick={handleClickOnBuyDashlane}>
            {translate(I18N_KEYS.POST_TRIAL_BUY_DASHLANE)}
          </a>
        </div>) : null}
    </>);
};
