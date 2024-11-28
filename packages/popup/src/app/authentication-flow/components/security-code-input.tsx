import React, { Fragment } from "react";
import { jsx, Paragraph } from "@dashlane/design-system";
import { TokenInput } from "@dashlane/ui-components";
interface Props {
  securityToken: string;
  maxLength: number;
  title: string;
  onTokenInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  errorMessage?: string;
  type?: "text" | "password";
  disabled?: boolean;
  "data-testid"?: string;
}
const TOKEN_INPUT_TEST_ID = "security-code-input";
const DESCRIPTION_LABEL_ID = "securityCodeInstruction";
export const SecurityCodeInput = ({
  securityToken,
  maxLength,
  title,
  onTokenInputChange,
  errorMessage,
  type = "text",
  disabled,
  "data-testid": dataTestId = TOKEN_INPUT_TEST_ID,
}: Props) => {
  return (
    <>
      <Paragraph
        id={DESCRIPTION_LABEL_ID}
        color="ds.text.neutral.standard"
        sx={{
          marginBottom: "24px",
        }}
      >
        {title}
      </Paragraph>
      <TokenInput
        id="code"
        theme="primary"
        role="textbox"
        autoFocus
        value={securityToken}
        maxLength={maxLength}
        inputMode="numeric"
        data-testid={dataTestId}
        onChange={onTokenInputChange}
        feedbackType={errorMessage ? "error" : undefined}
        feedbackText={errorMessage}
        feedbackTextId="login-feedback-text"
        aria-labelledby={DESCRIPTION_LABEL_ID}
        type={type}
        disabled={disabled}
      />
    </>
  );
};
