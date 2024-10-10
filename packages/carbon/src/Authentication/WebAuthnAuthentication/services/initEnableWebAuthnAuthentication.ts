import { v4 as uuidv4 } from "uuid";
import {
  InitEnableWebAuthnAuthenticationError,
  InitEnableWebAuthnAuthenticationRequest,
  InitEnableWebAuthnAuthenticationResult,
  PublicKeyCredentialEnableOptionsJSON,
  WebAuthnCallTypes,
} from "@dashlane/communication";
import { isApiError, requestWebauthnRegistration } from "Libs/DashlaneApi";
import { CoreServices } from "Services";
import { userLoginSelector } from "Session/selectors";
import {
  authenticatorsAsCredentialSelector,
  webAuthnUserIdSelector,
} from "Authentication/selectors";
import { webAuthnUserIdUpdated } from "Authentication/Store/webAuthn/actions";
import { refreshWebAuthnAuthenticators } from "Authentication/WebAuthnAuthentication/services/refreshWebAuthnAuthenticators";
import {
  buildAssertionPublicKeyOptions,
  buildAttestationPublicKeyOptions,
} from "../helpers";
export async function initEnableWebAuthnAuthentication(
  coreServices: CoreServices,
  params: InitEnableWebAuthnAuthenticationRequest
): Promise<InitEnableWebAuthnAuthenticationResult> {
  const { storeService } = coreServices;
  const { relyingPartyId } = params;
  const state = storeService.getState();
  const login = userLoginSelector(storeService.getState());
  let webAuthnUserId = webAuthnUserIdSelector(state);
  if (!webAuthnUserId) {
    webAuthnUserId = uuidv4();
    storeService.dispatch(webAuthnUserIdUpdated(webAuthnUserId));
  }
  let credentials = authenticatorsAsCredentialSelector(state);
  if (!credentials || credentials.length === 0) {
    await refreshWebAuthnAuthenticators(coreServices);
    credentials = authenticatorsAsCredentialSelector(storeService.getState());
  }
  const webAuthnType =
    credentials?.length > 0 ? WebAuthnCallTypes.GET : WebAuthnCallTypes.CREATE;
  try {
    const result = await requestWebauthnRegistration(storeService, login);
    if (isApiError(result)) {
      return {
        success: false,
        error: {
          code: InitEnableWebAuthnAuthenticationError.UNKNOWN_ERROR,
        },
      };
    }
    const { challenge, expirationDateUnix } = result;
    let publicKeyOptions: PublicKeyCredentialEnableOptionsJSON;
    if (webAuthnType === WebAuthnCallTypes.CREATE) {
      publicKeyOptions = buildAttestationPublicKeyOptions(
        relyingPartyId,
        webAuthnUserId,
        login,
        challenge,
        expirationDateUnix,
        credentials
      );
    } else {
      publicKeyOptions = buildAssertionPublicKeyOptions(
        relyingPartyId,
        challenge,
        expirationDateUnix,
        credentials
      );
    }
    return {
      success: true,
      response: {
        publicKeyOptions,
        webAuthnType,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: InitEnableWebAuthnAuthenticationError.UNKNOWN_ERROR,
      },
    };
  }
}
