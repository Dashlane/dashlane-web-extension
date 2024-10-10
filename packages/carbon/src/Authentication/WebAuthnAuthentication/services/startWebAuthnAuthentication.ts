import {
  PublicKeyCredentialDescriptorJSON,
  PublicKeyCredentialRequestOptionsJSON,
} from "@dashlane/communication";
import { CoreServices } from "Services";
import { buildAssertionPublicKeyOptions } from "Authentication/WebAuthnAuthentication/helpers";
import { refreshAvailableWebAuthnAuthenticators } from "Authentication/WebAuthnAuthentication/services/refreshAvailableWebAuthnAuthenticators";
import {
  StartWebAuthnAuthenticationError,
  StartWebAuthnAuthenticationResult,
} from "Authentication/WebAuthnAuthentication/types";
import { isApiError, requestWebauthnOpenSession } from "Libs/DashlaneApi";
export async function startWebAuthnAuthentication(
  coreServices: CoreServices,
  login: string,
  relyingPartyId: string
): Promise<StartWebAuthnAuthenticationResult> {
  const { storeService } = coreServices;
  const availableCredentialsResult =
    await refreshAvailableWebAuthnAuthenticators(coreServices, {
      login,
    });
  if (!availableCredentialsResult.success) {
    return {
      success: false,
      error: {
        code: StartWebAuthnAuthenticationError.CANNOT_REFRESH_WEBAUTHN_AUTHENTICATORS,
      },
    };
  }
  const credentials: PublicKeyCredentialDescriptorJSON[] =
    availableCredentialsResult.response.authenticators.map((authenticator) => ({
      id: authenticator.credentialId,
      type: "public-key",
    }));
  const result = await requestWebauthnOpenSession(storeService, login);
  if (isApiError(result)) {
    return {
      success: false,
      error: {
        code: StartWebAuthnAuthenticationError.CANNOT_FETCH_WEBAUTHN_CHALLENGE,
      },
    };
  }
  const { challenge, expirationDateUnix } = result;
  const publicKeyOptions: PublicKeyCredentialRequestOptionsJSON =
    buildAssertionPublicKeyOptions(
      relyingPartyId,
      challenge,
      expirationDateUnix,
      credentials
    );
  return {
    success: true,
    response: {
      publicKeyOptions,
      authenticatorsInfo: availableCredentialsResult.response.authenticators,
    },
  };
}
