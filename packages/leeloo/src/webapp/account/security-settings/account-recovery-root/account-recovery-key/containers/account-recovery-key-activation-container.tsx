import classnames from "classnames";
import { useState } from "react";
import {
  accountRecoveryKeyApi,
  ActivationFlowViewStep,
} from "@dashlane/account-recovery-contracts";
import { Dialog } from "@dashlane/design-system";
import { useModuleCommands, useModuleQuery } from "@dashlane/framework-react";
import { DeleteKeyReason } from "@dashlane/hermes";
import {
  AccountRecoveryKeyActivationCancel,
  AccountRecoveryKeyActivationCancelNewKeyStep,
  AccountRecoveryKeyActivationConfirmKeyStep,
  AccountRecoveryKeyActivationDisplayKeyStep,
  AccountRecoveryKeyActivationFinalStep,
  AccountRecoveryKeyActivationGenerateNewKeyStep,
  AccountRecoveryKeyActivationInitStep,
  AccountRecoveryKeyErrorDialogBody,
} from "../components";
import {
  logUserCreateAccountRecoveryKeyEventCancel,
  logUserCreateAccountRecoveryKeyEventComplete,
  logUserDeleteAccountRecoveryKey,
} from "../helpers/logs";
import useTranslate from "../../../../../../libs/i18n/useTranslate";
import { allIgnoreClickOutsideClassName } from "../../../../../variables";
const I18N_KEYS = {
  BUTTON_CLOSE_DIALOG: "_common_dialog_dismiss_button",
};
interface Props {
  onClose: () => void;
}
export const AccountRecoveryKeyActivationContainer = ({ onClose }: Props) => {
  const { translate } = useTranslate();
  const {
    cancelGeneration,
    confirmActivation,
    goToActivationNextStep,
    goToActivationPrevStep,
    requestActivation,
    resetActivationFlow,
  } = useModuleCommands(accountRecoveryKeyApi);
  const arkActivationStatus = useModuleQuery(
    accountRecoveryKeyApi,
    "activationFlowStatus"
  );
  const [isOpen, setIsOpen] = useState(true);
  const [isCancelDialogOpened, setIsCancelDialogOpened] = useState(false);
  const handleResetActivationFlow = () => {
    void resetActivationFlow();
    logUserCreateAccountRecoveryKeyEventCancel();
    onClose();
  };
  const isFeatureEnabled = !!arkActivationStatus.data?.isFeatureEnabled;
  const handleCloseActivationFlow = () => {
    const step = arkActivationStatus.data?.step;
    if (
      step === ActivationFlowViewStep.RequestActivation ||
      step === ActivationFlowViewStep.DisplayKey ||
      step === ActivationFlowViewStep.ConfirmKey ||
      step === ActivationFlowViewStep.FinaliseActivation
    ) {
      setIsOpen(false);
      setIsCancelDialogOpened(true);
    } else {
      handleResetActivationFlow();
    }
  };
  const handleCompleteActivationFlow = () => {
    void resetActivationFlow();
    if (
      arkActivationStatus.data?.step ===
        ActivationFlowViewStep.ActivationDone &&
      arkActivationStatus.data?.isFeatureEnabled
    ) {
      logUserDeleteAccountRecoveryKey(DeleteKeyReason.NewRecoveryKeyGenerated);
    } else {
      logUserCreateAccountRecoveryKeyEventComplete();
    }
    onClose();
  };
  const getCurrentStep = () => {
    switch (arkActivationStatus.data?.step) {
      case ActivationFlowViewStep.InitActivation:
        return (
          <AccountRecoveryKeyActivationInitStep
            goToNextStep={requestActivation}
          />
        );
      case ActivationFlowViewStep.RequestActivation:
      case ActivationFlowViewStep.DisplayKey:
        return (
          <AccountRecoveryKeyActivationDisplayKeyStep
            {...arkActivationStatus.data}
            goToNextStep={goToActivationNextStep}
            isLoading={
              arkActivationStatus.data?.step ===
              ActivationFlowViewStep.RequestActivation
            }
          />
        );
      case ActivationFlowViewStep.ConfirmKey:
      case ActivationFlowViewStep.FinaliseActivation:
        return (
          <AccountRecoveryKeyActivationConfirmKeyStep
            {...arkActivationStatus.data}
            goToNextStep={confirmActivation}
            goToPrevStep={goToActivationPrevStep}
            isLoading={
              arkActivationStatus.data?.step ===
              ActivationFlowViewStep.FinaliseActivation
            }
          />
        );
      case ActivationFlowViewStep.ActivationDone:
        return (
          <AccountRecoveryKeyActivationFinalStep
            onClose={handleCompleteActivationFlow}
          />
        );
      case ActivationFlowViewStep.ShowError:
        return (
          <AccountRecoveryKeyErrorDialogBody
            {...arkActivationStatus.data}
            onClose={handleResetActivationFlow}
          />
        );
      case ActivationFlowViewStep.GenerateNewKey:
        return (
          <AccountRecoveryKeyActivationGenerateNewKeyStep
            requestActivation={requestActivation}
            resetActivationFlow={cancelGeneration}
          />
        );
      case ActivationFlowViewStep.CancelGenerateNewKey:
        return (
          <AccountRecoveryKeyActivationCancelNewKeyStep
            goToPrevStep={goToActivationPrevStep}
            onClose={handleResetActivationFlow}
          />
        );
      default:
        return;
    }
  };
  return (
    <>
      <Dialog
        isOpen={isOpen}
        dialogClassName={classnames(allIgnoreClickOutsideClassName)}
        disableScrolling
        closeActionLabel={translate(I18N_KEYS.BUTTON_CLOSE_DIALOG)}
        onClose={() => handleCloseActivationFlow()}
        aria-label="account-recovery-key-generation-dialog"
      >
        {getCurrentStep()}
      </Dialog>
      <Dialog
        isOpen={isCancelDialogOpened}
        dialogClassName={classnames(allIgnoreClickOutsideClassName)}
        disableScrolling
        closeActionLabel={translate(I18N_KEYS.BUTTON_CLOSE_DIALOG)}
        onClose={() => setIsCancelDialogOpened(!isCancelDialogOpened)}
        aria-label="account-recovery-key-generation-cancel-dialog"
      >
        <AccountRecoveryKeyActivationCancel
          goBack={() => {
            setIsCancelDialogOpened(!isCancelDialogOpened);
            setIsOpen(true);
          }}
          resetActivationFlow={() => {
            handleResetActivationFlow();
            setIsCancelDialogOpened(!isCancelDialogOpened);
            onClose();
          }}
          isFeatureEnabled={isFeatureEnabled}
        />
      </Dialog>
    </>
  );
};
