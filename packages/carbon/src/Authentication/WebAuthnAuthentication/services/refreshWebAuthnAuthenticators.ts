import {
  RefreshWebAuthnAuthenticatorsError,
  RefreshWebAuthnAuthenticatorsResult,
} from "@dashlane/communication";
import { AuthenticatorDetails } from "Authentication/Store/webAuthn/types";
import { getWebAuthnAuthenticators, isApiError } from "Libs/DashlaneApi";
import { CoreServices } from "Services";
import { userLoginSelector } from "Session/selectors";
import { webAuthnAuthenticatorsListUpdated } from "Authentication/Store/webAuthn/actions";
export async function refreshWebAuthnAuthenticators(
  coreServices: CoreServices
): Promise<RefreshWebAuthnAuthenticatorsResult> {
  const { storeService } = coreServices;
  const login = userLoginSelector(storeService.getState());
  try {
    const result = await getWebAuthnAuthenticators(storeService, login);
    if (isApiError(result)) {
      return {
        success: false,
        error: {
          code: RefreshWebAuthnAuthenticatorsError.UNKNOWN_ERROR,
        },
      };
    }
    const authenticators: AuthenticatorDetails[] = result.authenticators.map(
      (authenticator) => ({
        ...authenticator,
        canOpenSession: false,
      })
    );
    storeService.dispatch(webAuthnAuthenticatorsListUpdated(authenticators));
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
        code: RefreshWebAuthnAuthenticatorsError.UNKNOWN_ERROR,
      },
    };
  }
}
