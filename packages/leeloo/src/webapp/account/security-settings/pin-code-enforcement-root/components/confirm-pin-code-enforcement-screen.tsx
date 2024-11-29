import { useRef, useState } from "react";
import {
  Button,
  ExpressiveIcon,
  Heading,
  Paragraph,
  TextField,
  useToast,
} from "@dashlane/design-system";
import { isSuccess, match, Result } from "@dashlane/framework-types";
import { FlexContainer } from "@dashlane/ui-components";
import { CreateAccountNetworkError } from "@dashlane/account-contracts";
import useTranslate from "../../../../../libs/i18n/useTranslate";
import { PIN_CODE_LENGTH } from "../../../../../pin-code/constants";
import { PincodeInput } from "../../../../../pin-code/pin-code-input";
import { useShouldEnforceArk } from "../../account-recovery-root/hooks/use-should-enforce-ark";
const I18N_KEYS = {
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
  CONFIRM_AND_ACCESS_VAULT_BUTTON:
    "webapp_auth_panel_account_creation_passwordless_activate_pin_button",
  GENERIC_ERROR: "_common_generic_error",
  NETWORK_ERROR: "_common_alert_network_error_message",
};
const TEXT_FIELD_SX = {
  width: "100%",
  backgroundColor: "ds.container.agnostic.neutral.quiet",
  border: "none",
  "& span": { color: "ds.text.neutral.quiet" },
  "& input": {
    color: "ds.text.neutral.catchy",
  },
};
interface ConfirmPinCodeEnforcementScreenProps {
  loginEmail: string;
  pinCode: string;
  onActivatePin: (params: {
    pinCode: string;
  }) => Promise<Result<undefined, CreateAccountNetworkError>>;
}
export const ConfirmPinCodeEnforcementScreen = ({
  loginEmail,
  pinCode,
  onActivatePin,
}: ConfirmPinCodeEnforcementScreenProps) => {
  const { translate } = useTranslate();
  const [confirmationPinCode, setConfirmationPinCode] = useState("");
  const [displayMismatchError, setDisplayMismatchError] = useState(false);
  const [isActivatingPin, setIsActivatingPin] = useState(false);
  const { shouldEnforce: isPinSetupAfterARK } = useShouldEnforceArk();
  const toastRef = useRef<string>();
  const { showToast, closeToast } = useToast();
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (toastRef.current) {
      closeToast(toastRef.current);
    }
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
  const handleActivatePinCode = async () => {
    if (pinCode !== confirmationPinCode) {
      return;
    }
    if (toastRef.current) {
      closeToast(toastRef.current);
    }
    setIsActivatingPin(true);
    try {
      const r = await onActivatePin({ pinCode });
      if (!isSuccess(r)) {
        match(r.error, {
          NetworkError: () => {
            const toast = showToast({
              mood: "danger",
              description: translate(I18N_KEYS.NETWORK_ERROR),
            });
            toastRef.current = toast;
          },
        });
      }
    } catch (error) {
      const toast = showToast({
        mood: "danger",
        description: translate(I18N_KEYS.GENERIC_ERROR),
      });
      toastRef.current = toast;
    } finally {
      setIsActivatingPin(false);
    }
  };
  return (
    <FlexContainer
      sx={{ margin: "0px 80px" }}
      flexDirection="column"
      gap="24px"
    >
      <FlexContainer flexDirection="column" gap="16px">
        <ExpressiveIcon name="PinCodeOutlined" size="xlarge" mood="brand" />
        <Heading as="h1" textStyle="ds.title.section.large">
          {translate(I18N_KEYS.CONFIRM_PIN_CODE_TITLE)}
        </Heading>
        <TextField
          sx={TEXT_FIELD_SX}
          label={translate(I18N_KEYS.LOGIN_EMAIL_LABEL)}
          value={loginEmail}
          disabled
        />
      </FlexContainer>
      <FlexContainer flexDirection="column" gap="5px">
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
          onSubmit={() => handleActivatePinCode()}
        />
      </FlexContainer>
      <Button
        mood="brand"
        disabled={pinCode !== confirmationPinCode || isActivatingPin}
        icon="ArrowRightOutlined"
        layout="iconTrailing"
        fullsize={true}
        onClick={handleActivatePinCode}
      >
        {isPinSetupAfterARK
          ? translate(I18N_KEYS.PROCEED_TO_ARK_SETUP_BUTTON)
          : translate(I18N_KEYS.CONFIRM_AND_ACCESS_VAULT_BUTTON)}
      </Button>
    </FlexContainer>
  );
};
