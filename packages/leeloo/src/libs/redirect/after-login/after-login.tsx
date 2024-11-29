import * as React from "react";
import { useLocation } from "../../router";
import { useLoginRedirection } from "../../../auth/login-flow/use-login-redirection";
import { registerRedirectPath } from "./actions";
import { useRouterGlobalSettingsContext } from "../../router/RouterGlobalSettingsProvider";
import { getAfterLoginRedirectUrl } from "./helpers";
export const AfterLogin = () => {
  const location = useLocation();
  const url = `${location.pathname}${location.search}`;
  const routerGlobalSettings = useRouterGlobalSettingsContext();
  useLoginRedirection();
  React.useEffect(() => {
    if (routerGlobalSettings.store.getState().afterLogin.hasBeenRedirected) {
      return;
    }
    const afterLoginRedirectUrl = getAfterLoginRedirectUrl(url);
    if (afterLoginRedirectUrl) {
      routerGlobalSettings.store.dispatch(
        registerRedirectPath(afterLoginRedirectUrl)
      );
    }
  }, [routerGlobalSettings.store, url]);
  return null;
};
