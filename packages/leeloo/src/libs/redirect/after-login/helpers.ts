import { Features, WebOnboardingModeEvent } from '@dashlane/communication';
import { FEATURE_FLIPS_WITHOUT_MODULE } from '@dashlane/framework-dashlane-application';
import { Store } from 'store/create';
import { redirect } from 'libs/router';
import { redirectPathUsed } from './actions';
import { ACCOUNT_CREATION_TAC_URL_SEGMENT, ACCOUNT_CREATION_URL_SEGMENT, ACCOUNT_RECOVERY_URL_SEGMENT, CHROME_WELCOME_URL_SEGMENT, CLIENT_TAC_LOGIN_URL_SEGMENT, CLIENT_TAC_URL_SEGMENT, DIRECT_LOGIN_URL_SEGMENT, EMPLOYEE_ACCOUNT_CREATION_URL_SEGMENT, LOADER_URL_SEGMENT, LOGIN_TAC_URL_SEGMENT, LOGIN_URL_SEGMENT, ONBOARDING_URL_SEGMENT, SSO_URL_SEGMENT, TEAM_CONSOLE_URL_SEGMENT, } from 'app/routes/constants';
import { isChromiumExtension } from 'libs/extension';
import { carbonConnector } from 'libs/carbon/connector';
const NO_REDIRECT_PATHS = [
    ACCOUNT_CREATION_URL_SEGMENT,
    ACCOUNT_CREATION_TAC_URL_SEGMENT,
    EMPLOYEE_ACCOUNT_CREATION_URL_SEGMENT,
    CLIENT_TAC_LOGIN_URL_SEGMENT,
    DIRECT_LOGIN_URL_SEGMENT,
    LOGIN_TAC_URL_SEGMENT,
    LOGIN_URL_SEGMENT,
    ACCOUNT_RECOVERY_URL_SEGMENT,
    SSO_URL_SEGMENT,
    LOADER_URL_SEGMENT,
];
const shouldRedirectAfterLogin = (path: string) => {
    return !NO_REDIRECT_PATHS.some((redirectPath: string) => path.startsWith(redirectPath));
};
const formatPath = (path: string) => {
    if (!path) {
        return '';
    }
    return `${path.startsWith('/') ? '' : '/'}${path}`.replace(/\/$/, '');
};
const getOnboardingUrl = (href: string) => {
    return isChromiumExtension(href)
        ? CHROME_WELCOME_URL_SEGMENT
        : ONBOARDING_URL_SEGMENT;
};
const getDefaultRedirectUrl = (isConsole: boolean, isConsoleRedirect: boolean, redirectPath: string) => {
    const defaultRedirect = isConsole
        ? APP_PACKAGED_IN_EXTENSION
            ? TEAM_CONSOLE_URL_SEGMENT
            : CLIENT_TAC_URL_SEGMENT
        : '/';
    return redirectPath &&
        isConsole === isConsoleRedirect &&
        redirectPath.startsWith(defaultRedirect)
        ? redirectPath
        : defaultRedirect;
};
export const getDefaultAfterLoginRedirectUrl = (redirectPath: string, webOnboardingMode: WebOnboardingModeEvent, accountFeatures: Features) => {
    const isFirstTimeOnboardingUser = webOnboardingMode.completedSteps?.onboardingHubShown === false;
    const hasSaexOnboardingHubAddPasswordsFF = accountFeatures[FEATURE_FLIPS_WITHOUT_MODULE.SaexOnboardingHubAddPasswords] ?? false;
    redirectPath = formatPath(redirectPath);
    const pathname = window?.location.href.split('#')?.[1] ?? '';
    const isConsole = pathname.includes('/console');
    const isConsoleRedirect = redirectPath.includes('/console');
    const shouldRedirectToWebOnboarding = !redirectPath &&
        !isConsole &&
        !isConsoleRedirect &&
        isFirstTimeOnboardingUser &&
        hasSaexOnboardingHubAddPasswordsFF &&
        APP_PACKAGED_IN_EXTENSION;
    return shouldRedirectToWebOnboarding
        ? getOnboardingUrl(window.location.href)
        : getDefaultRedirectUrl(isConsole, isConsoleRedirect, redirectPath);
};
export const redirectAfterLogin = async (store: Store) => {
    const { afterLogin } = store.getState();
    const { loggedIn } = await carbonConnector.getUserLoginStatus();
    if (!loggedIn || afterLogin.hasBeenRedirected) {
        return;
    }
    const webOnboardingMode = await carbonConnector.getWebOnboardingMode();
    const accountFeatures = await carbonConnector.getFeatures();
    const { redirectPath = '' } = afterLogin;
    const redirectTo = getDefaultAfterLoginRedirectUrl(redirectPath, webOnboardingMode, accountFeatures);
    redirect(redirectTo);
    store.dispatch(redirectPathUsed());
};
export const getAfterLoginRedirectUrl = (pathname: string) => {
    const shouldRegisterRedirectPath = shouldRedirectAfterLogin(pathname);
    return shouldRegisterRedirectPath ? decodeURIComponent(pathname) : null;
};
