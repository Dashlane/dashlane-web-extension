import { useEffect, useState } from "react";
import type { Location } from "history";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import { Flex } from "@dashlane/design-system";
import {
  DataStatus,
  useModuleCommands,
  useModuleQuery,
} from "@dashlane/framework-react";
import { assertUnreachable } from "@dashlane/framework-types";
import { AuthenticationFlowContracts } from "@dashlane/authentication-contracts";
import { registerRedirectPath } from "../../libs/redirect/after-login/actions";
import { shouldSaveConsoleRedirectPath } from "../../libs/redirect/after-login/helpers";
import { useRouterGlobalSettingsContext } from "../../libs/router";
import { LoginFlowLoader } from "../login-flow/login-flow-loader";
import {
  AccountBackupCode,
  AccountEmailSelect,
  AccountEmailToken,
  AccountMasterPassword,
  AccountPinCode,
  AccountSSO,
  AccountTotp,
  AccountWebAuthn,
  DashlaneAuthenticator,
  DeviceToDeviceAuthentication,
} from "./authentication-flow/steps";
import { Navigation } from "./authentication-flow/components";
import {
  ClientBypass,
  ClientBypassType,
} from "./authentication-flow/types/manual-bypass";
export type AuthLocationState = Location<{
  ignoreRedirect?: boolean;
}>;
export interface AuthenticationFlowLoginPanelProps {
  location: AuthLocationState;
  isTacFlow: boolean;
  logoutHandler: () => void;
}
export const AuthenticationFlowLoginPanel = ({
  location,
  isTacFlow,
  logoutHandler,
}: AuthenticationFlowLoginPanelProps) => {
  const routerGlobalSettings = useRouterGlobalSettingsContext();
  const [useClientBypass, setUseClientBypass] = useState<ClientBypass>({
    type: ClientBypassType.NONE,
  });
  const { search } = useLocation();
  const queryParams = queryString.parse(search);
  const [prefilledEmail, setPrefilledEmail] = useState<string | undefined>(
    queryParams.email
  );
  const [prefilledToken, setPrefilledToken] = useState<string | undefined>(
    queryParams.token
  );
  useEffect(() => {
    if (
      queryParams.redirect &&
      shouldSaveConsoleRedirectPath(queryParams.redirect)
    ) {
      routerGlobalSettings.store.dispatch(
        registerRedirectPath(queryParams.redirect)
      );
    }
  }, []);
  const handleOnClearPrefilledEmail = () => {
    setPrefilledEmail(undefined);
  };
  const handleOnClearPrefilledToken = () => {
    setPrefilledToken(undefined);
  };
  const authenticationFlowStatus = useModuleQuery(
    AuthenticationFlowContracts.authenticationFlowApi,
    "authenticationFlowStatus"
  );
  const {
    changeLogin,
    sendAccountEmail,
    submitEmailToken,
    submitTotp,
    submitBackupCode,
    changeTwoFactorAuthenticationOtpType,
    sendMasterPassword,
    resendEmailToken,
    resendPushNotification,
    switchToEmailToken,
    switchToDashlaneAuthenticator,
    switchToDevicetoDeviceAuthentication,
    switchToMasterPassword,
    submitPinCode,
    clearError,
    retryWebAuthnAuthentication,
    webAuthnAuthenticationFail,
    switchToPinCode,
  } = useModuleCommands(AuthenticationFlowContracts.authenticationFlowApi);
  const clearInputError = () => {
    const error = authenticationFlowStatus.data?.error;
    if (error) {
      clearError();
    }
  };
  useEffect(() => {
    if (APP_PACKAGED_IN_EXTENSION && location.search.includes("askmp")) {
      setUseClientBypass({ type: ClientBypassType.ASK_MP });
    } else if (
      prefilledEmail &&
      authenticationFlowStatus.data?.step !== "EmailStep"
    ) {
      changeLogin({});
    }
  }, [location, location.hash]);
  const isLoading = authenticationFlowStatus.status === DataStatus.Loading;
  const AuthenticationStepComponent = () => {
    const data = authenticationFlowStatus.data;
    if (!data) return null;
    if (!data.step || data.step === undefined || data.step === "StartingStep")
      return null;
    switch (data.step) {
      case "EmailStep":
        return (
          <AccountEmailSelect
            clearInputError={clearInputError}
            sendEmail={sendAccountEmail}
            prefilledEmail={prefilledEmail}
            onClearPrefilledEmail={handleOnClearPrefilledEmail}
            {...data}
          />
        );
      case "EmailTokenStep":
        return (
          <AccountEmailToken
            clearInputError={clearInputError}
            resendEmailToken={resendEmailToken}
            submitEmailToken={submitEmailToken}
            switchToDashlaneAuthenticator={switchToDashlaneAuthenticator}
            prefilledToken={prefilledToken}
            onClearPrefilledToken={handleOnClearPrefilledToken}
            {...data}
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
            clearInputError={clearInputError}
            changeTwoFactorAuthenticationOtpType={
              changeTwoFactorAuthenticationOtpType
            }
            prefilledToken={prefilledToken}
            onClearPrefilledToken={handleOnClearPrefilledToken}
            {...data}
          />
        );
      case "MasterPasswordStep":
        return (
          <AccountMasterPassword
            clearInputError={clearInputError}
            sendMasterPassword={sendMasterPassword}
            logoutHandler={logoutHandler}
            location={location}
            switchToPinCode={switchToPinCode}
            {...data}
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
        return (
          <AccountSSO
            setUseClientBypass={setUseClientBypass}
            sendUsageLog={true}
            changeLogin={changeLogin}
            {...data}
          />
        );
      case "DeviceToDeviceAuthenticationStep":
        return <DeviceToDeviceAuthentication location={location} {...data} />;
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
  const BypassComponent = () => {
    if (
      useClientBypass.type === ClientBypassType.ASK_MP &&
      authenticationFlowStatus.data?.step === "MasterPasswordStep"
    ) {
      return (
        <AccountMasterPassword
          clearInputError={clearInputError}
          sendMasterPassword={sendMasterPassword}
          logoutHandler={logoutHandler}
          location={location}
          switchToPinCode={switchToPinCode}
          {...authenticationFlowStatus.data}
        />
      );
    } else if (
      useClientBypass.type === ClientBypassType.WAITING_IDP_REDIRECTION
    ) {
      return (
        <AccountSSO
          loginEmail={useClientBypass.login}
          setUseClientBypass={() => {}}
          sendUsageLog={false}
          localAccounts={[]}
          isNitroProvider={false}
          serviceProviderRedirectUrl=""
        />
      );
    }
    return null;
  };
  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      role="main"
    >
      {isTacFlow ? null : <Navigation />}
      {isLoading ? (
        <LoginFlowLoader
          containerHeight="100%"
          customMargin="30% 0 0 0;"
          customAnimationHeight={100}
          customAnimationWidth={100}
        />
      ) : (
        BypassComponent() ?? AuthenticationStepComponent()
      )}
    </Flex>
  );
};
