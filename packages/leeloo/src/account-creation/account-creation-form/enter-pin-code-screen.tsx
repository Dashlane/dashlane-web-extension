import {
  Button,
  ExpressiveIcon,
  Flex,
  Heading,
  Infobox,
  Paragraph,
  TextField,
} from "@dashlane/design-system";
import useTranslate from "../../libs/i18n/useTranslate";
import { PincodeInput } from "../../pin-code/pin-code-input";
import { useState } from "react";
import { PIN_CODE_LENGTH } from "../../pin-code/constants";
const I18N_KEYS = {
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
  NEXT_BUTTON: "webapp_auth_panel_account_creation_passwordless_next_button",
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
interface EnterPinCodeScreenProps {
  loginEmail: string;
  onEnterPin: (pinCode: string) => void;
}
export const EnterPinCodeScreen = ({
  loginEmail,
  onEnterPin,
}: EnterPinCodeScreenProps) => {
  const { translate } = useTranslate();
  const [pinCode, setPincode] = useState("");
  const handlePinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formatedPinCode = value.replace(/\D/g, "");
    setPincode(formatedPinCode);
  };
  return (
    <Flex sx={{ margin: "0px 80px" }} flexDirection="column" gap="24px">
      <Flex flexDirection="column" gap="16px">
        <ExpressiveIcon name="PinCodeOutlined" size="xlarge" mood="brand" />
        <Heading as="h1" textStyle="ds.title.section.large">
          {translate(I18N_KEYS.ENTER_PIN_CODE_TITLE)}
        </Heading>
        <Paragraph>{translate(I18N_KEYS.ENTER_PIN_CODE_SUBTITLE)}</Paragraph>
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
          pincode={pinCode}
          onPincodeInputChange={handlePinInputChange}
          onSubmit={() => onEnterPin(pinCode)}
        />
        <Infobox
          title={translate(I18N_KEYS.PIN_CODE_CREATION_TIPS)}
          mood="warning"
        />
      </Flex>
      <Button
        sx={{ marginTop: "32px" }}
        mood="brand"
        disabled={pinCode.length !== PIN_CODE_LENGTH}
        icon="ArrowRightOutlined"
        layout="iconTrailing"
        fullsize={true}
        onClick={() => {
          onEnterPin(pinCode);
        }}
      >
        {translate(I18N_KEYS.NEXT_BUTTON)}
      </Button>
    </Flex>
  );
};
