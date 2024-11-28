import React from "react";
import { TokenInput } from "./token-input";
import { jsx, Paragraph } from "@dashlane/design-system";
import useTranslate from "../../../libs/i18n/useTranslate";
interface Props {
  pincode: string;
  pinLength: number;
  onPincodeInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  displayMismatchError?: boolean | string;
  mismatchErrorMessage?: string;
  disabled?: boolean;
}
const I18N_KEYS = {
  PIN_CODE_INPUT_LABEL: "login/form_pin_title",
};
const DESCRIPTION_LABEL_ID = "securityCodeInstruction";
export const PincodeInput = ({
  pincode,
  pinLength,
  onPincodeInputChange,
  displayMismatchError,
  mismatchErrorMessage,
  disabled,
}: Props) => {
  const { translate } = useTranslate();
  return (
    <>
      <Paragraph
        id={DESCRIPTION_LABEL_ID}
        color="ds.text.neutral.quiet"
        textStyle="ds.body.helper.regular"
        sx={{
          marginBottom: "16px",
        }}
      >
        {translate(I18N_KEYS.PIN_CODE_INPUT_LABEL)}
      </Paragraph>
      <TokenInput
        autoFocus
        value={pincode}
        maxLength={pinLength}
        inputMode="numeric"
        id="pincode-input"
        onChange={onPincodeInputChange}
        feedbackType={displayMismatchError ? "error" : undefined}
        feedbackText={mismatchErrorMessage}
        type="password"
        onPaste={(e) => {
          e.preventDefault();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
        data-testid="pin-code-input"
        disabled={disabled}
      />
    </>
  );
};
