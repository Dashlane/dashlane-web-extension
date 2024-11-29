import {
  sessionApi,
  SessionState,
  SessionStates,
} from "@dashlane/session-contracts";
import { DataStatus, useModuleQuery } from "@dashlane/framework-react";
export const useSessionState = (): SessionState | undefined => {
  const sessionStateResult = useModuleQuery(sessionApi, "currentSessionInfo");
  return sessionStateResult.status === DataStatus.Success
    ? SessionStates.Open
    : sessionStateResult.error?.tag === "no-user-logged-in"
    ? SessionStates.Closed
    : undefined;
};
