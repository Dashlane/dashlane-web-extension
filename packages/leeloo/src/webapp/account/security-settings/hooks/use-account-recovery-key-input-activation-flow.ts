import { ChangeEvent, useState } from "react";
import {
  CreateKeyErrorName,
  FlowStep,
  UserCreateAccountRecoveryKeyEvent,
} from "@dashlane/hermes";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { logEvent } from "../../../../libs/logs/logEvent";
import { RECOVERY_KEY_LENGTH } from "../../constants";
const I18N_KEYS = {
  ARK_ACTIVATION_DISPLAY_KEY_STEP_WRONG_KEY:
    "webapp_account_recovery_key_third_step_wrong_key_error",
};
export function useAccountRecoveryKeyInputActivationFlow(recoveryKey: string) {
  const { translate } = useTranslate();
  const [inputValue, setInputValue] = useState<string>("");
  const [inputError, setInputError] = useState<string>("");
  const logUserCreateAccountRecoveryKeyEvent = () => {
    void logEvent(
      new UserCreateAccountRecoveryKeyEvent({
        flowStep: FlowStep.Error,
        createKeyErrorName: CreateKeyErrorName.WrongConfirmationKey,
      })
    );
  };
  const handleChangeInputValue = (
    eventOrValue:
      | ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
      | string
  ) => {
    const updatedValue =
      typeof eventOrValue === "string"
        ? eventOrValue
        : eventOrValue.target.value;
    const value = updatedValue.replaceAll("-", "").toUpperCase();
    setInputError("");
    if (value.length === RECOVERY_KEY_LENGTH && value !== recoveryKey) {
      setInputError(
        translate(I18N_KEYS.ARK_ACTIVATION_DISPLAY_KEY_STEP_WRONG_KEY)
      );
      logUserCreateAccountRecoveryKeyEvent();
    }
    setInputValue(value);
  };
  return {
    inputValue,
    inputError,
    isInputValid: inputValue.length === RECOVERY_KEY_LENGTH && !inputError,
    handleChangeInputValue,
  };
}
