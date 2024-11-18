import type { LocalAccountInfo } from "@dashlane/communication";
import { logError } from "Logs/Debugger";
import { CoreServices } from "Services/";
import { makeLoginController } from "Login/LoginController";
import { sendExceptionLog } from "Logs/Exception/";
import { reactivationStatusUpdated } from "Authentication/Store/localAccounts/actions";
import { ReactivationStatus } from "Authentication/Store/localAccounts/types";
import { updateLoginStepInfoLogin } from "LoginStepInfo/Store/actions";
import { disableAutoSSOLoginSelector } from "Killswitch/selectors";
function dispatchWebAuthnReactivationStatus({ storeService }: CoreServices) {
  try {
    const supportedFeatures: string[] = (
      document as any
    ).featurePolicy.features();
    if (supportedFeatures.includes("publickey-credentials-get")) {
      storeService.dispatch(
        reactivationStatusUpdated(ReactivationStatus.WEBAUTHN)
      );
    }
  } catch (e) {
    storeService.dispatch(
      reactivationStatusUpdated(ReactivationStatus.CLASSIC)
    );
  }
}
export async function restoreLastAuthenticatedUser(
  services: CoreServices,
  localAccounts: LocalAccountInfo[]
): Promise<void> {
  try {
    const { applicationModulesAccess, storeService } = services;
    const lastLocalAccountUsed = localAccounts.find(
      (account) => account.isLastSuccessfulLogin
    );
    if (!lastLocalAccountUsed || lastLocalAccountUsed.hasLoginOtp) {
      return;
    }
    const state = storeService.getState();
    if (state.userSession.ssoSettings.ssoUser) {
      return;
    }
    const login = lastLocalAccountUsed.login;
    const localUsers = state.authentication.localUsers;
    const isSsoActivatedUser =
      localUsers[login] !== undefined
        ? localUsers[login].ssoActivatedUser
        : false;
    if (isSsoActivatedUser) {
      const isAutoSsoLoginDisabled = disableAutoSSOLoginSelector(state);
      if (!isAutoSsoLoginDisabled) {
        services.storeService.dispatch(updateLoginStepInfoLogin(login));
        if (lastLocalAccountUsed.rememberMeType === "sso") {
          void applicationModulesAccess
            .createClients()
            .authenticationFlow.commands.initiateAutologinWithSSO({
              login: login ?? "",
            });
        }
      }
      return;
    }
    if (lastLocalAccountUsed.rememberMeType === "webauthn") {
      dispatchWebAuthnReactivationStatus(services);
      return;
    }
    const shouldTriggerAutoLogin =
      await services.autoLoginService.shouldTrigger(login);
    const loginController = makeLoginController(services);
    if (!shouldTriggerAutoLogin) {
      loginController.openSession(login);
      return;
    }
    await services.autoLoginService.process(login);
    const masterPasswordDeciphered =
      services.storeService.getUserSession().masterPassword;
    if (!masterPasswordDeciphered) {
      return;
    }
    await loginController.openSessionWithMasterPassword(
      login,
      masterPasswordDeciphered,
      {
        triggeredByRememberMeType: "autologin",
        loginType: "Autologin",
      }
    );
  } catch (error) {
    const message = `[index] - restoreLastAuthenticatedUser: ${error}`;
    const augmentedError = new Error(message);
    logError({ message, details: { error: augmentedError } });
    sendExceptionLog({ error: augmentedError });
  }
}
