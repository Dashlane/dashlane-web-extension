import { v4 as uuidv4 } from "uuid";
import {
  InitRegisterWebAuthnAuthenticatorError,
  InitRegisterWebAuthnAuthenticatorRequest,
  InitRegisterWebAuthnAuthenticatorResult,
} from "@dashlane/communication";
import { CoreServices } from "Services";
import { isApiError, requestWebauthnRegistration } from "Libs/DashlaneApi";
import { webAuthnUserIdUpdated } from "Authentication/Store/webAuthn/actions";
import { userLoginSelector } from "Session/selectors";
import {
  authenticatorsAsCredentialSelector,
  webAuthnUserIdSelector,
} from "Authentication/selectors";
import { buildAttestationPublicKeyOptions } from "../helpers";
import { refreshWebAuthnAuthenticators } from "Authentication/WebAuthnAuthentication/services/refreshWebAuthnAuthenticators";
export async function initRegisterWebAuthnAuthenticator(
  coreServices: CoreServices,
  params: InitRegisterWebAuthnAuthenticatorRequest
): Promise<InitRegisterWebAuthnAuthenticatorResult> {
  const { storeService } = coreServices;
  const { relyingPartyId } = params;
  const login = userLoginSelector(storeService.getState());
  let webAuthnUserId = webAuthnUserIdSelector(storeService.getState());
  if (!webAuthnUserId) {
    webAuthnUserId = uuidv4();
    storeService.dispatch(webAuthnUserIdUpdated(webAuthnUserId));
  }
  let credentials = authenticatorsAsCredentialSelector(storeService.getState());
  if (!credentials || credentials.length === 0) {
    await refreshWebAuthnAuthenticators(coreServices);
    credentials = authenticatorsAsCredentialSelector(storeService.getState());
  }
  try {
    const result = await requestWebauthnRegistration(storeService, login);
    if (isApiError(result)) {
      return {
        success: false,
        error: {
          code: InitRegisterWebAuthnAuthenticatorError.UNKNOWN_ERROR,
        },
      };
    }
    const { challenge, expirationDateUnix } = result;
    const publicKeyOptions = buildAttestationPublicKeyOptions(
      relyingPartyId,
      webAuthnUserId,
      login,
      challenge,
      expirationDateUnix,
      credentials
    );
    return {
      success: true,
      response: {
        publicKeyOptions,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: InitRegisterWebAuthnAuthenticatorError.UNKNOWN_ERROR,
      },
    };
  }
}
