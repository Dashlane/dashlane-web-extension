import * as React from "react";
import { DataStatus } from "@dashlane/carbon-api-consumers";
import { jsx } from "@dashlane/design-system";
import { ReactivationStatus } from "@dashlane/communication";
import { AuthenticationStatus, UserOpenExtensionEvent } from "@dashlane/hermes";
import { useLoginStatus } from "../../libs/hooks/useLoginStatus";
import { AlertingErrorBoundary } from "../../libs/error/alerting-error-boundary";
import { logEvent } from "../../libs/logs/logEvent";
import { carbonConnector } from "../../carbonConnector";
import { AuthenticationFlowContainer } from "./authentication-flow-container";
import { useShouldDisplayAuthenticationFlow } from "./hooks/use-should-display-authentication-flow";
export const AuthenticationFlowWrapper = ({
  children,
}: React.PropsWithChildren<Record<never, never>>) => {
  const displayApp = () => {
    window.dispatchEvent(new Event("display-app"));
  };
  const loginStatus = useLoginStatus();
  const shouldDisplayAuthenticationFlow = useShouldDisplayAuthenticationFlow();
  React.useEffect(() => {
    displayApp();
  }, []);
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
    console.log(
      "[popup] Authentication flow wrapper state",
      `(shouldDisplayAuthenticationFlow.status: ${String(
        shouldDisplayAuthenticationFlow.status
      )})`,
      `(shouldDisplayAuthenticationFlow.shouldDisplayAuthFlow: ${String(
        shouldDisplayAuthenticationFlow.shouldDisplayAuthFlow
      )})`
    );
  }, [
    shouldDisplayAuthenticationFlow.status,
    shouldDisplayAuthenticationFlow.shouldDisplayAuthFlow,
  ]);
  if (shouldDisplayAuthenticationFlow.status === DataStatus.Loading) {
    return null;
  }
  return (
    <div>
      {shouldDisplayAuthenticationFlow.shouldDisplayAuthFlow ? (
        <div
          sx={{
            position: "relative",
            height: "561px",
            backgroundColor: "ds.background.default",
            overflow: "auto",
          }}
        >
          <AlertingErrorBoundary
            moduleName="popup-container"
            useCaseName="authentication-flow-wrapper"
          >
            <AuthenticationFlowContainer />
          </AlertingErrorBoundary>
        </div>
      ) : (
        children
      )}
    </div>
  );
};
