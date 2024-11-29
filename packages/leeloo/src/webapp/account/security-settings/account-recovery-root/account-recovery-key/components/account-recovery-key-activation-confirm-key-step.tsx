import { useEffect } from "react";
import { ActivationFlowConfirmKeyView } from "@dashlane/account-recovery-contracts";
import { DialogFooter, Paragraph } from "@dashlane/design-system";
import { useAnalyticsCommands } from "@dashlane/framework-react";
import { Result } from "@dashlane/framework-types";
import { PageView } from "@dashlane/hermes";
import { HeaderAccountRecoveryKey } from "./account-recovery-heading";
import { AccountRecoveryKeyInput } from "./account-recovery-key-input";
import { useAccountRecoveryKeyInputActivationFlow } from "../../../hooks/use-account-recovery-key-input-activation-flow";
import useTranslate from "../../../../../../libs/i18n/useTranslate";
const I18N_KEYS = {
  ARK_ACTIVATION_DISPLAY_KEY_STEP_TITLE:
    "webapp_account_recovery_key_third_step_title",
  ARK_ACTIVATION_DISPLAY_KEY_STEP_DESCRIPTION:
    "webapp_account_recovery_key_third_step_description",
  ARK_ACTIVATION_DISPLAY_KEY_STEP_INPUT_LABEL:
    "webapp_account_recovery_key_input_label",
  ARK_ACTIVATION_DISPLAY_KEY_STEP_INPUT_PLACEHOLDER:
    "webapp_account_recovery_key_input_placeholder",
  ARK_ACTIVATION_DISPLAY_KEY_STEP_GO_BACK: "_common_action_go_back",
  ARK_ACTIVATION_DISPLAY_KEY_STEP_CONTINUE: "_common_action_continue",
};
interface Props extends Pick<ActivationFlowConfirmKeyView, "recoveryKey"> {
  goToNextStep: () => Promise<Result<undefined>>;
  goToPrevStep: () => Promise<Result<undefined>>;
  isLoading: boolean;
}
export const AccountRecoveryKeyActivationConfirmKeyStep = ({
  recoveryKey,
  isLoading,
  goToNextStep,
  goToPrevStep,
}: Props) => {
  const { translate } = useTranslate();
  const { trackPageView } = useAnalyticsCommands();
  useEffect(() => {
    trackPageView({
      pageView: PageView.SettingsSecurityRecoveryKeyConfirm,
    });
  }, []);
  const { inputValue, inputError, isInputValid, handleChangeInputValue } =
    useAccountRecoveryKeyInputActivationFlow(recoveryKey ?? "");
  return (
    <>
      <HeaderAccountRecoveryKey
        title={translate(I18N_KEYS.ARK_ACTIVATION_DISPLAY_KEY_STEP_TITLE)}
        iconName="RecoveryKeyOutlined"
      />

      <Paragraph sx={{ marginBottom: "26px" }}>
        {translate(I18N_KEYS.ARK_ACTIVATION_DISPLAY_KEY_STEP_DESCRIPTION)}
      </Paragraph>
      <AccountRecoveryKeyInput
        value={inputValue}
        onChange={handleChangeInputValue}
        error={inputError}
      />

      <DialogFooter
        actions={{
          primary: {
            children: translate(
              I18N_KEYS.ARK_ACTIVATION_DISPLAY_KEY_STEP_CONTINUE
            ),
            onClick: () => {
              goToNextStep();
            },
            isLoading: isLoading,
            disabled: !isInputValid,
          },
          secondary: {
            children: translate(
              I18N_KEYS.ARK_ACTIVATION_DISPLAY_KEY_STEP_GO_BACK
            ),
            onClick: () => {
              goToPrevStep();
            },
          },
        }}
      />
    </>
  );
};
