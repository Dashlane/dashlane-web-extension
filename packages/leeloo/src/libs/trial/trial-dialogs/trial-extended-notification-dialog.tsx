import { CallToAction, UserCallToActionEvent } from '@dashlane/hermes';
import { jsx } from '@dashlane/design-system';
import { teamAdminNotificationsApi } from '@dashlane/team-admin-contracts';
import { useModuleCommands } from '@dashlane/framework-react';
import { useAccountInfo } from 'libs/carbon/hooks/useAccountInfo';
import useTranslate from 'libs/i18n/useTranslate';
import { logEvent } from 'libs/logs/logEvent';
import { openUrl } from 'libs/external-urls';
import { BUSINESS_BUY } from 'team/urls';
import { TrialExtendedDialog } from './trial-extended-dialog';
const I18N_KEYS = {
    DISMISS_BUTTON: 'team_trial_extended_dialog_dismiss_button',
    BUY_DASHLANE_BUTTON: 'team_trial_extended_dialog_buy_dashlane_button',
};
interface Props {
    isOpen: boolean;
    isTeamPlan: boolean;
    onClose: () => void;
}
export const TrialExtendedNotificationDialog = ({ isOpen, onClose, isTeamPlan, }: Props) => {
    const { translate } = useTranslate();
    const accountInfo = useAccountInfo();
    const adminNotificationCommands = useModuleCommands(teamAdminNotificationsApi);
    const buyDashlaneLink = `${BUSINESS_BUY}?plan=${isTeamPlan ? 'team' : 'business'}&subCode=${accountInfo?.subscriptionCode}`;
    const handleClickOnBuyDashlane = () => {
        logEvent(new UserCallToActionEvent({
            callToActionList: [CallToAction.BuyDashlane, CallToAction.Dismiss],
            chosenAction: CallToAction.BuyDashlane,
            hasChosenNoAction: false,
        }));
        adminNotificationCommands.markNotificationTrialExtendedSeen();
        openUrl(buyDashlaneLink);
    };
    if (!isOpen) {
        return null;
    }
    return (<TrialExtendedDialog onClose={onClose} primaryActionLabel={translate(I18N_KEYS.BUY_DASHLANE_BUTTON)} primaryActionOnClick={handleClickOnBuyDashlane} secondaryActionLabel={translate(I18N_KEYS.DISMISS_BUTTON)} secondaryActionOnClick={onClose}/>);
};
