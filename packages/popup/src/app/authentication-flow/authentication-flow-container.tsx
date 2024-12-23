import { useState } from "react";
import { AuthenticationFlowContracts } from "@dashlane/authentication-contracts";
import { Flex, jsx } from "@dashlane/design-system";
import { useModuleCommands, useModuleQuery } from "@dashlane/framework-react";
import { assertUnreachable } from "@dashlane/framework-types";
import { FormWrapper, Heading } from "./components";
import { AccountBackupCode } from "./steps/account-backup-code";
import { AccountEmailToken } from "./steps/account-email-token";
import { AccountMasterPassword } from "./steps/account-master-password";
import { AccountTotp } from "./steps/account-totp";
import { AccountWebAuthn } from "./steps/account-web-authn";
import { DashlaneAuthenticator } from "./steps/dashlane-authenticator";
import { AccountEmailSelectContainer } from "./steps/account-email-select/account-email-select-container";
import { AccountSSO } from "./steps/account-sso";
import { openWebAppAndClosePopup } from "../helpers";
import { AccountPinCode } from "./steps/account-pin-code/account-pin-code";
export const AuthenticationFlowContainer = () => {
  const authenticationFlowStatus = useModuleQuery(
    AuthenticationFlowContracts.authenticationFlowApi,
    "authenticationFlowStatus"
  );
  const {
    sendAccountEmail,
    submitEmailToken,
    sendMasterPassword,
    resendEmailToken,
    resendPushNotification,
    switchToEmailToken,
    switchToDashlaneAuthenticator,
    switchToDevicetoDeviceAuthentication,
    submitTotp,
    submitBackupCode,
    submitPinCode,
    changeTwoFactorAuthenticationOtpType,
    clearError,
    webAuthnAuthenticationFail,
    retryWebAuthnAuthentication,
    switchToMasterPassword,
    switchToPinCode,
  } = useModuleCommands(AuthenticationFlowContracts.authenticationFlowApi);
  const clearInputError = () => {
    const error = authenticationFlowStatus.data?.error;
    if (error) {
      clearError();
    }
  };
  const [animationRunning, setAnimationRunning] = useState(false);
  const getLoginStepComponent = () => {
    const data = authenticationFlowStatus.data;
    if (!data || data.step === undefined || data.step === "StartingStep") {
      return null;
    }
    switch (data.step) {
      case "EmailStep":
        return (
          <AccountEmailSelectContainer
            {...data}
            sendEmail={sendAccountEmail}
            clearInputError={clearInputError}
          />
        );
      case "EmailTokenStep":
        return (
          <AccountEmailToken
            {...data}
            submitEmailToken={submitEmailToken}
            resendEmailToken={resendEmailToken}
            switchToDashlaneAuthenticator={switchToDashlaneAuthenticator}
            clearInputError={clearInputError}
          />
        );
      case "DashlaneAuthenticatorStep":
        return (
          <DashlaneAuthenticator
            resendPushNotification={resendPushNotification}
            switchToEmailToken={switchToEmailToken}
            {...data}
          />
        );
      case "TwoFactorAuthenticationOtpStep":
        if (
          data.twoFactorAuthenticationOtpType !== undefined &&
          data.twoFactorAuthenticationOtpType === "backupCode"
        ) {
          return (
            <AccountBackupCode
              submitBackupCode={submitBackupCode}
              changeTwoFactorAuthenticationOtpType={
                changeTwoFactorAuthenticationOtpType
              }
              {...data}
            />
          );
        }
        return (
          <AccountTotp
            submitTotp={submitTotp}
            changeTwoFactorAuthenticationOtpType={
              changeTwoFactorAuthenticationOtpType
            }
            clearInputError={clearInputError}
            {...data}
          />
        );
      case "MasterPasswordStep":
        return (
          <AccountMasterPassword
            sendMasterPassword={sendMasterPassword}
            {...data}
            clearInputError={clearInputError}
          />
        );
      case "WebAuthnStep":
        return (
          <AccountWebAuthn
            webAuthnAuthenticationFail={webAuthnAuthenticationFail}
            retryWebAuthnAuthentication={retryWebAuthnAuthentication}
            switchToMasterPassword={switchToMasterPassword}
            switchToPinCode={switchToPinCode}
            {...data}
          />
        );
      case "SSORedirectionToIdpStep":
        return <AccountSSO {...data} />;
      case "DeviceToDeviceAuthenticationStep": {
        void openWebAppAndClosePopup({ route: "/login" });
        return null;
      }
      case "PinCodeStep":
        return (
          <AccountPinCode
            switchToMasterPassword={switchToMasterPassword}
            switchToDeviceToDeviceAuthentication={
              switchToDevicetoDeviceAuthentication
            }
            clearInputError={clearInputError}
            submitPinCode={submitPinCode}
            {...data}
          />
        );
      default:
        return assertUnreachable(data);
    }
  };
  return (
    <Flex flexDirection="column" sx={{ minHeight: "100%" }} role="main">
      {authenticationFlowStatus.data?.step !== "DashlaneAuthenticatorStep" ? (
        <Heading setAnimationRunning={setAnimationRunning} />
      ) : null}
      {!animationRunning ? (
        <FormWrapper>{getLoginStepComponent()}</FormWrapper>
      ) : null}
    </Flex>
  );
};
