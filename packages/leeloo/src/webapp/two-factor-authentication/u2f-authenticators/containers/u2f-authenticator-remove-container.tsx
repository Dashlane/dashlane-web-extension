import { AlertSeverity, Dialog } from "@dashlane/ui-components";
import React, { useEffect, useState } from "react";
import classnames from "classnames";
import { allIgnoreClickOutsideClassName } from "../../../variables";
import { U2FAuthenticatorRemoveWarningDialogContent } from "../components/remove-u2f-authenticator-dialog/u2f-authenticator-remove-warning-dialog-content";
import {
  TwoFactorAuthenticationBackupCodeDialog,
  TwoFactorAuthenticationCodeDialog,
} from "../../components/two-factor-authentication-dialog";
import { useAlert } from "../../../../libs/alert-notifications/use-alert";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { removeU2FAuthenticator } from "../../services";
import {
  AuthenticationCode as AuthenticationErrorCode,
  type RemoveU2FAuthenticatorError,
} from "@dashlane/communication";
import {
  logDeleteU2FAuthenticatorCancel,
  logDeleteU2FAuthenticatorComplete,
  logDeleteU2FAuthenticatorError,
  logDeleteU2FAuthenticatorStart,
} from "../logs/logs";
import { TwoFactorAuthenticationError as TwoFactorAuthenticationLogError } from "@dashlane/hermes";
import { useUserLogin } from "../../../../libs/hooks/useUserLogin";
const I18N_KEYS = {
  SUCCESS_TOAST: "webapp_u2f_remove_authenticator_success",
  CLOSE: "_common_dialog_dismiss_button",
  OTP_NOT_VALID:
    "webapp_account_security_settings_two_factor_authentication_turn_off_authenticator_invalid_security_code",
  BACKUP_CODE_NOT_VALID:
    "webapp_account_security_settings_two_factor_authentication_backup_code_invalid_security_code",
  CODE_ALREADY_USED:
    "webapp_login_form_password_fieldset_security_code_error_otp_already_used",
  TOO_MANY_ATTEMPTS:
    "webapp_login_form_password_fieldset_security_code_error_token_too_many_attempts",
  GENERIC_ERROR:
    "webapp_account_security_settings_two_factor_authentication_turn_off_authenticator_generic_error",
  NETWORK_ERROR: "_common_alert_network_error_message",
};
interface Props {
  onDialogClose: () => void;
  keyHandle: string;
}
enum U2FRemoveAuthenticatorStages {
  WARNING,
  AUTHENTICATION_CODE,
  BACKUP_CODE,
}
const U2FRemoveAuthenticatorStageErrors = {
  [U2FRemoveAuthenticatorStages.AUTHENTICATION_CODE]: {
    [AuthenticationErrorCode.OTP_NOT_VALID]: {
      message: I18N_KEYS.OTP_NOT_VALID,
      logErrorName: TwoFactorAuthenticationLogError.WrongCodeError,
    },
    [AuthenticationErrorCode.OTP_ALREADY_USED]: {
      message: I18N_KEYS.CODE_ALREADY_USED,
      logErrorName: TwoFactorAuthenticationLogError.UnknownError,
    },
    [AuthenticationErrorCode.OTP_TOO_MANY_ATTEMPTS]: {
      message: I18N_KEYS.TOO_MANY_ATTEMPTS,
      logErrorName: TwoFactorAuthenticationLogError.UnknownError,
    },
    [AuthenticationErrorCode.NETWORK_ERROR]: {
      message: I18N_KEYS.NETWORK_ERROR,
      logErrorName: TwoFactorAuthenticationLogError.UserOfflineError,
    },
  },
  [U2FRemoveAuthenticatorStages.BACKUP_CODE]: {
    [AuthenticationErrorCode.OTP_NOT_VALID]: {
      message: I18N_KEYS.BACKUP_CODE_NOT_VALID,
      logErrorName: TwoFactorAuthenticationLogError.WrongBackupCodeError,
    },
    [AuthenticationErrorCode.OTP_ALREADY_USED]: {
      message: I18N_KEYS.CODE_ALREADY_USED,
      logErrorName: TwoFactorAuthenticationLogError.UnknownError,
    },
    [AuthenticationErrorCode.OTP_TOO_MANY_ATTEMPTS]: {
      message: I18N_KEYS.TOO_MANY_ATTEMPTS,
      logErrorName: TwoFactorAuthenticationLogError.UnknownError,
    },
    [AuthenticationErrorCode.NETWORK_ERROR]: {
      message: I18N_KEYS.NETWORK_ERROR,
      logErrorName: TwoFactorAuthenticationLogError.UserOfflineError,
    },
  },
  GenericError: {
    message: I18N_KEYS.GENERIC_ERROR,
    logErrorName: TwoFactorAuthenticationLogError.UnknownError,
  },
};
export const U2FAuthenticatorRemoveContainer = ({
  onDialogClose,
  keyHandle,
}: Props) => {
  const login = useUserLogin() ?? "";
  const { translate } = useTranslate();
  const successAlert = useAlert();
  const [stage, setStage] = useState<U2FRemoveAuthenticatorStages>(
    U2FRemoveAuthenticatorStages.WARNING
  );
  const [error, setError] = useState<
    | {
        message: string;
        code: AuthenticationErrorCode | RemoveU2FAuthenticatorError;
      }
    | undefined
  >();
  const onComplete = () => {
    logDeleteU2FAuthenticatorComplete();
    onDialogClose();
  };
  const onCancel = () => {
    logDeleteU2FAuthenticatorCancel();
    onDialogClose();
  };
  const continueToAuthenticationStage = () => {
    setStage(U2FRemoveAuthenticatorStages.AUTHENTICATION_CODE);
    return Promise.resolve();
  };
  const submitFinalStage = async ({
    authenticationCode,
  }: {
    authenticationCode: string;
  }) => {
    const response = await removeU2FAuthenticator(
      authenticationCode,
      keyHandle
    );
    if (!response.success && response.error) {
      const stageErrors = U2FRemoveAuthenticatorStageErrors[stage];
      const errorCode = response.error.code;
      if (stageErrors[errorCode]) {
        setError({
          message: stageErrors[errorCode].message,
          code: errorCode,
        });
        logDeleteU2FAuthenticatorError(stageErrors[errorCode].logErrorName);
      } else {
        setError({
          message: U2FRemoveAuthenticatorStageErrors.GenericError.message,
          code: errorCode,
        });
        logDeleteU2FAuthenticatorError(
          U2FRemoveAuthenticatorStageErrors.GenericError.logErrorName
        );
      }
    } else {
      successAlert.showAlert(
        translate(I18N_KEYS.SUCCESS_TOAST),
        AlertSeverity.SUBTLE
      );
      onComplete();
    }
  };
  const stageComponentCommonProps = {
    handleClickOnBack: onCancel,
    handleClickOnClose: onCancel,
  };
  const toggleAuthenticationCodeMode = () => {
    const targetStage =
      stage === U2FRemoveAuthenticatorStages.AUTHENTICATION_CODE
        ? U2FRemoveAuthenticatorStages.BACKUP_CODE
        : U2FRemoveAuthenticatorStages.AUTHENTICATION_CODE;
    setStage(targetStage);
    setError(undefined);
  };
  const getMappedElement = () => {
    switch (stage) {
      case U2FRemoveAuthenticatorStages.WARNING:
        return React.createElement(U2FAuthenticatorRemoveWarningDialogContent, {
          ...stageComponentCommonProps,
          handleClickOnSubmit: continueToAuthenticationStage,
        });
      case U2FRemoveAuthenticatorStages.AUTHENTICATION_CODE:
        return React.createElement(TwoFactorAuthenticationCodeDialog, {
          ...stageComponentCommonProps,
          handleClickOnSubmit: submitFinalStage,
          toggleAuthenticationCodeMode,
          error: error,
          login: login,
        });
      case U2FRemoveAuthenticatorStages.BACKUP_CODE:
        return React.createElement(TwoFactorAuthenticationBackupCodeDialog, {
          ...stageComponentCommonProps,
          handleClickOnSubmit: submitFinalStage,
          toggleAuthenticationCodeMode,
          error: error,
          login: login,
        });
    }
  };
  const MappedElement = getMappedElement();
  useEffect(() => {
    logDeleteU2FAuthenticatorStart();
  }, []);
  return (
    <Dialog
      isOpen={true}
      modalContentClassName={classnames(allIgnoreClickOutsideClassName)}
      disableOutsideClickClose
      disableScrolling
      disableUserInputTrap
      disableEscapeKeyClose
      closeIconName={translate(I18N_KEYS.CLOSE)}
      onClose={onCancel}
    >
      {MappedElement}
    </Dialog>
  );
};
