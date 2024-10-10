import { CoreServices } from "Services";
import {
  RegisterWebAuthnAuthenticatorError,
  RegisterWebAuthnAuthenticatorRequest,
  RegisterWebAuthnAuthenticatorResult,
} from "@dashlane/communication";
import { AttestationAuthenticator } from "Authentication/WebAuthnAuthentication/types";
import { userLoginSelector } from "Session/selectors";
import {
  completeWebAuthnAuthenticatorRegistration,
  isApiError,
} from "Libs/DashlaneApi";
import {
  authenticatorsSelector,
  hasOtp2TypeSelector,
} from "Authentication/selectors";
import { webAuthnAuthenticatorAdded } from "Authentication/Store/webAuthn/actions";
export async function registerWebAuthnAuthenticator(
  coreServices: CoreServices,
  params: RegisterWebAuthnAuthenticatorRequest
): Promise<RegisterWebAuthnAuthenticatorResult> {
  const { credential, isRoaming } = params;
  const { storeService, webAuthnAuthenticationService } = coreServices;
  const state = storeService.getState();
  const login = userLoginSelector(state);
  if (hasOtp2TypeSelector(state)) {
    return {
      success: false,
      error: {
        code: RegisterWebAuthnAuthenticatorError.USER_HAS_OTP,
      },
    };
  }
  try {
    const authenticator: AttestationAuthenticator = {
      authenticationType: "webauthn.create",
      name: login,
      isRoaming,
      credential: {
        id: credential.id,
        type: credential.type,
        rawId: credential.rawId,
        response: credential.response,
      },
    };
    const currentAuthenticators = authenticatorsSelector(state);
    if (!currentAuthenticators.length) {
      await webAuthnAuthenticationService.initialize(authenticator);
    } else {
      const result = await completeWebAuthnAuthenticatorRegistration(
        storeService,
        login,
        {
          authenticator,
        }
      );
      if (isApiError(result)) {
        return {
          success: false,
          error: {
            code: RegisterWebAuthnAuthenticatorError.UNKNOWN_ERROR,
          },
        };
      }
    }
    storeService.dispatch(
      webAuthnAuthenticatorAdded({
        name: authenticator.name,
        isRoaming: authenticator.isRoaming,
        credentialId: authenticator.credential.id,
        canOpenSession: true,
      })
    );
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: RegisterWebAuthnAuthenticatorError.UNKNOWN_ERROR,
      },
    };
  }
}
