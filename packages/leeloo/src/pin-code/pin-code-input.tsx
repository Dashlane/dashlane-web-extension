import { TokenInput } from "../auth/login-panel/authentication-flow/components/token-input";
import { PIN_CODE_LENGTH } from "./constants";
interface Props {
  pincode: string;
  onPincodeInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  displayMismatchError?: boolean | string | undefined;
  mismatchErrorMessage?: string;
  onSubmit?: () => void;
  disabled?: boolean;
}
export const PincodeInput = ({
  pincode,
  onPincodeInputChange,
  displayMismatchError,
  mismatchErrorMessage,
  onSubmit,
  disabled,
}: Props) => {
  return (
    <TokenInput
      sx={{ marginTop: "12px" }}
      data-autofocus
      autoFocus
      value={pincode}
      maxLength={PIN_CODE_LENGTH}
      inputMode="numeric"
      id="pincode-input"
      onChange={onPincodeInputChange}
      feedbackType={displayMismatchError ? "error" : undefined}
      feedbackText={mismatchErrorMessage}
      type="password"
      data-testid="pin-code-input"
      onPaste={(e) => {
        e.preventDefault();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          if (onSubmit && pincode.length === PIN_CODE_LENGTH) {
            onSubmit();
          }
        }
      }}
      disabled={disabled}
    />
  );
};
