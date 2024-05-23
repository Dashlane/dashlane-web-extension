import React, { ReactNode } from 'react';
import { DSStyleObject, jsx, mergeSx } from '@dashlane/design-system';
import { useFeatureFlip } from '@dashlane/framework-react';
import { FEATURE_FLIPS_WITHOUT_MODULE } from '@dashlane/framework-dashlane-application';
import { SpaceTier } from '@dashlane/team-admin-contracts';
import { useAccountInfo } from 'libs/carbon/hooks/useAccountInfo';
import { useDiscontinuedStatus } from 'libs/carbon/hooks/useNodePremiumStatus';
import { useTeamTrialStatus } from 'libs/hooks/use-team-trial-status';
import useTranslate from 'libs/i18n/useTranslate';
import { useLogPageViewContext } from 'libs/logs/log-page-view-context';
import { BUSINESS_BUY } from 'team/urls';
import { handleClickOnBuyDashlane } from '../helpers';
import { SX_STYLES } from './banners-sx-styling';
const I18N_KEYS = {
    TRIAL_TEAM_1_DAY_LEFT: 'trial_banner_1_day_left_team_free_trial_markup',
    TRIAL_TEAM_OTHER_DAYS_LEFT: 'trial_banner_other_days_left_team_free_trial_markup',
    TRIAL_BUSINESS_1_DAY_LEFT: 'trial_banner_1_day_left_business_free_trial_markup',
    TRIAL_BUSINESS_OTHER_DAYS_LEFT: 'trial_banner_other_days_left_business_free_trial_markup',
    GRACE_PERIOD_1_DAY_LEFT: 'trial_banner_1_day_left_grace_period_extended_markup',
    GRACE_PERIOD_OTHER_DAYS_LEFT: 'trial_banner_other_days_left_grace_period_extended_markup',
    TRIAL_PLAN_DISCONTINUED: 'trial_banner_plan_discontinued',
    BUY_DASHLANE_LINK: 'trial_banner_buy_dashlane',
    BUY_DASHLANE_TEAM_LINK: 'trial_banner_buy_dashlane_team',
    BUY_DASHLANE_BUSINESS_LINK: 'trial_banner_buy_dashlane_business',
};
export const B2BTrialDaysLeftBanner = () => {
    const currentPageView = useLogPageViewContext();
    const accountInfo = useAccountInfo();
    const discontinuedStatus = useDiscontinuedStatus();
    const teamTrialStatus = useTeamTrialStatus();
    const hasB2BDiscontinuationFFEnabled = useFeatureFlip(FEATURE_FLIPS_WITHOUT_MODULE.EcommerceWebB2BDiscontinuationPhase1);
    const { translate } = useTranslate();
    if (!teamTrialStatus ||
        typeof hasB2BDiscontinuationFFEnabled !== 'boolean' ||
        discontinuedStatus.isLoading) {
        return null;
    }
    const isTeam = teamTrialStatus.spaceTier === SpaceTier.Team;
    const isBusiness = teamTrialStatus.spaceTier === SpaceTier.Business;
    const { isTeamSoftDiscontinued, isTrial } = discontinuedStatus;
    if (!teamTrialStatus.isFreeTrial) {
        return null;
    }
    if (!isTeam && !isBusiness) {
        return null;
    }
    if (!hasB2BDiscontinuationFFEnabled && isTeamSoftDiscontinued) {
        return null;
    }
    const daysLeft = teamTrialStatus.daysLeftInTrial;
    const utmParam = `button:buy_dashlane+click_origin:banner+origin_page:${currentPageView || undefined}+origin_component:main_app`;
    const buyDashlaneLink = `${BUSINESS_BUY}?plan=${isTeam ? 'team' : 'business'}&subCode=${accountInfo?.subscriptionCode}&utm_source=${utmParam}`;
    const getBannerParameters = (): {
        sxStyle: DSStyleObject;
        mainText: string | ReactNode;
        linkText: string;
        testId: string;
    } | undefined => {
        if (isTeamSoftDiscontinued && isTrial) {
            const sxStyle = mergeSx([SX_STYLES.BANNER, SX_STYLES.DISCONTINUED]);
            const mainText = translate(I18N_KEYS.TRIAL_PLAN_DISCONTINUED);
            const linkText = translate(I18N_KEYS.BUY_DASHLANE_LINK);
            const testId = 'plan-discontinued-banner';
            return { sxStyle, mainText, linkText, testId };
        }
        if (teamTrialStatus.isGracePeriod) {
            const sxStyle = mergeSx([SX_STYLES.BANNER, SX_STYLES.GRACE_PERIOD]);
            const mainText = daysLeft === 1
                ? translate.markup(I18N_KEYS.GRACE_PERIOD_1_DAY_LEFT)
                : translate.markup(I18N_KEYS.GRACE_PERIOD_OTHER_DAYS_LEFT, {
                    daysLeft,
                });
            const linkText = translate(isTeam
                ? I18N_KEYS.BUY_DASHLANE_TEAM_LINK
                : I18N_KEYS.BUY_DASHLANE_BUSINESS_LINK);
            const testId = 'grace-period-banner';
            return { sxStyle, mainText, linkText, testId };
        }
        const sxStyle = mergeSx([
            SX_STYLES.BANNER,
            teamTrialStatus.isSecondStageOfTrial
                ? SX_STYLES.FREE_TRIAL_STAGE_TWO
                : SX_STYLES.FREE_TRIAL_STAGE_ONE,
        ]);
        let mainText: ReactNode;
        if (isTeam) {
            mainText =
                daysLeft === 1
                    ? translate.markup(I18N_KEYS.TRIAL_TEAM_1_DAY_LEFT)
                    : translate.markup(I18N_KEYS.TRIAL_TEAM_OTHER_DAYS_LEFT, {
                        daysLeft,
                    });
        }
        else {
            mainText =
                daysLeft === 1
                    ? translate.markup(I18N_KEYS.TRIAL_BUSINESS_1_DAY_LEFT)
                    : translate.markup(I18N_KEYS.TRIAL_BUSINESS_OTHER_DAYS_LEFT, {
                        daysLeft,
                    });
        }
        const linkText = translate(I18N_KEYS.BUY_DASHLANE_LINK);
        const testId = 'free-trial-banner';
        return { sxStyle, mainText, linkText, testId };
    };
    const bannerParameters = getBannerParameters();
    if (!bannerParameters) {
        return null;
    }
    return (<React.Fragment>
      <div sx={bannerParameters.sxStyle} data-testid={bannerParameters.testId}>
        <span>{bannerParameters.mainText}</span>
        <a href={buyDashlaneLink} key={bannerParameters.linkText} target="_blank" rel="noopener noreferrer" onClick={handleClickOnBuyDashlane}>
          {bannerParameters.linkText}
        </a>
      </div>
    </React.Fragment>);
};
