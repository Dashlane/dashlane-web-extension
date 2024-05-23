import { Button, ClickOrigin, UserClickEvent } from '@dashlane/hermes';
import { Icon, jsx } from '@dashlane/design-system';
import { SpaceTier } from '@dashlane/team-admin-contracts';
import { useSubscriptionCode } from 'libs/api';
import { logEvent } from 'libs/logs/logEvent';
import { DASHLANE_B2B_DIRECT_BUY, openExternalUrl } from 'libs/externalUrls';
import { useTeamTrialStatus } from 'libs/hooks/use-team-trial-status';
import useTranslate from 'libs/i18n/useTranslate';
import { BANNER_UTM_SOURCE_PARAM } from 'app/more-tools/more-tools-list/trial-item/trial-warning-item';
import { MoreToolsListItemClickable } from '../more-tools-list-item/more-tools-list-item-clickable';
import { useShowB2BDiscontinuationBanner } from 'src/app/footer/use-show-b2b-discontinuation-banner';
const I18N_KEYS = {
    TITLE_BUSINESS: 'more_tools/discontinuation/trial_ended_business',
    TITLE_TEAM: 'more_tools/discontinuation/trial_ended_team',
    EXPLANATION: 'more_tools/discontinuation/trial_ended_explanation',
};
export const DiscontinuationItem = () => {
    const { translate } = useTranslate();
    const subscriptionCode = useSubscriptionCode();
    const teamTrialStatus = useTeamTrialStatus();
    const showDiscontinuationBanner = useShowB2BDiscontinuationBanner();
    if (!showDiscontinuationBanner) {
        return null;
    }
    if (!teamTrialStatus) {
        return null;
    }
    const isBusiness = teamTrialStatus.spaceTier === SpaceTier.Business;
    const subCodeAndUTMQueries = `&subCode=${subscriptionCode ?? ''}&utm_source=${BANNER_UTM_SOURCE_PARAM}`;
    const buyDashlaneLink = `${DASHLANE_B2B_DIRECT_BUY}?plan=${isBusiness ? 'business' : 'team'}${subCodeAndUTMQueries}`;
    const handleBuyDashlane = () => {
        void logEvent(new UserClickEvent({
            button: Button.BuyDashlane,
            clickOrigin: ClickOrigin.Banner,
        }));
        void openExternalUrl(buyDashlaneLink);
    };
    return (<MoreToolsListItemClickable icon={<Icon name="FeedbackFailOutlined" color="ds.text.neutral.catchy"/>} onClick={handleBuyDashlane} title={isBusiness
            ? translate(I18N_KEYS.TITLE_BUSINESS)
            : translate(I18N_KEYS.TITLE_TEAM)} explanation={translate(I18N_KEYS.EXPLANATION)} isWarning={true}/>);
};
