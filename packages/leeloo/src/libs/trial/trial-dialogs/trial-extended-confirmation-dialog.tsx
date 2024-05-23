import { CallToAction, UserCallToActionEvent } from '@dashlane/hermes';
import { jsx } from '@dashlane/design-system';
import useTranslate from 'libs/i18n/useTranslate';
import { openUrl } from 'libs/external-urls';
import { logEvent } from 'libs/logs/logEvent';
import { BUSINESS_PLANS } from 'team/urls';
import { TrialExtendedDialog } from './trial-extended-dialog';
const I18N_KEYS = {
    CLOSE_BUTTON: 'team_trial_extended_dialog_close_button',
    SEE_PLANS_BUTTON: 'team_trial_extended_dialog_see_plans_button',
};
interface Props {
    isOpen: boolean;
    onClose: () => void;
}
export const TrialExtendedConfirmationDialog = ({ isOpen, onClose }: Props) => {
    const { translate } = useTranslate();
    const handleSeePlans = () => {
        logEvent(new UserCallToActionEvent({
            callToActionList: [
                CallToAction.SeeAllPlans,
                CallToAction.Close,
                CallToAction.Dismiss,
            ],
            chosenAction: CallToAction.SeeAllPlans,
            hasChosenNoAction: false,
        }));
        openUrl(BUSINESS_PLANS);
    };
    if (!isOpen) {
        return null;
    }
    return (<TrialExtendedDialog onClose={onClose} primaryActionLabel={translate(I18N_KEYS.CLOSE_BUTTON)} primaryActionOnClick={onClose} secondaryActionLabel={translate(I18N_KEYS.SEE_PLANS_BUTTON)} secondaryActionOnClick={handleSeePlans}/>);
};
