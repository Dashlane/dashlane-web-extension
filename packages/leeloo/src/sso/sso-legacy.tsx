import { useEffect, useState } from "react";
import { DataStatus, LiveDataStatus } from "@dashlane/carbon-api-consumers";
import {
  ChangeMPFlowPath,
  LoginViaSsoCode,
  MigrationSsoToMP,
  SsoMigrationServerMethod,
  UserConsent,
} from "@dashlane/communication";
import { AuthenticationFlowContracts } from "@dashlane/authentication-contracts";
import { useModuleQuery } from "@dashlane/framework-react";
import { useIsAutoSsoLoginDisabled } from "../auth/login-panel/authentication-flow/hooks/use-is-auto-sso-login-disabled";
import loadingLottie from "../libs/assets/lottie-loading.json";
import Animation from "../libs/dashlane-style/animation";
import { registerRedirectPath } from "../libs/redirect/after-login/actions";
import useTranslate from "../libs/i18n/useTranslate";
import { carbonConnector } from "../libs/carbon/connector";
import { redirectToUrl } from "../libs/external-urls";
import { isValidEmail } from "../libs/validators";
import { redirect, useRouterGlobalSettingsContext } from "../libs/router";
import {
  AUTO_SSO_LOGIN_SUCCESS_URL_SEGMENT,
  LOADER_URL_SEGMENT,
  LOGIN_URL_SEGMENT,
  SSO_URL_SEGMENT,
} from "../app/routes/constants";
import { getDefaultDeviceName } from "../helpers";
import { SSO_DOWNLOAD, WEBAPP_LOGIN } from "../team/urls";
import { getUserId } from "../user";
import { extractSsoInfoFromUrl, requiredPermissions } from "./utils";
import { Props, SsoSteps } from "./types";
import {
  ConfirmNewPassword,
  CreateMasterPassword,
} from "./create-master-password/create-master-password";
import { Progress } from "./progress/progress-wrapper";
import { Terms, TermsSubmitOptions } from "./terms/terms";
import { useLiveChangeMasterPasswordStatus } from "./hooks/useLiveChangeMasterPasswordStatus";
import styles from "./sso.css";
export const I18N_KEYS = {
  ACCOUNT_ERROR: "webapp_sso_page_create_account_error",
  BROWSER_NAME: "webapp_login_form_regsiter_fallback_browser_name",
};
export const SsoLegacy = (props: Props) => {
  const routerGlobalSettings = useRouterGlobalSettingsContext();
  const {
    login,
    ssoToken,
    key: ssoServiceProviderKey,
    exists,
    currentAuths,
    expectedAuths,
    inStore,
  } = extractSsoInfoFromUrl(props);
  const { lee } = props;
  const userExists = exists === "true";
  const [ssoSteps, setSsoSteps] = useState<SsoSteps>(
    userExists ? SsoSteps.D_SPINNER : SsoSteps.ACCOUNT_CREATION
  );
  const { translate } = useTranslate();
  const [error, setError] = useState("");
  const [progressValue, setProgressValue] = useState(0);
  const isAutoSsoLoginDisabled = useIsAutoSsoLoginDisabled();
  const ssoUserSettings = useModuleQuery(
    AuthenticationFlowContracts.authenticationFlowApi,
    "getSsoUserSettings"
  );
  const validatedEmail = isValidEmail(login) ? login : "";
  const changeMPProgress = useLiveChangeMasterPasswordStatus();
  const handleChangeMPFlow = async (params: MigrationSsoToMP) => {
    setSsoSteps(SsoSteps.CHANGE_MP_PROGRESS);
    const response = await carbonConnector.changeMasterPassword(params);
    if (!response.success) {
      return redirect(LOGIN_URL_SEGMENT);
    }
  };
  const handleExistingUser = async () => {
    if (
      currentAuths === SsoMigrationServerMethod.MP &&
      expectedAuths === SsoMigrationServerMethod.SSO
    ) {
      setSsoSteps(SsoSteps.CHANGE_MP_PROGRESS);
    }
    const hasRememberMeForSSO = props.lee.carbon.localAccounts?.find(
      (account) => account.login === login && account.rememberMeType === "sso"
    );
    const isAutoSSORequested =
      ssoUserSettings.status === DataStatus.Success &&
      ssoUserSettings.data.rememberMeForSSOPreference;
    const shouldRememberMeForSSO =
      !hasRememberMeForSSO &&
      isAutoSSORequested &&
      isAutoSsoLoginDisabled.status === DataStatus.Success &&
      !isAutoSsoLoginDisabled.data;
    const loginParams = {
      deviceName: getDefaultDeviceName(translate(I18N_KEYS.BROWSER_NAME)),
      exist: true,
      ssoServiceProviderKey,
      login: validatedEmail,
      ssoToken,
      currentAuths,
      expectedAuths,
      inStore,
      requiredPermissions: requiredPermissions(),
      shouldRememberMeForSSO,
    };
    if (hasRememberMeForSSO) {
      routerGlobalSettings.store.dispatch(
        registerRedirectPath(AUTO_SSO_LOGIN_SUCCESS_URL_SEGMENT)
      );
    }
    const loginResponse = await carbonConnector.loginViaSSO(loginParams);
    if (!loginResponse.success) {
      if (loginResponse.error.code === LoginViaSsoCode.SSO_LOGIN_CORRUPT) {
        return redirect(LOGIN_URL_SEGMENT);
      }
      redirect(LOGIN_URL_SEGMENT);
    } else if (expectedAuths === SsoMigrationServerMethod.MP) {
      setSsoSteps(SsoSteps.ASK_FOR_MP);
    }
  };
  useEffect(() => {
    if (inStore) {
      return;
    }
    if (
      !validatedEmail.length ||
      !ssoServiceProviderKey.length ||
      !ssoToken.length
    ) {
      redirect(LOGIN_URL_SEGMENT);
    }
  }, [inStore, validatedEmail, ssoServiceProviderKey, ssoToken]);
  useEffect(() => {
    if (
      userExists &&
      ssoUserSettings.status === DataStatus.Success &&
      isAutoSsoLoginDisabled.status === DataStatus.Success
    ) {
      handleExistingUser();
    }
  }, [userExists, ssoUserSettings.status, isAutoSsoLoginDisabled.status]);
  useEffect(() => {
    if (
      changeMPProgress.status !== LiveDataStatus.Received ||
      !changeMPProgress.data
    ) {
      return;
    }
    const { value } = changeMPProgress.data;
    setProgressValue(value);
  }, [changeMPProgress]);
  const confirmNewPassword = async ({
    password,
  }: ConfirmNewPassword): Promise<void> => {
    const changeMPParams: MigrationSsoToMP = {
      newPassword: password,
      flow: ChangeMPFlowPath.SSO_TO_MP,
    };
    await handleChangeMPFlow(changeMPParams);
  };
  const handleAcceptTermsSubmit = async ({
    isEu,
    privacyPolicyAndToS,
    setIsLoading,
    subscribed,
  }: TermsSubmitOptions): Promise<void> => {
    if (isEu && !privacyPolicyAndToS) {
      const euTosError = new Error(
        "termsOfService set to false on accept submit"
      );
      lee.reportError(euTosError);
      redirect(SSO_URL_SEGMENT);
    }
    setIsLoading(true);
    const tosConsents = [];
    if (isEu) {
      const privacyPolicyConsent: UserConsent = {
        consentType: "privacyPolicyAndToS",
        status: privacyPolicyAndToS,
      };
      tosConsents.push(privacyPolicyConsent);
    }
    const emailsConsent: UserConsent = {
      consentType: "emailsOffersAndTips",
      status: subscribed,
    };
    tosConsents.push(emailsConsent);
    const loginParams = {
      consents: tosConsents,
      deviceName: getDefaultDeviceName(translate(I18N_KEYS.BROWSER_NAME)),
      exist: false,
      ssoServiceProviderKey,
      login: validatedEmail,
      ssoToken,
      currentAuths,
      expectedAuths,
      inStore: false,
      requiredPermissions: requiredPermissions(),
      anonymousUserId: getUserId(lee.globalState),
      shouldRememberMeForSSO: false,
    };
    const result = await carbonConnector.loginViaSSO(loginParams);
    setIsLoading(false);
    if (result.success) {
      setError("");
      let redirectRoute = SSO_DOWNLOAD;
      if (APP_PACKAGED_IN_EXTENSION) {
        redirectRoute = `${WEBAPP_LOGIN}?email=${validatedEmail}`;
      }
      redirectToUrl(redirectRoute);
    } else {
      const domain = validatedEmail.slice(validatedEmail.indexOf("@") + 1);
      switch (result.error.code) {
        case LoginViaSsoCode.SSO_VERIFICATION_FAILED:
          setError(translate(I18N_KEYS.ACCOUNT_ERROR, { domain }));
          break;
        case LoginViaSsoCode.SSO_LOGIN_CORRUPT:
          redirect(LOADER_URL_SEGMENT);
          break;
        default:
          setError(result.error.message ?? "");
          break;
      }
    }
  };
  const { isEu } = lee.carbon.currentLocation;
  switch (ssoSteps) {
    case SsoSteps.ACCOUNT_CREATION:
      return (
        <Terms
          isEu={isEu}
          onSubmit={handleAcceptTermsSubmit}
          memberEmail={validatedEmail}
          error={error}
        />
      );
    case SsoSteps.ASK_FOR_MP:
      return (
        <CreateMasterPassword
          onSubmit={confirmNewPassword}
          dispatchGlobal={lee.dispatchGlobal}
        />
      );
    case SsoSteps.CHANGE_MP_PROGRESS:
      return (
        <Progress
          animation={loadingLottie}
          shouldLoopAnimation={true}
          progressValue={progressValue}
        />
      );
    case SsoSteps.D_SPINNER:
    default:
      return (
        <div className={styles.loadingContainer}>
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
  }
};
