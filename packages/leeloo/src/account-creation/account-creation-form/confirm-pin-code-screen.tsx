import { useRef, useState } from "react";
import { CreateAccountNetworkError } from "@dashlane/account-contracts";
import { device } from "@dashlane/browser-utils";
import {
  Button,
  Checkbox,
  ExpressiveIcon,
  Flex,
  Heading,
  Paragraph,
  TextField,
  useToast,
} from "@dashlane/design-system";
import { isSuccess, match, Result } from "@dashlane/framework-types";
import useTranslate from "../../libs/i18n/useTranslate";
import { PIN_CODE_LENGTH } from "../../pin-code/constants";
import { PincodeInput } from "../../pin-code/pin-code-input";
const I18N_KEYS = {
  CONFIRM_PIN_CODE_TITLE:
    "webapp_auth_panel_account_creation_passwordless_confirm_pin_title",
  LOGIN_EMAIL_LABEL:
    "webapp_auth_panel_account_creation_passwordless_login_email_label",
  PIN_INPUT_LABEL:
    "webapp_auth_panel_account_creation_passwordless_pin_input_label",
  TIPS_AND_OFFERS_LABEL:
    "webapp_auth_panel_standalone_account_creation_tips_and_offers_label",
  TERMS_OF_SERVICE_LABEL:
    "webapp_auth_panel_standalone_account_creation_tos_markup",
  PIN_MISMATCH:
    "webapp_auth_panel_account_creation_passwordless_confirm_pin_mismatch_error",
  CONFIRM_BUTTON:
    "webapp_auth_panel_account_creation_passwordless_confirm_pin_submit_button",
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
const CHECKBOX_SX = {
  "& span": { fontSize: "13px" },
};
interface ConfirmPinCodeScreenProps {
  loginEmail: string;
  pinCode: string;
  isEu: boolean | null;
  onConfirmPin: (params: {
    email: string;
    pinCode: string;
    deviceName: string;
    consents: {
      offers: boolean;
      tosAndPrivacy: boolean;
    };
  }) => Promise<Result<undefined, CreateAccountNetworkError>>;
}
export const ConfirmPinCodeScreen = ({
  loginEmail,
  pinCode,
  isEu,
  onConfirmPin,
}: ConfirmPinCodeScreenProps) => {
  const { translate } = useTranslate();
  const [confirmationPinCode, setConfirmationPinCode] = useState("");
  const [displayMismatchError, setDisplayMismatchError] = useState(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const toastRef = useRef<string>();
  const { showToast, closeToast } = useToast();
  const [isEmailsTipsAndOffersChecked, setIsEmailsTipsAndOffersChecked] =
    useState<boolean | undefined>(!isEu);
  const [isTosAccepted, setIsTosAccepted] = useState<boolean | undefined>(
    !isEu
  );
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
  const handleConfirmPinCode = async () => {
    if (pinCode !== confirmationPinCode || !isTosAccepted) {
      return;
    }
    if (toastRef.current) {
      closeToast(toastRef.current);
    }
    setIsCreatingAccount(true);
    try {
      const r = await onConfirmPin({
        email: loginEmail,
        pinCode,
        deviceName: device.getDefaultDeviceName(),
        consents: {
          offers: Boolean(isEmailsTipsAndOffersChecked),
          tosAndPrivacy: Boolean(isTosAccepted),
        },
      });
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
      setIsCreatingAccount(false);
    }
  };
  return (
    <Flex sx={{ margin: "0px 80px" }} flexDirection="column" gap="24px">
      <Flex flexDirection="column" gap="16px">
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
      </Flex>
      <Flex flexDirection="column" gap="5px">
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
          onSubmit={() => handleConfirmPinCode()}
        />
      </Flex>
      <Flex flexDirection="column" gap="12px">
        <Checkbox
          sx={CHECKBOX_SX}
          name="emailsTipsAndOffers"
          onChange={(ev) => setIsEmailsTipsAndOffersChecked(ev.target.checked)}
          checked={isEmailsTipsAndOffersChecked}
          label={translate(I18N_KEYS.TIPS_AND_OFFERS_LABEL)}
        />
        <Checkbox
          sx={CHECKBOX_SX}
          name="privacyPolicyAndToS"
          onChange={(ev) => setIsTosAccepted(ev.target.checked)}
          checked={isTosAccepted}
          label={translate.markup(
            I18N_KEYS.TERMS_OF_SERVICE_LABEL,
            {},
            {
              linkTarget: "_blank",
            }
          )}
        />
      </Flex>
      <Button
        mood="brand"
        disabled={
          pinCode !== confirmationPinCode || !isTosAccepted || isCreatingAccount
        }
        icon="ArrowRightOutlined"
        layout="iconTrailing"
        fullsize={true}
        onClick={handleConfirmPinCode}
        isLoading={isCreatingAccount}
      >
        {translate(I18N_KEYS.CONFIRM_BUTTON)}
      </Button>
    </Flex>
  );
};
