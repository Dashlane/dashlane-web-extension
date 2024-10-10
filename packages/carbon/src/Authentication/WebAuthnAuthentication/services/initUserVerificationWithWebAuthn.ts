import {
  InitUserVerificationWithWebAuthnError,
  InitUserVerificationWithWebAuthnRequest,
  InitUserVerificationWithWebAuthnResult,
} from "@dashlane/communication";
import { startWebAuthnAuthentication } from "Authentication/WebAuthnAuthentication/services/startWebAuthnAuthentication";
import { StartWebAuthnAuthenticationError } from "Authentication/WebAuthnAuthentication/types";
import { CoreServices } from "Services";
import { isAuthenticatedSelector, userLoginSelector } from "Session/selectors";
const startWebauthnErrorMap: Record<
  StartWebAuthnAuthenticationError,
  InitUserVerificationWithWebAuthnError
> = {
  [StartWebAuthnAuthenticationError.CANNOT_FETCH_WEBAUTHN_CHALLENGE]:
    InitUserVerificationWithWebAuthnError.CANNOT_FETCH_WEBAUTHN_CHALLENGE,
  [StartWebAuthnAuthenticationError.CANNOT_REFRESH_WEBAUTHN_AUTHENTICATORS]:
    InitUserVerificationWithWebAuthnError.CANNOT_REFRESH_WEBAUTHN_AUTHENTICATORS,
};
export async function initUserVerificationWithWebAuthn(
  coreServices: CoreServices,
  params: InitUserVerificationWithWebAuthnRequest
): Promise<InitUserVerificationWithWebAuthnResult> {
  try {
    const { storeService } = coreServices;
    const state = storeService.getState();
    if (!isAuthenticatedSelector(state)) {
      return {
        success: false,
        error: {
          code: InitUserVerificationWithWebAuthnError.LOGGED_OUT,
        },
      };
    }
    const login = userLoginSelector(state);
    const result = await startWebAuthnAuthentication(
      coreServices,
      login,
      params.relyingPartyId
    );
    if (result.success === false) {
      const code =
        startWebauthnErrorMap[result.error.code] ??
        InitUserVerificationWithWebAuthnError.UNKNOWN_ERROR;
      return {
        success: false,
        error: { code },
      };
    }
    return {
      success: true,
      response: {
        publicKeyOptions: result.response.publicKeyOptions,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: InitUserVerificationWithWebAuthnError.UNKNOWN_ERROR,
      },
    };
  }
}
