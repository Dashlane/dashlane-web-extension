import { AuthenticationFlowContracts } from "@dashlane/authentication-contracts";
import { useModuleCommands } from "@dashlane/framework-react";
import { clearCache as clearAPICache } from "../../api/Api";
import { clearCache as clearWSCache } from "../api";
import { GlobalDispatcher } from "../carbon/triggers";
import { flushLogsRequestedAction } from "../logs";
import { clearRedirectPath } from "../redirect/after-login/actions";
import { webappClose } from "@dashlane/framework-infra/spi";
import { useCallback } from "react";
export const useLogout = (dispatchGlobal: GlobalDispatcher) => {
  const { logout } = useModuleCommands(
    AuthenticationFlowContracts.authenticationFlowApi
  );
  return useCallback(async () => {
    dispatchGlobal(clearRedirectPath());
    dispatchGlobal(flushLogsRequestedAction());
    clearAPICache();
    clearWSCache();
    await logout();
    if (APP_PACKAGED_IN_EXTENSION) {
      webappClose();
    }
  }, [
    clearRedirectPath,
    flushLogsRequestedAction,
    clearAPICache,
    clearWSCache,
    logout,
    webappClose,
  ]);
};
