import React, { useState } from "react";
import { useSelector, useStore } from "react-redux";
import { redirectAfterLogin } from "../../libs/redirect/after-login/helpers";
import { GlobalState } from "../../store/types";
import { isInitialSyncAnimationPendingSelector } from "../initial-sync-progress/selectors";
import { useRouterGlobalSettingsContext } from "../../libs/router";
import { DataStatus, useModuleQuery } from "@dashlane/framework-react";
import { NotAllowedReason, vaultAccessApi } from "@dashlane/session-contracts";
export function useLoginRedirection() {
  const routerGlobalSettings = useRouterGlobalSettingsContext();
  const { data, status } = useModuleQuery(vaultAccessApi, "isAllowed");
  const needsSSOMigration =
    !data?.isAllowed &&
    (data?.reasons.includes(NotAllowedReason.RequiresMP2SSOMigration) ||
      data?.reasons.includes(NotAllowedReason.RequiresSSO2MPMigration));
  const isInitialSyncAnimationPending = useSelector(
    isInitialSyncAnimationPendingSelector
  );
  const store = useStore<GlobalState>();
  const [isLoggedIn, setIsLoggedIn] = useState(
    store.getState().carbon.loginStatus.loggedIn
  );
  store.subscribe(() => {
    setIsLoggedIn(() => store.getState().carbon.loginStatus.loggedIn);
  });
  const shouldRedirectAfterLogin = React.useRef(
    !store.getState().carbon.loginStatus.loggedIn
  );
  React.useEffect(() => {
    if (status !== DataStatus.Success) {
      return;
    }
    if (!isLoggedIn) {
      shouldRedirectAfterLogin.current = true;
      return;
    }
    if (
      shouldRedirectAfterLogin.current &&
      !isInitialSyncAnimationPending &&
      !needsSSOMigration
    ) {
      shouldRedirectAfterLogin.current = false;
      redirectAfterLogin(store, routerGlobalSettings.routes);
    }
  }, [
    store,
    status,
    isInitialSyncAnimationPending,
    routerGlobalSettings.routes,
    isLoggedIn,
    needsSSOMigration,
  ]);
}
