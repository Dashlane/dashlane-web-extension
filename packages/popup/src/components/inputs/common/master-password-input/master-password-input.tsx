import * as React from "react";
import { colors, HideIcon, RevealIcon } from "@dashlane/ui-components";
import InputWithMessageWithWrapper, {
  MessageType,
} from "../../login/InputWithMessageWrapper";
import FormInput from "../../login/FormInput";
import { ThemeEnum } from "../../../../libs/helpers-types";
import useTranslate from "../../../../libs/i18n/useTranslate";
import styles from "./styles.css";
const ERROR_I18N_KEYS = {
  EMPTY_MASTER_PASSWORD: "login/security_code_error_empty_password",
  NETWORK_ERROR: "login/security_code_error_network_error",
  WRONG_PASSWORD: "login/security_code_error_wrong_password",
  UNKNOWN_ERROR: "login/security_code_error_unkown",
  UNKNOWN_SYNC_ERROR: "login/error_sync_unknown",
};
const I18N_KEYS = {
  HIDE_PASSWORD: "login/password_hide_svg_title",
  PLACEHOLDER: "login/password_placeholder",
  SHOW_PASSWORD: "login/password_show_svg_title",
};
interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  password: string;
  showPassword: boolean;
  isDisabled?: boolean;
  handlePasswordInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleShowPassword: () => void;
  theme?: ThemeEnum;
}
const MasterPasswordInput: React.FunctionComponent<Props> = ({
  error,
  password,
  showPassword,
  isDisabled,
  handlePasswordInputChange,
  handleShowPassword,
  theme,
}) => {
  const { translate } = useTranslate();
  const handleKeyDownOnShowPassword = React.useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleShowPassword();
      }
    },
    [handleShowPassword]
  );
  const handleMouseDownPassword = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
    },
    []
  );
  const iconColor =
    theme === ThemeEnum.Light ? colors.dashGreen00 : colors.white;
  return (
    <InputWithMessageWithWrapper
      type={MessageType.Error}
      message={
        error &&
        translate(
          error in ERROR_I18N_KEYS
            ? ERROR_I18N_KEYS[error as keyof typeof ERROR_I18N_KEYS]
            : ERROR_I18N_KEYS.UNKNOWN_ERROR
        )
      }
      theme={theme}
    >
      <FormInput
        value={password}
        handleChange={handlePasswordInputChange}
        hasError={!!error}
        placeholder={translate(I18N_KEYS.PLACEHOLDER)}
        inputType={showPassword ? "text" : "password"}
        ariaLabelledBy={"password_label"}
        required={true}
        isDisabled={isDisabled}
        hasSecretInputStyle
        theme={theme}
      >
        <button
          className={styles.inputButton}
          onClick={handleShowPassword}
          onKeyDown={handleKeyDownOnShowPassword}
          onMouseDown={handleMouseDownPassword}
          type="button"
        >
          {showPassword ? (
            <HideIcon
              color={iconColor}
              title={translate(I18N_KEYS.HIDE_PASSWORD)}
            />
          ) : (
            <RevealIcon
              color={iconColor}
              title={translate(I18N_KEYS.SHOW_PASSWORD)}
            />
          )}
        </button>
      </FormInput>
    </InputWithMessageWithWrapper>
  );
};
export default React.memo(MasterPasswordInput);
