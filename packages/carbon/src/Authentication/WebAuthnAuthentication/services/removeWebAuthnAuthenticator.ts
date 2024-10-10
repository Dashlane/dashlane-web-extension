import {
  RemoveWebAuthnAuthenticatorError,
  RemoveWebAuthnAuthenticatorRequest,
  RemoveWebAuthnAuthenticatorResult,
} from "@dashlane/communication";
import { StoreService } from "Store";
import { CoreServices } from "Services";
import { userLoginSelector } from "Session/selectors";
import { deactivateWebAuthnAuthenticator, isApiError } from "Libs/DashlaneApi";
import {
  authenticatorsSelector,
  webAuthnAuthenticationOptedInSelector,
} from "Authentication/selectors";
import { disableWebAuthnAuthentication } from "./disableWebAuthnAuthentication";
import { webAuthnAuthenticatorRemoved } from "Authentication/Store/webAuthn/actions";
async function deactivateAuthenticator(
  storeService: StoreService,
  login: string,
  credentialId: string
): Promise<RemoveWebAuthnAuthenticatorResult> {
  const result = await deactivateWebAuthnAuthenticator(storeService, login, {
    credentialId,
  });
  if (isApiError(result)) {
    return {
      success: false,
      error: {
        code: RemoveWebAuthnAuthenticatorError.CANNOT_REMOVE_WEBAUTHN_AUTHENTICATOR,
      },
    };
  }
  return {
    success: true,
  };
}
export async function removeWebAuthnAuthenticator(
  coreServices: CoreServices,
  params: RemoveWebAuthnAuthenticatorRequest
): Promise<RemoveWebAuthnAuthenticatorResult> {
  const { credentialId } = params;
  const { storeService } = coreServices;
  const state = storeService.getState();
  const login = userLoginSelector(state);
  const isWebAuthnEnabled = webAuthnAuthenticationOptedInSelector(state);
  const currentAuthenticators = authenticatorsSelector(state);
  try {
    let deactivateResult = null;
    if (isWebAuthnEnabled && currentAuthenticators.length === 1) {
      await disableWebAuthnAuthentication(coreServices);
      deactivateResult = await deactivateAuthenticator(
        storeService,
        login,
        credentialId
      );
    } else {
      deactivateResult = await deactivateAuthenticator(
        storeService,
        login,
        credentialId
      );
    }
    if (deactivateResult.success) {
      storeService.dispatch(webAuthnAuthenticatorRemoved(credentialId));
    }
    return deactivateResult;
  } catch (error) {
    return {
      success: false,
      error: {
        code: RemoveWebAuthnAuthenticatorError.UNKNOWN_ERROR,
      },
    };
  }
}
