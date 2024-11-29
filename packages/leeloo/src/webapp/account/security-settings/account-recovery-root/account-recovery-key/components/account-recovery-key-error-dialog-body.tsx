import { useEffect } from "react";
import { ActivationFlowErrorView } from "@dashlane/account-recovery-contracts";
import { DialogFooter, Paragraph } from "@dashlane/design-system";
import {
  CreateKeyErrorName,
  FlowStep,
  UserCreateAccountRecoveryKeyEvent,
} from "@dashlane/hermes";
import { HeaderAccountRecoveryKey } from "./account-recovery-heading";
import useTranslate from "../../../../../../libs/i18n/useTranslate";
import { logEvent } from "../../../../../../libs/logs/logEvent";
export const I18N_KEYS = {
  GENERIC_ERROR: "webapp_account_recovery_key_activation_generic_error_title",
  GENERIC_ERROR_DESC:
    "webapp_account_recovery_key_activation_generic_error_desc",
  GENERIC_ERROR_BUTTON: "_common_dialog_done_button",
  NETWORK_ERROR: "webapp_account_recovery_key_activation_network_error_title",
  NETWORK_ERROR_DESC:
    "webapp_account_recovery_key_activation_network_error_desc",
  NETWORK_ERROR_BUTTON:
    "webapp_account_recovery_key_activation_network_error_button",
};
export interface AccountRecoveryKeyErrorDialogBodyProps
  extends Pick<ActivationFlowErrorView, "error"> {
  onClose: () => void;
}
export const AccountRecoveryKeyErrorDialogBody = ({
  error,
  onClose,
}: AccountRecoveryKeyErrorDialogBodyProps) => {
  const { translate } = useTranslate();
  useEffect(() => {
    if (error === "GENERIC_ERROR") {
      void logEvent(
        new UserCreateAccountRecoveryKeyEvent({
          flowStep: FlowStep.Error,
          createKeyErrorName: CreateKeyErrorName.Unknown,
        })
      );
    }
  }, [error]);
  return (
    <>
      <HeaderAccountRecoveryKey
        title={error ? translate(I18N_KEYS[error]) : ""}
        iconName="FeedbackFailOutlined"
      />

      <Paragraph color="ds.text.brand.standard">
        {translate(I18N_KEYS[`${error}_DESC`])}
      </Paragraph>

      <DialogFooter
        actions={{
          primary: {
            children: translate(I18N_KEYS[`${error}_BUTTON`]),
            onClick: onClose,
          },
        }}
      />
    </>
  );
};
