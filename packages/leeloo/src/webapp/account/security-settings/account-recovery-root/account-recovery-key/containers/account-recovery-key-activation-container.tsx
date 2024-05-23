import classnames from 'classnames';
import { useModuleCommands, useModuleQuery } from '@dashlane/framework-react';
import { accountRecoveryKeyApi, ActivationFlowViewStep, } from '@dashlane/account-recovery-contracts';
import { DeleteKeyReason } from '@dashlane/hermes';
import { Dialog, jsx } from '@dashlane/ui-components';
import { AccountRecoveryKeyActivationCancelNewKeyStep, AccountRecoveryKeyActivationConfirmKeyStep, AccountRecoveryKeyActivationDisplayKeyStep, AccountRecoveryKeyActivationFinalStep, AccountRecoveryKeyActivationGenerateNewKeyStep, AccountRecoveryKeyActivationInitStep, AccountRecoveryKeyErrorDialogBody, } from '../components';
import { logUserCreateAccountRecoveryKeyEventCancel, logUserCreateAccountRecoveryKeyEventComplete, logUserDeleteAccountRecoveryKey, } from 'webapp/account/security-settings/account-recovery-root/account-recovery-key/helpers/logs';
import useTranslate from 'libs/i18n/useTranslate';
import { allIgnoreClickOutsideClassName } from 'webapp/variables';
const I18N_KEYS = {
    BUTTON_CLOSE_DIALOG: '_common_dialog_dismiss_button',
};
interface Props {
    onClose: () => void;
}
export const AccountRecoveryKeyActivationContainer = ({ onClose }: Props) => {
    const { translate } = useTranslate();
    const { goToActivationNextStep, goToActivationPrevStep, requestActivation, confirmActivation, cancelActivation, cancelGeneration, } = useModuleCommands(accountRecoveryKeyApi);
    const arkActivationStatus = useModuleQuery(accountRecoveryKeyApi, 'activationFlowStatus');
    const handleCloseActivationFlow = () => {
        void cancelActivation();
        logUserCreateAccountRecoveryKeyEventCancel();
        onClose();
    };
    const handleCompleteActivationFlow = () => {
        void cancelActivation();
        if (arkActivationStatus.data?.step ===
            ActivationFlowViewStep.ActivationDone &&
            arkActivationStatus.data?.isFeatureEnabled) {
            logUserDeleteAccountRecoveryKey(DeleteKeyReason.NewRecoveryKeyGenerated);
        }
        else {
            logUserCreateAccountRecoveryKeyEventComplete();
        }
        onClose();
    };
    const getCurrentStep = () => {
        switch (arkActivationStatus.data?.step) {
            case ActivationFlowViewStep.InitActivation:
                return (<AccountRecoveryKeyActivationInitStep goToNextStep={requestActivation}/>);
            case ActivationFlowViewStep.RequestActivation:
            case ActivationFlowViewStep.DisplayKey:
                return (<AccountRecoveryKeyActivationDisplayKeyStep {...arkActivationStatus.data} goToNextStep={goToActivationNextStep} isLoading={arkActivationStatus.data?.step ===
                        ActivationFlowViewStep.RequestActivation}/>);
            case ActivationFlowViewStep.ConfirmKey:
            case ActivationFlowViewStep.FinaliseActivation:
                return (<AccountRecoveryKeyActivationConfirmKeyStep {...arkActivationStatus.data} goToNextStep={confirmActivation} goToPrevStep={goToActivationPrevStep} isLoading={arkActivationStatus.data?.step ===
                        ActivationFlowViewStep.FinaliseActivation}/>);
            case ActivationFlowViewStep.ActivationDone:
                return (<AccountRecoveryKeyActivationFinalStep onClose={handleCompleteActivationFlow}/>);
            case ActivationFlowViewStep.ShowError:
                return (<AccountRecoveryKeyErrorDialogBody {...arkActivationStatus.data} onClose={handleCloseActivationFlow}/>);
            case ActivationFlowViewStep.GenerateNewKey:
                return (<AccountRecoveryKeyActivationGenerateNewKeyStep requestActivation={requestActivation} cancelActivation={cancelGeneration}/>);
            case ActivationFlowViewStep.CancelGenerateNewKey:
                return (<AccountRecoveryKeyActivationCancelNewKeyStep goToPrevStep={goToActivationPrevStep} onClose={handleCloseActivationFlow}/>);
            default:
                return;
        }
    };
    return (<Dialog isOpen modalContentClassName={classnames(allIgnoreClickOutsideClassName)} disableOutsideClickClose disableScrolling disableUserInputTrap disableEscapeKeyClose closeIconName={translate(I18N_KEYS.BUTTON_CLOSE_DIALOG)} onClose={handleCloseActivationFlow}>
      {getCurrentStep()}
    </Dialog>);
};
