import React from "react";
import { AuthenticationFlowContracts } from "@dashlane/authentication-contracts";
import {
  DataStatus,
  useModuleCommands,
  useModuleQuery,
} from "@dashlane/framework-react";
import { useRouterGlobalSettingsContext } from "../../../../libs/router";
import { registerRedirectPath } from "../../../../libs/redirect/after-login/actions";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { isValidEmail } from "../../../../libs/validators";
import Animation from "../../../../libs/dashlane-style/animation";
import loadingLottie from "../../../../libs/assets/lottie-loading.json";
import { Props } from "../../../../sso/types";
import {
  extractSsoInfoFromUrl,
  requiredPermissions,
} from "../../../../sso/utils";
import { AUTO_SSO_LOGIN_SUCCESS_URL_SEGMENT } from "../../../../app/routes/constants";
import { getDefaultDeviceName } from "../../../../helpers";
import { useIsAutoSsoLoginDisabled } from "../hooks/use-is-auto-sso-login-disabled";
export const I18N_NAMES = {
  BROWSER_NAME: "webapp_login_form_regsiter_fallback_browser_name",
};
export const Sso = (props: Props) => {
  const routerGlobalSettings = useRouterGlobalSettingsContext();
  const { translate } = useTranslate();
  const { loginViaSSO } = useModuleCommands(
    AuthenticationFlowContracts.authenticationFlowApi
  );
  const ssoUserSettings = useModuleQuery(
    AuthenticationFlowContracts.authenticationFlowApi,
    "getSsoUserSettings"
  );
  const {
    login,
    ssoToken,
    key: ssoServiceProviderKey,
    currentAuths,
    expectedAuths,
    inStore,
  } = extractSsoInfoFromUrl(props);
  if (currentAuths !== expectedAuths) {
    console.error("[Auth] - SSO Migration is not yet supported with MV3 login");
  }
  const isAutoSsoLoginDisabled = useIsAutoSsoLoginDisabled();
  const hasRememberMeForSSO = props.lee.carbon.localAccounts?.find(
    (account) => account.login === login && account.rememberMeType === "sso"
  );
  const shouldRememberMeForSSO =
    isAutoSsoLoginDisabled.status === DataStatus.Success &&
    !isAutoSsoLoginDisabled.data &&
    !hasRememberMeForSSO &&
    ssoUserSettings.status === DataStatus.Success &&
    ssoUserSettings.data.rememberMeForSSOPreference;
  if (hasRememberMeForSSO) {
    routerGlobalSettings.store.dispatch(
      registerRedirectPath(AUTO_SSO_LOGIN_SUCCESS_URL_SEGMENT)
    );
  }
  React.useEffect(() => {
    if (
      ssoUserSettings.status === DataStatus.Loading ||
      isAutoSsoLoginDisabled.status === DataStatus.Loading
    ) {
      return;
    }
    loginViaSSO({
      deviceName: getDefaultDeviceName(translate(I18N_NAMES.BROWSER_NAME)),
      exist: true,
      ssoServiceProviderKey,
      login: isValidEmail(login) ? login : "",
      ssoToken,
      currentAuths,
      expectedAuths,
      inStore,
      requiredPermissions: requiredPermissions(),
      shouldRememberMeForSSO,
    });
  }, [ssoUserSettings.status, isAutoSsoLoginDisabled.status]);
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Animation
        height={150}
        width={150}
        animationParams={{
          renderer: "svg",
          animationData: loadingLottie,
          loop: true,
          autoplay: true,
        }}
      />
    </div>
  );
};
