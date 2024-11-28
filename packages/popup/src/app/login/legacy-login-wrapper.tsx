import * as React from "react";
import {
  LocalAccountInfo,
  LoginStep,
  LoginStepInfo,
  ReactivationStatus,
} from "@dashlane/communication";
import { AuthenticationStatus, UserOpenExtensionEvent } from "@dashlane/hermes";
import { DataStatus } from "@dashlane/carbon-api-consumers";
import { AuthenticationFlowContracts } from "@dashlane/authentication-contracts";
import { useModuleCommands } from "@dashlane/framework-react";
import { LocalAccount } from "../../eventManager/types";
import { kernel } from "../../kernel";
import { carbonConnector } from "../../carbonConnector";
import { useLoginStepInfo } from "../../libs/api/loginStepInfo/useLoginStepInfo";
import { useUserLoginStatus } from "../../libs/api/session/useUserLoginStatus";
import { useLoginStatus } from "../../libs/hooks/useLoginStatus";
import { useDidOpen as useSessionDidOpen } from "../../libs/api/session/useDidOpen";
import { logEvent } from "../../libs/logs/logEvent";
import { openWebAppAndClosePopup } from "../helpers";
import Login from "./";
import { browserSupportsWebAuthnAuthentication } from "./WebAuthnStep/helpers/browserWebAuthnAuthentication";
import { useLoginDeviceLimitFlow } from "./DeviceLimitFlow";
export const LegacyLoginWrapper = ({
  children,
}: React.PropsWithChildren<Record<never, never>>) => {
  const [localAccountsList, setLocalAccountsList] = React.useState<
    LocalAccountInfo[] | null
  >(null);
  const [currentLoginStep, setCurrentLoginStep] =
    React.useState<LoginStepInfo | null>(null);
  const [needsSSOMigration, setNeedsSSOMigration] = React.useState(false);
  const [ssoServiceProviderUrl, setSSOServiceProviderUrl] = React.useState("");
  const { logout } = useModuleCommands(
    AuthenticationFlowContracts.authenticationFlowApi
  );
  const checkForSSOMigration = async (userLogin: string) => {
    const migrationInfo = await carbonConnector.getSSOMigrationInfo();
    if (
      migrationInfo.migration ===
        AuthenticationFlowContracts.SSOMigrationType.MP_TO_SSO &&
      migrationInfo.serviceProviderUrl
    ) {
      setNeedsSSOMigration(true);
      setSSOServiceProviderUrl(migrationInfo.serviceProviderUrl);
      setCurrentLoginStep({
        login: userLogin,
        step: LoginStep.ActivateSSO,
      });
    }
  };
  const checkForWebauthnStep = (refreshLocalAccountsList?: LocalAccount[]) => {
    if (!browserSupportsWebAuthnAuthentication()) {
      return;
    }
    const lastSuccessfulLocalAccount = refreshLocalAccountsList?.find(
      (account) => account.isLastSuccessfulLogin
    );
    if (!lastSuccessfulLocalAccount) {
      return;
    }
    if (lastSuccessfulLocalAccount.rememberMeType === "webauthn") {
      setCurrentLoginStep({
        login: lastSuccessfulLocalAccount.login,
        step: LoginStep.WebAuthn,
      });
    }
  };
  const loginStepInfo = useLoginStepInfo();
  const userLoginStatus = useUserLoginStatus();
  const loginStatus = useLoginStatus();
  const sessionDidOpen = useSessionDidOpen();
  const deviceLimitFlow = useLoginDeviceLimitFlow();
  React.useEffect(() => {
    const sendOpenExtensionLog = async () => {
      if (loginStatus.status === DataStatus.Success) {
        const reactivationStatus =
          await carbonConnector.getReactivationStatus();
        void logEvent(
          new UserOpenExtensionEvent({
            authenticationStatus: loginStatus.data.loggedIn
              ? AuthenticationStatus.LoggedIn
              : reactivationStatus === ReactivationStatus.WEBAUTHN
              ? AuthenticationStatus.LockedOut
              : AuthenticationStatus.LoggedOut,
          })
        );
      }
    };
    void sendOpenExtensionLog();
  }, [loginStatus.status]);
  React.useEffect(() => {
    const effect = async () => {
      const localAccounts = await carbonConnector.getLocalAccounts();
      const userLogin = userLoginStatus?.login;
      if (userLogin) {
        await checkForSSOMigration(userLogin);
      } else {
        checkForWebauthnStep(localAccounts);
        if (loginStepInfo) {
          setCurrentLoginStep(loginStepInfo);
        } else {
          setCurrentLoginStep(null);
        }
      }
      if (deviceLimitFlow) {
        setCurrentLoginStep({
          login: deviceLimitFlow.login,
          step: LoginStep.DeviceLimitReached,
        });
      }
      setLocalAccountsList(localAccounts);
    };
    if (
      userLoginStatus !== undefined &&
      deviceLimitFlow !== undefined &&
      loginStepInfo !== undefined
    ) {
      void effect();
    }
  }, [userLoginStatus, loginStepInfo, deviceLimitFlow]);
  const [isInitialSyncAnimationPending, setIsInitialSyncAnimationPending] =
    React.useState(false);
  const openSignupOrLogin = React.useCallback(
    (route: Parameters<typeof openWebAppAndClosePopup>[0]["route"]) => {
      logout();
      void openWebAppAndClosePopup({ route });
    },
    []
  );
  React.useEffect(() => {
    console.log(
      "[popup] Legacy login flow wrapper state",
      `(deviceLimitFlow: ${JSON.stringify(deviceLimitFlow)})`,
      `(currentLoginStep: ${JSON.stringify(currentLoginStep)})`
    );
  }, [deviceLimitFlow, currentLoginStep]);
  if (
    deviceLimitFlow === undefined ||
    (deviceLimitFlow && currentLoginStep?.step !== LoginStep.DeviceLimitReached)
  ) {
    return null;
  }
  return (
    <div style={{ position: "relative", height: "561px" }}>
      {sessionDidOpen && !needsSSOMigration && !isInitialSyncAnimationPending
        ? children
        : localAccountsList &&
          loginStepInfo !== undefined && (
            <Login
              currentLoginStep={currentLoginStep}
              kernel={kernel}
              localAccountsLogin={localAccountsList.map(
                (account) => account.login
              )}
              lastUsedAccount={localAccountsList.find(
                (account) => account.isLastSuccessfulLogin
              )}
              openSignupOrLogin={openSignupOrLogin}
              ssoMigrationServiceProviderUrl={ssoServiceProviderUrl}
              setIsInitialSyncAnimationPending={
                setIsInitialSyncAnimationPending
              }
            />
          )}
    </div>
  );
};
