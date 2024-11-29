import { ActivationFlowErrorView } from "@dashlane/account-recovery-contracts";
import { Button, Paragraph } from "@dashlane/design-system";
import { Result } from "@dashlane/framework-types";
import { AccountRecoveryKeyEnforcementHeading } from "../ark-enforcement-components/ark-enforcement-heading";
import useTranslate from "../../../../../../../libs/i18n/useTranslate";
export const I18N_KEYS = {
  GENERIC_ERROR: "webapp_account_recovery_key_activation_generic_error_title",
  GENERIC_ERROR_DESC:
    "webapp_account_recovery_key_activation_generic_error_desc",
  GENERIC_ERROR_BUTTON:
    "login_account_recovery_key_error_screen_try_again_button",
  NETWORK_ERROR: "webapp_account_recovery_key_activation_network_error_title",
  NETWORK_ERROR_DESC:
    "webapp_account_recovery_key_activation_network_error_desc",
  NETWORK_ERROR_BUTTON:
    "login_account_recovery_key_error_screen_try_again_button",
};
interface Props extends Pick<ActivationFlowErrorView, "error"> {
  goToPrevStep: () => Promise<Result<undefined>>;
}
type ArkEnforcementError = "GENERIC_ERROR" | "NETWORK_ERROR";
export const ArkEnforcementErrorStep = ({ error, goToPrevStep }: Props) => {
  const { translate } = useTranslate();
  return (
    <>
      <AccountRecoveryKeyEnforcementHeading
        title={error ? translate(I18N_KEYS[error as ArkEnforcementError]) : ""}
        iconName="FeedbackFailOutlined"
        iconMood="danger"
      />
      <Paragraph sx={{ marginBottom: "26px" }}>
        {translate(I18N_KEYS[`${error as ArkEnforcementError}_DESC`])}
      </Paragraph>
      <Button fullsize onClick={goToPrevStep} sx={{ margin: "8px 0" }}>
        {translate(I18N_KEYS[`${error as ArkEnforcementError}_BUTTON`])}
      </Button>
    </>
  );
};
