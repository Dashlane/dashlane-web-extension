import { ChangeEvent, useState } from "react";
import { Result } from "@dashlane/framework-types";
import { RECOVERY_KEY_LENGTH } from "../../webapp/account/constants";
export function useAccountRecoveryKeyInputRecoveryFlow(
  clearInputErrorCallback: () => Promise<Result<undefined>>
) {
  const [inputValue, setInputValue] = useState<string>("");
  const handleChangeInputValue = (
    eventOrValue:
      | ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
      | string
  ) => {
    clearInputErrorCallback();
    const updatedValue =
      typeof eventOrValue === "string"
        ? eventOrValue
        : eventOrValue.target.value;
    const value = updatedValue.replaceAll("-", "").toUpperCase();
    setInputValue(value);
  };
  return {
    inputValue,
    isInputValid: inputValue.length === RECOVERY_KEY_LENGTH,
    handleChangeInputValue,
  };
}
