import { CoreServices } from "Services";
import {
  OpenSessionWithWebAuthnAuthenticatorError,
  OpenSessionWithWebAuthnAuthenticatorRequest,
  OpenSessionWithWebAuthnAuthenticatorResult,
} from "@dashlane/communication";
import { AssertionAuthenticator } from "Authentication/WebAuthnAuthentication/types";
import { makeLoginController } from "Login/LoginController";
import { sendBiometricLoginErrorLog } from "Login/helpers/logs";
export async function openSessionWithWebAuthnAuthenticator(
  coreServices: CoreServices,
  params: OpenSessionWithWebAuthnAuthenticatorRequest
): Promise<OpenSessionWithWebAuthnAuthenticatorResult> {
  const { credential, login, isRoamingAuthenticator } = params;
  const { storeService, webAuthnAuthenticationService } = coreServices;
  try {
    const authenticator: AssertionAuthenticator = {
      authenticationType: "webauthn.get",
      credential: {
        id: credential.id,
        type: credential.type,
        rawId: credential.rawId,
        response: credential.response,
      },
    };
    await webAuthnAuthenticationService.process(login, authenticator);
    const masterPasswordClearRaw = storeService.getUserSession().masterPassword;
    if (!masterPasswordClearRaw) {
      void sendBiometricLoginErrorLog(coreServices);
      return {
        success: false,
        error: {
          code: OpenSessionWithWebAuthnAuthenticatorError.MP_MISSING_IN_SESSION_ERROR,
        },
      };
    }
    const loginController = makeLoginController(coreServices);
    await loginController.openSessionWithMasterPassword(
      login,
      masterPasswordClearRaw,
      {
        triggeredByRememberMeType: "webauthn",
        isWebAuthnAuthenticatorRoaming: isRoamingAuthenticator,
        loginType: "Biometric",
      }
    );
    return {
      success: true,
    };
  } catch (error) {
    void sendBiometricLoginErrorLog(coreServices);
    return {
      success: false,
      error: {
        code: OpenSessionWithWebAuthnAuthenticatorError.UNKNOWN_ERROR,
      },
    };
  }
}
