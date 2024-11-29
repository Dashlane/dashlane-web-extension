import { Dialog, Paragraph } from "@dashlane/design-system";
import classNames from "classnames";
import { useState } from "react";
import useTranslate from "../../../../../../libs/i18n/useTranslate";
import { allIgnoreClickOutsideClassName } from "../../../../../../webapp/variables";
import { PIN_CODE_LENGTH } from "../../../../../../pin-code/constants";
import { PincodeInput } from "../../../../../../pin-code/pin-code-input";
interface ConfirmPinCodeProps {
  pinCode: string;
  onNext: () => void;
  onCancel: () => void;
  onBack: () => void;
}
const I18N_KEYS = {
  CANCEL_DIALOG: "_common_action_cancel",
  NEXT: "webapp_security_settings_activate_pin_code_flow_next",
  BACK: "webapp_security_settings_activate_pin_code_flow_back",
  PIN_MISMATCH: "webapp_security_settings_activate_pin_code_flow_pin_mismatch",
  TITLE: "webapp_security_settings_activate_pin_code_flow_confirm_title",
  CONTENT: "webapp_security_settings_activate_pin_code_flow_confirm_content",
};
export const ConfirmPinCode = ({
  onCancel,
  onNext,
  pinCode,
  onBack,
}: ConfirmPinCodeProps) => {
  const [tentativePincode, setTentativePincode] = useState("");
  const [displayMismatchError, setDisplayMismatchError] = useState(false);
  const { translate } = useTranslate();
  const cancelText = translate(I18N_KEYS.CANCEL_DIALOG);
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formatedPinCode = value.replace(/\D/g, "");
    setTentativePincode(formatedPinCode);
    if (e.target.value.length !== PIN_CODE_LENGTH) {
      setDisplayMismatchError(false);
      return;
    }
    if (e.target.value === pinCode) {
      onNext();
    } else {
      setDisplayMismatchError(true);
    }
  };
  return (
    <Dialog
      isOpen
      dialogClassName={classNames(allIgnoreClickOutsideClassName)}
      title={translate(I18N_KEYS.TITLE)}
      closeActionLabel={cancelText}
      onClose={onCancel}
      actions={{
        secondary: {
          children: translate(I18N_KEYS.BACK),
          onClick: onBack,
        },
      }}
    >
      <Paragraph textStyle="ds.body.standard.regular">
        {translate(I18N_KEYS.CONTENT)}
      </Paragraph>
      <PincodeInput
        pincode={tentativePincode}
        onPincodeInputChange={onInputChange}
        displayMismatchError={displayMismatchError}
        mismatchErrorMessage={translate(I18N_KEYS.PIN_MISMATCH)}
      />
    </Dialog>
  );
};
