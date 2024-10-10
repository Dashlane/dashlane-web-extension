import { VerificationMode } from "@dashlane/hermes";
import {
  InitOpenSessionWithWebAuthnAuthenticatorError,
  InitOpenSessionWithWebAuthnAuthenticatorRequest,
  InitOpenSessionWithWebAuthnAuthenticatorResult,
} from "@dashlane/communication";
import { CoreServices } from "Services";
import { startWebAuthnAuthentication } from "Authentication/WebAuthnAuthentication/services/startWebAuthnAuthentication";
import { StartWebAuthnAuthenticationError } from "Authentication/WebAuthnAuthentication/types";
import { sendAskBiometricAuthenticationEventLog } from "Login/helpers/logs";
export async function initOpenSessionWithWebAuthnAuthenticator(
  coreServices: CoreServices,
  params: InitOpenSessionWithWebAuthnAuthenticatorRequest
): Promise<InitOpenSessionWithWebAuthnAuthenticatorResult> {
  const { relyingPartyId, login } = params;
  const { webAuthnAuthenticationService } = coreServices;
  try {
    const shouldTrigger = await webAuthnAuthenticationService.shouldTrigger(
      login
    );
    if (!shouldTrigger) {
      return {
        success: false,
        error: {
          code: InitOpenSessionWithWebAuthnAuthenticatorError.CANNOT_TRIGGER_WEBAUTHN_AUTHENTICATION,
        },
      };
    }
    void sendAskBiometricAuthenticationEventLog(
      coreServices,
      VerificationMode.None
    );
    const result = await startWebAuthnAuthentication(
      coreServices,
      login,
      relyingPartyId
    );
    if (result.success === false) {
      let code = InitOpenSessionWithWebAuthnAuthenticatorError.UNKNOWN_ERROR;
      switch (result.error.code) {
        case StartWebAuthnAuthenticationError.CANNOT_REFRESH_WEBAUTHN_AUTHENTICATORS:
          code =
            InitOpenSessionWithWebAuthnAuthenticatorError.UNAVAILABLE_AUTHENTICATORS;
          break;
      }
      return {
        success: false,
        error: { code },
      };
    }
    return {
      success: true,
      response: {
        publicKeyOptions: result.response.publicKeyOptions,
        authenticatorsInfo: result.response.authenticatorsInfo.map(
          ({ credentialId, isRoaming }) => ({
            credentialId,
            isRoaming,
          })
        ),
      },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: InitOpenSessionWithWebAuthnAuthenticatorError.UNKNOWN_ERROR,
      },
    };
  }
}
