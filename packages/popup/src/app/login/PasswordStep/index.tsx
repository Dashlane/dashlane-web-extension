import * as React from "react";
import { carbonConnector } from "../../../carbonConnector";
import { AuthenticationCode, ChangeMPFlowPath } from "@dashlane/communication";
import MasterPasswordInput from "../../../components/inputs/common/master-password-input/master-password-input";
import { Checkbox } from "../../../components/checkbox/checkbox";
import {
  FORGOT_PASSWORD_URL,
  openExternalUrl,
} from "../../../libs/externalUrls";
import FormWrapper from "../FormWrapper";
import { ThemeEnum } from "../../../libs/helpers-types";
import {
  PerformanceMarker,
  performanceMethods,
} from "../../../libs/performance";
import useTranslate from "../../../libs/i18n/useTranslate";
import { DashlaneUpdateNeeded } from "../errors/dashlaneUpdateNeeded";
import { checkDoesLocalRecoveryKeyExist } from "../../../libs/api";
import { AccountRecoveryRequestStartDialog } from "../../accountRecovery/accountRecoveryRequestStartDialog";
import { AccountRecoveryRequestPendingDialog } from "../../accountRecovery/accountRecoveryRequestPendingDialog";
import { AccountRecoveryRequestApprovedDialog } from "../../accountRecovery/accountRecoveryRequestApprovedDialog";
import { AccountRecoveryRequestRefusedDialog } from "../../accountRecovery/accountRecoveryRequestRefusedDialog";
import { openWebAppAndClosePopup } from "../../helpers";
import styles from "./styles.css";
const I18N_KEYS = {
  FORGOT_PASSWORD: "login/password_forgot",
  LOG_IN: "login/password_confirm_log_in",
  REMEMBER_ME: "login/remember_me",
  REMEMBER_ME_WARNING: "login/remember_me_warning_text",
  TITLE: "login/password_label",
};
export interface PasswordStepProps {
  login: string;
  descriptionKey?: string;
  isLoading: boolean;
  displayRememberMe: boolean;
  sendPassword: (params: {
    login: string;
    password: string;
    rememberMe: boolean;
  }) => void;
  setWaitingForResponseState: () => void;
  resetErrorState: () => void;
  error?: string;
}
const PasswordStep: React.FC<PasswordStepProps> = (
  props: PasswordStepProps
) => {
  const { translate } = useTranslate();
  const [showPassword, setShowPassword] = React.useState(false);
  const [rememberMeIsChecked, setRememberMeIsChecked] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [shouldSendNewRequest, setShouldSendNewRequest] = React.useState(false);
  const [showStartRequestDialog, setShowStartRequestDialog] =
    React.useState(false);
  const [showPendingRequestDialog, setShowPendingRequestDialog] =
    React.useState(false);
  const [showApprovedRequestDialog, setShowApprovedRequestDialog] =
    React.useState(false);
  const [showRefusedRequestDialog, setShowRefusedRequestDialog] =
    React.useState(false);
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const sendPassword = () => {
    props.sendPassword({
      login: props.login,
      password: password,
      rememberMe: rememberMeIsChecked,
    });
    props.setWaitingForResponseState();
  };
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    performanceMethods.mark(PerformanceMarker.LOGIN_CLICK);
    const response = await checkDoesLocalRecoveryKeyExist();
    const isAccountRecoveryFlow = response.success && response.doesExist;
    if (!isAccountRecoveryFlow) {
      sendPassword();
      return;
    }
    const result = await carbonConnector.checkRecoveryRequestStatus({
      masterPassword: password,
    });
    if (!result.success) {
      sendPassword();
      return;
    }
    switch (result.response.status) {
      case "PENDING":
        setShowPendingRequestDialog(true);
        setShowApprovedRequestDialog(false);
        setShowRefusedRequestDialog(false);
        return;
      case "APPROVED":
        setShowPendingRequestDialog(false);
        setShowApprovedRequestDialog(true);
        setShowRefusedRequestDialog(false);
        return;
      case "REFUSED":
        setShowPendingRequestDialog(false);
        setShowApprovedRequestDialog(false);
        setShowRefusedRequestDialog(true);
        return;
      case "CANCELED":
        sendPassword();
        return;
      default:
        return;
    }
  };
  const handlePasswordInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    props.resetErrorState();
    setPassword(e.target.value);
  };
  const onSendNewRequest = () => {
    void openWebAppAndClosePopup({
      route: "/account-recovery/admin-assisted-recovery",
    });
  };
  const onCancelRequest = async () => {
    await carbonConnector.cancelRecoveryRequest();
    setShowPendingRequestDialog(false);
  };
  const onForgotPasswordClick = async () => {
    const pendingRequestResponse =
      await carbonConnector.isRecoveryRequestPending();
    if (pendingRequestResponse.success && pendingRequestResponse.response) {
      setShouldSendNewRequest(true);
      setShowPendingRequestDialog(true);
      return;
    }
    const response = await checkDoesLocalRecoveryKeyExist();
    const isAccountRecoveryFlow = response.success && response.doesExist;
    if (isAccountRecoveryFlow) {
      setShowStartRequestDialog(true);
      return;
    }
    openExternalUrl(FORGOT_PASSWORD_URL);
  };
  const onRecoverUserAccount = async () => {
    setShowApprovedRequestDialog(false);
    const response = await carbonConnector.recoverUserData({
      masterPassword: password,
    });
    if (response.success) {
      void carbonConnector.changeMasterPassword({
        newPassword: password,
        flow: ChangeMPFlowPath.ADMIN_ASSISTED_RECOVERY,
      });
      await openWebAppAndClosePopup({ route: "/master-password-reset" });
    }
  };
  const onRememberMeCheckBoxChanged = (value: boolean): void => {
    setRememberMeIsChecked(value);
  };
  const showDashlaneUpdateInfoBox = (error: string | undefined) =>
    error ===
    AuthenticationCode[
      AuthenticationCode.CLIENT_VERSION_DOES_NOT_SUPPORT_SSO_MIGRATION
    ];
  const { login } = props;
  React.useEffect(() => {
    setPassword("");
    setRememberMeIsChecked(false);
  }, [login]);
  return (
    <FormWrapper
      title={{ text: translate(I18N_KEYS.TITLE), labelId: "password_label" }}
      description={
        props.descriptionKey ? translate(props.descriptionKey) : undefined
      }
      handleSubmit={(event) => {
        void handleFormSubmit(event);
      }}
      formActionsProps={{
        isLoading: props.isLoading,
        primaryButtonText: translate(I18N_KEYS.LOG_IN),
        primaryButtonIsDisabled: password.length === 0,
        secondaryButtonText: translate(I18N_KEYS.FORGOT_PASSWORD),
        onSecondaryButtonClick: () => {
          void onForgotPasswordClick();
        },
      }}
    >
      <div>
        <MasterPasswordInput
          error={props.error}
          isDisabled={props.isLoading || showDashlaneUpdateInfoBox(props.error)}
          password={password}
          showPassword={showPassword}
          handlePasswordInputChange={handlePasswordInputChange}
          handleShowPassword={handleShowPassword}
          theme={ThemeEnum.Dark}
          spellCheck={false}
        />
        {showDashlaneUpdateInfoBox(props.error) ? (
          <DashlaneUpdateNeeded />
        ) : null}
        {props.displayRememberMe && !showDashlaneUpdateInfoBox(props.error) && (
          <div className={styles.rememberMe}>
            <Checkbox
              checked={rememberMeIsChecked}
              label={translate(I18N_KEYS.REMEMBER_ME)}
              onChange={onRememberMeCheckBoxChanged}
              theme={ThemeEnum.Dark}
            />
            {rememberMeIsChecked && (
              <div className={styles.warningMessage}>
                {translate(I18N_KEYS.REMEMBER_ME_WARNING)}
              </div>
            )}
          </div>
        )}
      </div>
      <div id="dialog" className={styles.dialog}>
        <AccountRecoveryRequestStartDialog
          isVisible={showStartRequestDialog}
          onDismiss={() => {
            setShowStartRequestDialog(false);
          }}
          onStartAccountRecovery={onSendNewRequest}
        />
        <AccountRecoveryRequestPendingDialog
          isVisible={showPendingRequestDialog}
          action={shouldSendNewRequest ? "sendNewRequest" : "cancel"}
          onCancelOrSendNew={
            shouldSendNewRequest ? onSendNewRequest : onCancelRequest
          }
          onDismiss={() => {
            setShowPendingRequestDialog(false);
            setShouldSendNewRequest(false);
          }}
        />
        <AccountRecoveryRequestApprovedDialog
          onRecoverUserAccount={() => {
            void onRecoverUserAccount();
          }}
          isVisible={showApprovedRequestDialog}
        />
        <AccountRecoveryRequestRefusedDialog
          isVisible={showRefusedRequestDialog}
          onSendNewRequest={onSendNewRequest}
          onDismiss={() => {
            setShowRefusedRequestDialog(false);
          }}
        />
      </div>
    </FormWrapper>
  );
};
export default React.memo(PasswordStep);
