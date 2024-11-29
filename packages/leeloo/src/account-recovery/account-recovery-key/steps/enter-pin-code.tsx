import {
  Button,
  ExpressiveIcon,
  Flex,
  Heading,
  Infobox,
  Paragraph,
} from "@dashlane/design-system";
import { FlexContainer } from "@dashlane/ui-components";
import { useState } from "react";
import useTranslate from "../../../libs/i18n/useTranslate";
import { PIN_CODE_LENGTH } from "../../../pin-code/constants";
import { PincodeInput } from "../../../pin-code/pin-code-input";
import { CreatePinRequest } from "@dashlane/account-recovery-contracts";
import { Result } from "@dashlane/framework-types";
import { FlowStep, UserUseAccountRecoveryKeyEvent } from "@dashlane/hermes";
import { LOGIN_URL_SEGMENT } from "../../../app/routes/constants";
import { logEvent } from "../../../libs/logs/logEvent";
import { redirect } from "../../../libs/router";
const I18N_KEYS = {
  ACCOUNT_RECOVERY_STEP_COUNT: "login_confirm_account_recovery_key_step_count",
  ENTER_PIN_CODE_TITLE:
    "webapp_auth_panel_account_creation_passwordless_enter_pin_title",
  ENTER_PIN_CODE_SUBTITLE:
    "webapp_auth_panel_account_creation_passwordless_enter_pin_subtitle",
  LOGIN_EMAIL_LABEL:
    "webapp_auth_panel_account_creation_passwordless_login_email_label",
  PIN_INPUT_LABEL:
    "webapp_auth_panel_account_creation_passwordless_pin_input_label",
  PIN_CODE_CREATION_TIPS:
    "webapp_auth_panel_account_creation_passwordless_pin_code_tips",
  CONFIRM_ARK_STEP_CANCEL: "_common_action_cancel",
  NEXT_BUTTON: "webapp_auth_panel_account_creation_passwordless_next_button",
};
interface EnterPinCodeProps {
  onCreatePin: (command: CreatePinRequest) => Promise<Result<undefined>>;
  onCancel: () => Promise<Result<undefined>>;
}
export const EnterPinCode = ({ onCreatePin, onCancel }: EnterPinCodeProps) => {
  const { translate } = useTranslate();
  const [pinCode, setPincode] = useState("");
  const handlePinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formatedPinCode = value.replace(/\D/g, "");
    setPincode(formatedPinCode);
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
          count: 2,
          total: 3,
        })}
      </Paragraph>
      <FlexContainer flexDirection="column" gap="16px">
        <Heading as="h1" textStyle="ds.title.section.large">
          {translate(I18N_KEYS.ENTER_PIN_CODE_TITLE)}
        </Heading>
        <Paragraph>{translate(I18N_KEYS.ENTER_PIN_CODE_SUBTITLE)}</Paragraph>
      </FlexContainer>
      <FlexContainer flexDirection="column" gap="8px">
        <Paragraph
          color="ds.text.neutral.quiet"
          textStyle="ds.body.helper.regular"
        >
          {translate(I18N_KEYS.PIN_INPUT_LABEL)}
        </Paragraph>
        <PincodeInput
          pincode={pinCode}
          onPincodeInputChange={handlePinInputChange}
        />
        <Infobox
          title={translate(I18N_KEYS.PIN_CODE_CREATION_TIPS)}
          mood="warning"
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
          disabled={pinCode.length !== PIN_CODE_LENGTH}
          icon="ArrowRightOutlined"
          layout="iconTrailing"
          onClick={() => onCreatePin({ pinCode })}
        >
          {translate(I18N_KEYS.NEXT_BUTTON)}
        </Button>
      </Flex>
    </Flex>
  );
};
