import { differenceInCalendarDays, fromUnixTime } from 'date-fns';
import { Icon, jsx } from '@dashlane/design-system';
import { Button, ClickOrigin, UserClickEvent } from '@dashlane/hermes';
import { DASHLANE_B2B_DIRECT_BUY, openExternalUrl } from 'libs/externalUrls';
import { logEvent } from 'libs/logs/logEvent';
import useTranslate from 'libs/i18n/useTranslate';
import { MoreToolsListItemClickable } from '../more-tools-list-item/more-tools-list-item-clickable';
import { useTrialInfo } from './use-trial-info-hook';
import { BANNER_UTM_SOURCE_PARAM } from '../trial-item/trial-warning-item';
const I18N_KEYS = {
    TITLE_BUSINESS: 'more_tools/business_trial_title',
    TITLE_TEAM: 'more_tools/team_trial_title',
    GRACE_PERIOD_EXPLANATION: 'more_tools/grace_period_days_left_trial_extended',
};
export const GracePeriodWarningItem = () => {
    const { translate } = useTranslate();
    const trialInfo = useTrialInfo();
    if (!trialInfo) {
        return null;
    }
    const { subscriptionCode, billingInfo, isTeam, isBusiness, isTeamSoftDiscontinued, trialStatus, } = trialInfo;
    if (!billingInfo || !trialStatus) {
        return null;
    }
    if (!isTeam && !isBusiness) {
        return null;
    }
    const lastDayOfTrialUnix = billingInfo.nextBillingDetails.dateUnix;
    const shouldShowTrialDaysLeftBanner = trialStatus.isFreeTrial &&
        trialStatus.isGracePeriod &&
        !isTeamSoftDiscontinued;
    if (!shouldShowTrialDaysLeftBanner) {
        return null;
    }
    const daysLeftInTrial = lastDayOfTrialUnix
        ? differenceInCalendarDays(fromUnixTime(lastDayOfTrialUnix), new Date())
        : undefined;
    if (daysLeftInTrial === undefined) {
        return null;
    }
    const subCodeAndUTMQueries = `&subCode=${subscriptionCode ?? ''}&utm_source=${BANNER_UTM_SOURCE_PARAM}`;
    const buyDashlaneLink = isBusiness
        ? `${DASHLANE_B2B_DIRECT_BUY}?plan=business${subCodeAndUTMQueries}`
        : `${DASHLANE_B2B_DIRECT_BUY}?plan=team${subCodeAndUTMQueries}`;
    const handleBuyDashlane = () => {
        void logEvent(new UserClickEvent({
            button: Button.BuyDashlane,
            clickOrigin: ClickOrigin.Banner,
        }));
        void openExternalUrl(buyDashlaneLink);
    };
    return (<MoreToolsListItemClickable icon={<Icon name="FeedbackWarningOutlined" color="ds.text.neutral.catchy"/>} onClick={handleBuyDashlane} title={isBusiness
            ? translate(I18N_KEYS.TITLE_BUSINESS)
            : translate(I18N_KEYS.TITLE_TEAM)} explanation={translate(I18N_KEYS.GRACE_PERIOD_EXPLANATION, {
            count: daysLeftInTrial,
        })} isWarning={true}/>);
};
