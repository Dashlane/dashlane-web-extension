import {
  RefreshAvailableWebAuthnAuthenticatorsError,
  RefreshAvailableWebAuthnAuthenticatorsRequest,
  RefreshAvailableWebAuthnAuthenticatorsResult,
} from "@dashlane/communication";
import { sessionKeysSelector } from "Authentication/selectors";
import { AuthenticatorDetails } from "Authentication/Store/webAuthn/types";
import {
  getAvailableWebAuthnAuthenticators,
  isApiError,
} from "Libs/DashlaneApi";
import { CoreServices } from "Services";
import { webAuthnAvailableAuthenticatorsListUpdated } from "Authentication/Store/webAuthn/actions";
export async function refreshAvailableWebAuthnAuthenticators(
  coreServices: CoreServices,
  params: RefreshAvailableWebAuthnAuthenticatorsRequest
): Promise<RefreshAvailableWebAuthnAuthenticatorsResult> {
  const { storeService } = coreServices;
  const { login } = params;
  const sessionKeys = sessionKeysSelector(storeService.getState());
  if (!sessionKeys) {
    return {
      success: false,
      error: {
        code: RefreshAvailableWebAuthnAuthenticatorsError.MISSING_SESSION_KEYS_IN_STORE,
      },
    };
  }
  try {
    const result = await getAvailableWebAuthnAuthenticators(
      storeService,
      login
    );
    if (isApiError(result)) {
      return {
        success: false,
        error: {
          code: RefreshAvailableWebAuthnAuthenticatorsError.UNKNOWN_ERROR,
        },
      };
    }
    const authenticators: AuthenticatorDetails[] = result.authenticators.map(
      (authenticator) => ({
        ...authenticator,
        canOpenSession: true,
      })
    );
    storeService.dispatch(
      webAuthnAvailableAuthenticatorsListUpdated(authenticators)
    );
    return {
      success: true,
      response: {
        authenticators,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: RefreshAvailableWebAuthnAuthenticatorsError.UNKNOWN_ERROR,
      },
    };
  }
}
