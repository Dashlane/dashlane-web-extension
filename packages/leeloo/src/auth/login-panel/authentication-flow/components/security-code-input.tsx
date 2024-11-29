import { Paragraph } from "@dashlane/design-system";
import { TokenInput } from "./token-input";
interface Props {
  securityToken: string;
  maxLength: number;
  title: string;
  onTokenInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  errorMessage?: string;
  type?: "password" | "text";
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
  type,
  disabled,
  "data-testid": dataTestId = "token-input",
}: Props) => {
  return (
    <>
      <Paragraph
        id={DESCRIPTION_LABEL_ID}
        color="ds.text.neutral.quiet"
        style={{ marginBottom: "16px" }}
      >
        {title}
      </Paragraph>

      <TokenInput
        autoFocus
        value={securityToken}
        maxLength={maxLength}
        inputMode="numeric"
        id={TOKEN_INPUT_TEST_ID}
        onChange={onTokenInputChange}
        feedbackType={errorMessage ? "error" : undefined}
        feedbackText={errorMessage}
        aria-labelledby={DESCRIPTION_LABEL_ID}
        type={type}
        disabled={disabled}
        data-testid={dataTestId}
      />
    </>
  );
};
