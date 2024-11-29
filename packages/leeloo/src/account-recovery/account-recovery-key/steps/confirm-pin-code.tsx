import { useState } from "react";
import {
  Button,
  ExpressiveIcon,
  Flex,
  Heading,
  Paragraph,
} from "@dashlane/design-system";
import { Result } from "@dashlane/framework-types";
import { FlexContainer } from "@dashlane/ui-components";
import {
  RecoveryFlowConfirmPinView,
  SubmitPinRequest,
} from "@dashlane/account-recovery-contracts";
import useTranslate from "../../../libs/i18n/useTranslate";
import { PIN_CODE_LENGTH } from "../../../pin-code/constants";
import { PincodeInput } from "../../../pin-code/pin-code-input";
import { FlowStep, UserUseAccountRecoveryKeyEvent } from "@dashlane/hermes";
import { LOGIN_URL_SEGMENT } from "../../../app/routes/constants";
import { logEvent } from "../../../libs/logs/logEvent";
import { redirect } from "../../../libs/router";
const I18N_KEYS = {
  ACCOUNT_RECOVERY_STEP_COUNT: "login_confirm_account_recovery_key_step_count",
  CONFIRM_PIN_CODE_TITLE:
    "webapp_auth_panel_account_creation_passwordless_confirm_pin_title",
  LOGIN_EMAIL_LABEL:
    "webapp_auth_panel_account_creation_passwordless_login_email_label",
  PIN_INPUT_LABEL:
    "webapp_auth_panel_account_creation_passwordless_pin_input_label",
  PIN_MISMATCH:
    "webapp_auth_panel_account_creation_passwordless_confirm_pin_mismatch_error",
  PROCEED_TO_ARK_SETUP_BUTTON:
    "webapp_auth_panel_account_creation_passwordless_activate_after_ark_pin_button",
  CONFIRM_ARK_STEP_CANCEL: "_common_action_cancel",
  GENERIC_ERROR: "_common_generic_error",
  NETWORK_ERROR: "_common_alert_network_error_message",
};
interface ConfirmPinCodeProps extends Omit<RecoveryFlowConfirmPinView, "step"> {
  onSubmitPin: (command: SubmitPinRequest) => Promise<Result<undefined>>;
  onCancel: () => Promise<Result<undefined>>;
}
export const ConfirmPinCode = ({
  pinCode,
  onSubmitPin,
  onCancel,
}: ConfirmPinCodeProps) => {
  const { translate } = useTranslate();
  const [confirmationPinCode, setConfirmationPinCode] = useState("");
  const [displayMismatchError, setDisplayMismatchError] = useState(false);
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formatedPinCode = value.replace(/\D/g, "");
    setConfirmationPinCode(formatedPinCode);
    if (e.target.value.length !== PIN_CODE_LENGTH) {
      setDisplayMismatchError(false);
      return;
    } else if (e.target.value !== pinCode) {
      setDisplayMismatchError(true);
    }
  };
  const handleCancel = () => {
    onCancel();
    logEvent(new UserUseAccountRecoveryKeyEvent({ flowStep: FlowStep.Cancel }));
    redirect(LOGIN_URL_SEGMENT);
  };
  return (
    <Flex flexDirection="column" gap="24px">
      <ExpressiveIcon name="PinCodeOutlined" size="xlarge" mood="brand" />
      <Paragraph color="ds.text.neutral.quiet" sx={{ marginBottom: "8px" }}>
        {translate(I18N_KEYS.ACCOUNT_RECOVERY_STEP_COUNT, {
          count: 3,
          total: 3,
        })}
      </Paragraph>
      <Heading as="h1" textStyle="ds.title.section.large">
        {translate(I18N_KEYS.CONFIRM_PIN_CODE_TITLE)}
      </Heading>
      <FlexContainer flexDirection="column" gap="8px">
        <Paragraph
          color="ds.text.neutral.quiet"
          textStyle="ds.body.helper.regular"
        >
          {translate(I18N_KEYS.PIN_INPUT_LABEL)}
        </Paragraph>
        <PincodeInput
          pincode={confirmationPinCode}
          onPincodeInputChange={onInputChange}
          displayMismatchError={displayMismatchError}
          mismatchErrorMessage={translate(I18N_KEYS.PIN_MISMATCH)}
        />
      </FlexContainer>
      <Flex justifyContent="flex-end" sx={{ width: "100%" }}>
        <Button
          intensity="quiet"
          mood="neutral"
          sx={{ marginRight: "8px" }}
          onClick={handleCancel}
        >
          {translate(I18N_KEYS.CONFIRM_ARK_STEP_CANCEL)}
        </Button>
        <Button
          mood="brand"
          disabled={pinCode !== confirmationPinCode}
          icon="ArrowRightOutlined"
          layout="iconTrailing"
          onClick={() => onSubmitPin({ pinCode })}
        >
          {translate(I18N_KEYS.PROCEED_TO_ARK_SETUP_BUTTON)}
        </Button>
      </Flex>
    </Flex>
  );
};
