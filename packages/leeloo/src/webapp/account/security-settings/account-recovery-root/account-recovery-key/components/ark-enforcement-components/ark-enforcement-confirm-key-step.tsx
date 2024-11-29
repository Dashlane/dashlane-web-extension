import { ActivationFlowConfirmKeyView } from "@dashlane/account-recovery-contracts";
import { Button, Paragraph } from "@dashlane/design-system";
import { Result } from "@dashlane/framework-types";
import { AccountRecoveryKeyEnforcementHeading } from "../ark-enforcement-components/ark-enforcement-heading";
import { ArkEnforcementInput } from "./ark-enforcement-input";
import useTranslate from "../../../../../../../libs/i18n/useTranslate";
import { useAccountRecoveryKeyInputActivationFlow } from "../../../../hooks/use-account-recovery-key-input-activation-flow";
const I18N_KEYS = {
  ARK_ACTIVATION_DISPLAY_KEY_STEP_TITLE:
    "webapp_enforce_account_recovery_key_confirm_title",
  ARK_ACTIVATION_DISPLAY_KEY_STEP_DESCRIPTION:
    "webapp_enforce_account_recovery_key_confirm_subheading",
  ARK_ACTIVATION_DISPLAY_KEY_STEP_FORGOT_CTA:
    "webapp_enforce_account_recovery_key_confirm_forgot_cta",
  ARK_ACTIVATION_DISPLAY_KEY_STEP_CONFIRM: "_common_action_confirm",
};
interface Props extends Pick<ActivationFlowConfirmKeyView, "recoveryKey"> {
  goToNextStep: () => Promise<Result<undefined>>;
  goToPrevStep: () => Promise<Result<undefined>>;
  isLoading: boolean;
}
export const ArkEnforcementConfirmKeyStep = ({
  recoveryKey,
  isLoading,
  goToNextStep,
  goToPrevStep,
}: Props) => {
  const { translate } = useTranslate();
  const { inputValue, inputError, isInputValid, handleChangeInputValue } =
    useAccountRecoveryKeyInputActivationFlow(recoveryKey ?? "");
  return (
    <>
      <AccountRecoveryKeyEnforcementHeading
        title={translate(I18N_KEYS.ARK_ACTIVATION_DISPLAY_KEY_STEP_TITLE)}
        iconName="RecoveryKeyOutlined"
      />

      <Paragraph sx={{ marginBottom: "26px" }}>
        {translate(I18N_KEYS.ARK_ACTIVATION_DISPLAY_KEY_STEP_DESCRIPTION)}
      </Paragraph>
      <ArkEnforcementInput
        value={inputValue}
        onChange={handleChangeInputValue}
        error={inputError}
      />

      <Button
        fullsize
        onClick={goToNextStep}
        isLoading={isLoading}
        disabled={!isInputValid}
        sx={{ margin: "8px 0" }}
      >
        {translate(I18N_KEYS.ARK_ACTIVATION_DISPLAY_KEY_STEP_CONFIRM)}
      </Button>
      <Button onClick={goToPrevStep} fullsize mood="neutral" intensity="quiet">
        {translate(I18N_KEYS.ARK_ACTIVATION_DISPLAY_KEY_STEP_FORGOT_CTA)}
      </Button>
    </>
  );
};
