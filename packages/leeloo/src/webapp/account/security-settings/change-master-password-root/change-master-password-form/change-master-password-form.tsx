import React, { useState } from "react";
import styles from "./change-master-password-form.css";
import { ChangeMasterPasswordError, PageView } from "@dashlane/hermes";
import { Button, LinkButton, PasswordField } from "@dashlane/design-system";
import {
  logChangeMasterPasswordCancel,
  logChangeMasterPasswordError,
  logChangeMasterPasswordStart,
} from "../logs";
import { SettingsSection } from "../../security-settings-root/settings-section/settings-section";
import { AccountSubPanel } from "../../../account-subpanel/account-subpanel";
import { carbonConnector } from "../../../../../libs/carbon/connector";
import useTranslate from "../../../../../libs/i18n/useTranslate";
import { logPageView } from "../../../../../libs/logs/logEvent";
import { usePasswordStrength } from "../../../../../libs/password-evaluation/usePasswordStrength";
import { ChangeMasterPasswordConsequencesInfobox } from "../consequences-infobox/change-master-password-consequences-infobox";
enum ErrorTypes {
  WRONG_PASSWORD_ERROR = "wrong_password",
  PASSWORDS_DONT_MATCH_ERROR = "passwords_dont_match",
  WEAK_PASSWORD_ERROR = "weak_password",
  SAME_MASTER_PASSWORD = "same_master_password",
}
export interface Props {
  onNavigateOut: () => void;
  onShowPasswordTips: () => void;
  onConfirmChangeMasterPassword: (
    currentPassword: string,
    newPassword: string
  ) => void;
}
export const I18N_KEYS = {
  HEADING: "webapp_account_security_settings_changemp_panel_heading",
  SUB_TITLE: "webapp_account_security_settings_changemp_panel_subtitle",
  INFO_TEXT: "webapp_account_security_settings_changemp_panel_infotext",
  CURRENTMP: "webapp_account_security_settings_changemp_panel_currentmp",
  NEWMP: "webapp_account_security_settings_changemp_panel_newmp",
  CONFIRMMP: "webapp_account_security_settings_changemp_panel_confirmmp",
  SHOW_PASSWORD_LABEL:
    "webapp_account_security_settings_changemp_panel_show_label",
  HIDE_PASSWORD_LABEL:
    "webapp_account_security_settings_changemp_panel_hide_label",
  BUTTON_CONFIRM:
    "webapp_account_security_settings_changemp_panel_button_confirm",
  ERROR_PW_DONT_MATCH:
    "webapp_account_security_settings_changemp_panel_error_pw_dont_match",
  ERROR_INCORRECT_MP:
    "webapp_account_security_settings_changemp_panel_error_incorrect_mp",
  ERROR_WEAK_PW:
    "webapp_account_security_settings_changemp_panel_error_weak_pw",
  ERROR_SAME_PASSWORD:
    "webapp_account_security_settings_changemp_panel_error_same_pw",
  PASSWORD_STRENGTH: {
    0: "webapp_account_security_settings_zxcvbn_weakest_password",
    1: "webapp_account_security_settings_zxcvbn_weak_password",
    2: "webapp_account_security_settings_zxcvbn_acceptable_password",
    3: "webapp_account_security_settings_zxcvbn_good_password",
    4: "webapp_account_security_settings_zxcvbn_awesome_password",
  },
};
export const ChangeMasterPasswordForm = ({
  onNavigateOut,
  onShowPasswordTips,
  onConfirmChangeMasterPassword,
}: Props) => {
  const { translate } = useTranslate();
  const [changeMPinProgress, setChangeMPinProgress] = useState(false);
  React.useEffect(() => {
    logPageView(PageView.SettingsSecurityChangeMasterPassword);
    logChangeMasterPasswordStart();
  }, []);
  const [currentPasswordValue, setCurrentPasswordValue] = useState("");
  const [currentPasswordErrorType, setCurrentPasswordErrorType] =
    useState<ErrorTypes.WRONG_PASSWORD_ERROR | null>(null);
  const [createPasswordValue, setCreatePasswordValue] = useState("");
  const [createPasswordErrorType, setCreatePasswordErrorType] = useState<
    ErrorTypes.WEAK_PASSWORD_ERROR | ErrorTypes.SAME_MASTER_PASSWORD | null
  >(null);
  const {
    passwordStrength,
    resetPasswordStrength,
    setPasswordStrength,
    isPasswordStrengthScore,
    isPasswordStrongEnough,
  } = usePasswordStrength();
  const [confirmPasswordValue, setConfirmPasswordValue] = useState("");
  const [confirmPasswordErrorType, setConfirmPasswordErrorType] =
    useState<ErrorTypes.PASSWORDS_DONT_MATCH_ERROR | null>(null);
  const handleCurrentPasswordBlurred = async () => {
    if (!currentPasswordValue) {
      return;
    }
    try {
      const { isMasterPasswordValid } =
        await carbonConnector.checkIfMasterPasswordIsValid({
          masterPassword: currentPasswordValue,
        });
      if (!isMasterPasswordValid) {
        logChangeMasterPasswordError(
          ChangeMasterPasswordError.WrongPasswordError
        );
        setCurrentPasswordErrorType(ErrorTypes.WRONG_PASSWORD_ERROR);
      }
    } catch (e) {
      logChangeMasterPasswordError(
        ChangeMasterPasswordError.WrongPasswordError
      );
      setCurrentPasswordErrorType(ErrorTypes.WRONG_PASSWORD_ERROR);
    }
  };
  const handleCurrentPasswordChanged = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const current = event.target.value;
    setCurrentPasswordErrorType(null);
    setCurrentPasswordValue(current);
    if (
      createPasswordErrorType === ErrorTypes.SAME_MASTER_PASSWORD &&
      createPasswordValue !== current
    ) {
      setCreatePasswordErrorType(null);
    }
  };
  const handleCreatePasswordBlurred = () => {
    if (!createPasswordValue) {
      return;
    }
    if (createPasswordValue && !isPasswordStrongEnough) {
      logChangeMasterPasswordError(ChangeMasterPasswordError.WeakPasswordError);
      setCreatePasswordErrorType(ErrorTypes.WEAK_PASSWORD_ERROR);
    } else if (createPasswordValue === currentPasswordValue) {
      logChangeMasterPasswordError(ChangeMasterPasswordError.SamePasswordError);
      setCreatePasswordErrorType(ErrorTypes.SAME_MASTER_PASSWORD);
    } else if (
      confirmPasswordValue &&
      createPasswordValue &&
      createPasswordValue !== confirmPasswordValue
    ) {
      logChangeMasterPasswordError(
        ChangeMasterPasswordError.PasswordsDontMatch
      );
      setConfirmPasswordErrorType(ErrorTypes.PASSWORDS_DONT_MATCH_ERROR);
    }
  };
  const handleCreatePasswordChanged = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const password = event.target.value;
    setCreatePasswordValue(password);
    if (createPasswordErrorType) {
      setCreatePasswordErrorType(null);
    }
    if (confirmPasswordErrorType) {
      setConfirmPasswordErrorType(null);
    }
    if (password !== "") {
      const strength = await carbonConnector.evaluatePassword({ password });
      if (strength) {
        setPasswordStrength(strength);
      }
    } else {
      resetPasswordStrength();
    }
  };
  const handleConfirmPasswordBlurred = () => {
    if (confirmPasswordValue && confirmPasswordValue !== createPasswordValue) {
      logChangeMasterPasswordError(
        ChangeMasterPasswordError.PasswordsDontMatch
      );
      setConfirmPasswordErrorType(ErrorTypes.PASSWORDS_DONT_MATCH_ERROR);
    }
  };
  const handleConfirmPasswordChanged = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPasswordErrorType(null);
    setConfirmPasswordValue(event.target.value);
  };
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isPasswordStrongEnough) {
      logChangeMasterPasswordError(ChangeMasterPasswordError.WeakPasswordError);
      setCreatePasswordErrorType(ErrorTypes.WEAK_PASSWORD_ERROR);
    } else if (createPasswordValue === currentPasswordValue) {
      logChangeMasterPasswordError(ChangeMasterPasswordError.SamePasswordError);
      setCreatePasswordErrorType(ErrorTypes.SAME_MASTER_PASSWORD);
    } else if (createPasswordValue !== confirmPasswordValue) {
      logChangeMasterPasswordError(
        ChangeMasterPasswordError.PasswordsDontMatch
      );
      setConfirmPasswordErrorType(ErrorTypes.PASSWORDS_DONT_MATCH_ERROR);
    } else {
      setChangeMPinProgress(true);
      onConfirmChangeMasterPassword(currentPasswordValue, createPasswordValue);
    }
  };
  const handleShowPasswordTips = () => {
    onShowPasswordTips();
  };
  const isSubmitDisabled = () => {
    const isEmptyPasswords =
      !currentPasswordValue || !createPasswordValue || !confirmPasswordValue;
    const isSamePassword = confirmPasswordValue === createPasswordValue;
    const errorsPresent = Boolean(
      !!currentPasswordErrorType ||
        !!createPasswordErrorType ||
        !!confirmPasswordErrorType
    );
    return (
      isEmptyPasswords ||
      !isSamePassword ||
      !isPasswordStrongEnough ||
      errorsPresent ||
      changeMPinProgress
    );
  };
  return (
    <AccountSubPanel
      headingText={translate(I18N_KEYS.HEADING)}
      onNavigateOut={() => {
        logChangeMasterPasswordCancel();
        onNavigateOut();
      }}
    >
      <SettingsSection sectionTitle={translate(I18N_KEYS.SUB_TITLE)}>
        <LinkButton
          as="button"
          onClick={handleShowPasswordTips}
          sx={{ marginBottom: "24px" }}
        >
          {translate(I18N_KEYS.INFO_TEXT)}
        </LinkButton>
        <ChangeMasterPasswordConsequencesInfobox />
        <form autoComplete="off" noValidate={true} onSubmit={onSubmit}>
          <section className={styles.changePasswordSection}>
            <PasswordField
              label={translate(I18N_KEYS.CURRENTMP)}
              id={translate(I18N_KEYS.CURRENTMP)}
              toggleVisibilityLabel={{
                show: translate(I18N_KEYS.SHOW_PASSWORD_LABEL),
                hide: translate(I18N_KEYS.HIDE_PASSWORD_LABEL),
              }}
              onChange={handleCurrentPasswordChanged}
              onBlur={handleCurrentPasswordBlurred}
              value={currentPasswordValue}
              error={
                currentPasswordErrorType === ErrorTypes.WRONG_PASSWORD_ERROR
              }
              feedback={
                currentPasswordErrorType === ErrorTypes.WRONG_PASSWORD_ERROR
                  ? {
                      id: "current-password-feedback-text",
                      text: translate(I18N_KEYS.ERROR_INCORRECT_MP),
                    }
                  : undefined
              }
            />

            <PasswordField
              label={translate(I18N_KEYS.NEWMP)}
              id={translate(I18N_KEYS.NEWMP)}
              toggleVisibilityLabel={{
                show: translate(I18N_KEYS.SHOW_PASSWORD_LABEL),
                hide: translate(I18N_KEYS.HIDE_PASSWORD_LABEL),
              }}
              onChange={handleCreatePasswordChanged}
              onBlur={handleCreatePasswordBlurred}
              value={createPasswordValue}
              error={createPasswordErrorType === ErrorTypes.WEAK_PASSWORD_ERROR}
              feedback={
                createPasswordErrorType === ErrorTypes.WEAK_PASSWORD_ERROR
                  ? translate(I18N_KEYS.ERROR_WEAK_PW)
                  : createPasswordErrorType === ErrorTypes.SAME_MASTER_PASSWORD
                  ? translate(I18N_KEYS.ERROR_SAME_PASSWORD)
                  : undefined
              }
              passwordStrength={
                !createPasswordErrorType &&
                passwordStrength &&
                isPasswordStrengthScore(passwordStrength.score)
                  ? {
                      description: translate(
                        `${I18N_KEYS.PASSWORD_STRENGTH[passwordStrength.score]}`
                      ),
                      descriptionId: "password-tooltip",
                      score: passwordStrength.score,
                    }
                  : undefined
              }
            />

            <PasswordField
              label={translate(I18N_KEYS.CONFIRMMP)}
              id={translate(I18N_KEYS.CONFIRMMP)}
              toggleVisibilityLabel={{
                show: translate(I18N_KEYS.SHOW_PASSWORD_LABEL),
                hide: translate(I18N_KEYS.HIDE_PASSWORD_LABEL),
              }}
              onChange={handleConfirmPasswordChanged}
              onBlur={handleConfirmPasswordBlurred}
              value={confirmPasswordValue}
              error={!!confirmPasswordErrorType}
              feedback={
                confirmPasswordErrorType
                  ? translate(I18N_KEYS.ERROR_PW_DONT_MATCH)
                  : undefined
              }
            />
          </section>
          <section className={styles.actionsSection}>
            <Button type="submit" disabled={isSubmitDisabled()}>
              {translate(I18N_KEYS.BUTTON_CONFIRM)}
            </Button>
          </section>
        </form>
      </SettingsSection>
    </AccountSubPanel>
  );
};
