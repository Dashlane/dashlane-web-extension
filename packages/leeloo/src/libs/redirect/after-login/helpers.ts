import { WebOnboardingModeEvent } from "@dashlane/communication";
import { actionGetUserSettings } from "@dashlane/webextensions-apis";
import { Store } from "../../../store/create";
import { redirect } from "../../router";
import { isChromiumExtension } from "../../extension";
import { carbonConnector } from "../../carbon/connector";
import { BuildConfigurationName } from "../../constant";
import { redirectPathUsed } from "./actions";
import {
  ACCOUNT_CREATION_TAC_URL_SEGMENT,
  ACCOUNT_CREATION_URL_SEGMENT,
  ACCOUNT_RECOVERY_URL_SEGMENT,
  CLIENT_TAC_LOGIN_URL_SEGMENT,
  CLIENT_TAC_URL_SEGMENT,
  CLIENT_URL_SEGMENT,
  EMPLOYEE_ACCOUNT_CREATION_URL_SEGMENT,
  LOADER_URL_SEGMENT,
  LOGIN_TAC_URL_SEGMENT,
  LOGIN_URL_SEGMENT,
  SSO_URL_SEGMENT,
  TEAM_CONSOLE_URL_SEGMENT,
} from "../../../app/routes/constants";
import { NamedRoutes } from "../../../app/routes/types";
import { TacTabs } from "../../../team/types";
const NO_REDIRECT_PATHS = [
  ACCOUNT_CREATION_URL_SEGMENT,
  ACCOUNT_CREATION_TAC_URL_SEGMENT,
  EMPLOYEE_ACCOUNT_CREATION_URL_SEGMENT,
  CLIENT_TAC_LOGIN_URL_SEGMENT,
  LOGIN_TAC_URL_SEGMENT,
  LOGIN_URL_SEGMENT,
  ACCOUNT_RECOVERY_URL_SEGMENT,
  SSO_URL_SEGMENT,
  LOADER_URL_SEGMENT,
];
const shouldRedirectAfterLogin = (path: string) => {
  return !NO_REDIRECT_PATHS.some((redirectPath: string) =>
    path.startsWith(redirectPath)
  );
};
const ALLOWED_CONSOLE_REDIRECTION_PATHS = [TacTabs.ACCOUNT];
export const shouldSaveConsoleRedirectPath = (path: string) => {
  const decodedPath = decodeURIComponent(path);
  return ALLOWED_CONSOLE_REDIRECTION_PATHS.some((redirectPath: string) =>
    decodedPath.startsWith(`/${redirectPath}`)
  );
};
const formatPath = (path: string) => {
  if (!path) {
    return "";
  }
  return `${path.startsWith("/") ? "" : "/"}${path}`.replace(/\/$/, "");
};
const getOnboardingUrl = (
  href: string,
  isExtensionPinned: boolean,
  hasAlreadySeenOnboarding: boolean,
  routes: NamedRoutes
): string => {
  return isChromiumExtension(href) &&
    !isExtensionPinned &&
    !hasAlreadySeenOnboarding
    ? routes.userChromeWelcome
    : routes.userOnboarding;
};
const getRootDefaultRedirectUrl = (
  isConsole: boolean,
  isPackagedInExtension: boolean,
  buildConfigurationName: BuildConfigurationName
): string => {
  if (isConsole && isPackagedInExtension) {
    return TEAM_CONSOLE_URL_SEGMENT;
  }
  if (isConsole && buildConfigurationName === BuildConfigurationName.ALL_APPS) {
    return CLIENT_TAC_URL_SEGMENT;
  }
  if (buildConfigurationName === BuildConfigurationName.ALL_APPS) {
    return CLIENT_URL_SEGMENT;
  }
  return "/";
};
const getDefaultRedirectUrl = ({
  isConsole,
  isConsoleRedirect,
  redirectPath,
  buildConfigurationName,
  isPackagedInExtension,
}: {
  isConsole: boolean;
  isConsoleRedirect: boolean;
  redirectPath: string;
  isPackagedInExtension: boolean;
  buildConfigurationName: BuildConfigurationName;
}): string => {
  const defaultRedirect = getRootDefaultRedirectUrl(
    isConsole,
    isPackagedInExtension,
    buildConfigurationName
  );
  return ((isConsole &&
    buildConfigurationName === BuildConfigurationName.TEAM_ADMIN_CONSOLE) ||
    isConsole === isConsoleRedirect) &&
    redirectPath?.startsWith(defaultRedirect)
    ? redirectPath
    : defaultRedirect;
};
const getShouldRedirectToOnboarding = ({
  buildConfigurationName,
  isConsole,
  isConsoleRedirect,
  redirectPath,
  credentialRoute,
  isFirstLogin,
}: {
  buildConfigurationName: BuildConfigurationName;
  isConsole: boolean;
  isConsoleRedirect: boolean;
  redirectPath: string;
  credentialRoute: string;
  isFirstLogin: boolean;
}): boolean => {
  if (
    buildConfigurationName === BuildConfigurationName.TEAM_ADMIN_CONSOLE ||
    (buildConfigurationName === BuildConfigurationName.ALL_APPS && isConsole)
  ) {
    return false;
  }
  if (redirectPath && redirectPath !== credentialRoute) {
    return false;
  }
  if (isFirstLogin) {
    return true;
  }
  if (isConsole || isConsoleRedirect) {
    return false;
  }
  return true;
};
export const getDefaultAfterLoginRedirectUrl = ({
  redirectPath,
  pathname,
  webOnboardingMode,
  routes,
  isPackagedInExtension,
  isExtensionPinned,
  buildConfigurationName,
}: {
  redirectPath: string;
  pathname: string;
  webOnboardingMode: WebOnboardingModeEvent;
  routes: NamedRoutes;
  isPackagedInExtension: boolean;
  isExtensionPinned: boolean;
  buildConfigurationName: BuildConfigurationName;
}): string => {
  const isFirstTimeOnboardingUser =
    webOnboardingMode.completedSteps?.onboardingHubShown === false;
  const isConsole =
    buildConfigurationName === BuildConfigurationName.TEAM_ADMIN_CONSOLE ||
    pathname.includes(TEAM_CONSOLE_URL_SEGMENT);
  redirectPath = formatPath(redirectPath);
  const isConsoleRedirect = redirectPath.includes(TEAM_CONSOLE_URL_SEGMENT);
  const shouldRedirectToWebOnboarding = getShouldRedirectToOnboarding({
    buildConfigurationName,
    isConsole,
    isConsoleRedirect,
    redirectPath,
    credentialRoute: routes.userCredentials,
    isFirstLogin: isFirstTimeOnboardingUser,
  });
  return shouldRedirectToWebOnboarding
    ? getOnboardingUrl(
        window.location.href,
        isExtensionPinned,
        !isFirstTimeOnboardingUser,
        routes
      )
    : getDefaultRedirectUrl({
        isConsole,
        isConsoleRedirect,
        redirectPath,
        isPackagedInExtension,
        buildConfigurationName,
      });
};
export const getIsExtensionPinned = async () => {
  try {
    if (!APP_PACKAGED_IN_EXTENSION || APP_PACKAGED_FOR_FIREFOX) {
      return false;
    }
    return (await actionGetUserSettings()).isOnToolbar;
  } catch (e) {
    return false;
  }
};
export const redirectAfterLogin = async (store: Store, routes: NamedRoutes) => {
  const { afterLogin } = store.getState();
  const { loggedIn } = await carbonConnector.getUserLoginStatus();
  if (!loggedIn || afterLogin.hasBeenRedirected) {
    return;
  }
  const webOnboardingMode = await carbonConnector.getWebOnboardingMode();
  const { redirectPath = "" } = afterLogin;
  const pathname = window?.location.hash.slice(1) ?? "";
  const redirectTo = getDefaultAfterLoginRedirectUrl({
    redirectPath,
    pathname,
    webOnboardingMode,
    routes,
    isExtensionPinned: await getIsExtensionPinned(),
    isPackagedInExtension: APP_PACKAGED_IN_EXTENSION,
    buildConfigurationName: BUILD_CONFIGURATION_NAME as BuildConfigurationName,
  });
  redirect(redirectTo);
  store.dispatch(redirectPathUsed());
};
export const getAfterLoginRedirectUrl = (pathname: string) => {
  const shouldRegisterRedirectPath = shouldRedirectAfterLogin(pathname);
  return shouldRegisterRedirectPath ? decodeURIComponent(pathname) : null;
};
