import classNames from "classnames";
import { useState } from "react";
import { Dialog, Infobox, Paragraph } from "@dashlane/design-system";
import useTranslate from "../../../../../../libs/i18n/useTranslate";
import { allIgnoreClickOutsideClassName } from "../../../../../../webapp/variables";
import { PIN_CODE_LENGTH } from "../../../../../../pin-code/constants";
import { PincodeInput } from "../../../../../../pin-code/pin-code-input";
interface EnterPinCodeProps {
  onNext: (pinCode: string) => void;
  onCancel: () => void;
}
const I18N_KEYS = {
  CANCEL_DIALOG: "_common_action_cancel",
  AVOID_SIMPLE_PINS:
    "webapp_security_settings_activate_pin_code_flow_avoid_simple_pins",
  NEXT: "webapp_security_settings_activate_pin_code_flow_next",
  TITLE: "webapp_security_settings_activate_pin_code_flow_enter_title",
  CONTENT: "webapp_security_settings_activate_pin_code_flow_enter_content",
};
export const EnterPinCode = ({ onCancel, onNext }: EnterPinCodeProps) => {
  const [pinCode, setPincode] = useState("");
  const { translate } = useTranslate();
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formatedPinCode = value.replace(/\D/g, "");
    setPincode(formatedPinCode);
  };
  const closeActionText = translate(I18N_KEYS.CANCEL_DIALOG);
  return (
    <Dialog
      isOpen
      dialogClassName={classNames(allIgnoreClickOutsideClassName)}
      title={translate(I18N_KEYS.TITLE)}
      closeActionLabel={closeActionText}
      onClose={onCancel}
      actions={{
        primary: {
          children: translate(I18N_KEYS.NEXT),
          onClick: () => {
            onNext(pinCode);
          },
          disabled: pinCode.length !== PIN_CODE_LENGTH,
        },
        secondary: {
          children: closeActionText,
          onClick: onCancel,
        },
      }}
    >
      <Paragraph textStyle="ds.body.standard.regular">
        {translate(I18N_KEYS.CONTENT)}
      </Paragraph>
      <PincodeInput
        pincode={pinCode}
        onPincodeInputChange={onInputChange}
        onSubmit={() => onNext(pinCode)}
      />
      <Infobox mood="warning" title={translate(I18N_KEYS.AVOID_SIMPLE_PINS)} />
    </Dialog>
  );
};
