import { CoreServices } from "Services";
import {
  AssertionCredentialJSONCustom,
  AttestationCredentialJSONCustom,
  AuthenticatorAssertionResponseJSON,
  AuthenticatorAttestationResponseJSON,
  EnableWebAuthnAuthenticationError,
  EnableWebAuthnAuthenticationFailure,
  EnableWebAuthnAuthenticationRequest,
  EnableWebAuthnAuthenticationResult,
  WebAuthnCallTypes,
} from "@dashlane/communication";
import {
  AssertionAuthenticator,
  AttestationAuthenticator,
} from "Authentication/WebAuthnAuthentication/types";
import { hasOtp2TypeSelector } from "Authentication/selectors";
import { userLoginSelector } from "Session/selectors";
import { WebAuthnAuthenticationService } from "Libs/RememberMe/WebAuthnAuthentication";
import { sendUserSettingsLog } from "UserSettingsLog/Services/send-user-settings-log";
const returnErrors: Record<
  EnableWebAuthnAuthenticationError,
  EnableWebAuthnAuthenticationFailure
> = {
  UNKNOWN_ERROR: {
    success: false,
    error: { code: EnableWebAuthnAuthenticationError.UNKNOWN_ERROR },
  },
  WEBAUTHN_SERVICE_INIT_FAILED: {
    success: false,
    error: {
      code: EnableWebAuthnAuthenticationError.WEBAUTHN_SERVICE_INIT_FAILED,
    },
  },
  USER_HAS_OTP: {
    success: false,
    error: {
      code: EnableWebAuthnAuthenticationError.USER_HAS_OTP,
    },
  },
};
async function handleCompleteAttestation(
  login: string,
  credential: AssertionCredentialJSONCustom | AttestationCredentialJSONCustom,
  isRoaming: boolean,
  webAuthnAuthenticationService: WebAuthnAuthenticationService
): Promise<EnableWebAuthnAuthenticationResult> {
  const credentialResponse =
    credential.response as AuthenticatorAttestationResponseJSON;
  const authenticator: AttestationAuthenticator = {
    authenticationType: "webauthn.create",
    name: login,
    isRoaming,
    credential: {
      id: credential.id,
      type: credential.type,
      rawId: credential.rawId,
      response: credentialResponse,
    },
  };
  const initialized = await webAuthnAuthenticationService.initialize(
    authenticator
  );
  if (!initialized) {
    return returnErrors.WEBAUTHN_SERVICE_INIT_FAILED;
  }
  return {
    success: true,
  };
}
async function handleCompleteAssertion(
  credential: AttestationCredentialJSONCustom | AssertionCredentialJSONCustom,
  webAuthnAuthenticationService: WebAuthnAuthenticationService
): Promise<EnableWebAuthnAuthenticationResult> {
  const credentialResponse =
    credential.response as AuthenticatorAssertionResponseJSON;
  const authenticator: AssertionAuthenticator = {
    authenticationType: "webauthn.get",
    credential: {
      id: credential.id,
      type: credential.type,
      rawId: credential.rawId,
      response: credentialResponse,
    },
  };
  const initialized = await webAuthnAuthenticationService.initialize(
    authenticator
  );
  if (!initialized) {
    return returnErrors.WEBAUTHN_SERVICE_INIT_FAILED;
  }
  return {
    success: true,
  };
}
export async function enableWebAuthnAuthentication(
  coreServices: CoreServices,
  params: EnableWebAuthnAuthenticationRequest
): Promise<EnableWebAuthnAuthenticationResult> {
  const { webAuthnAuthenticationService, storeService } = coreServices;
  const { authenticationType, credential, isRoaming } = params;
  const login = userLoginSelector(storeService.getState());
  if (hasOtp2TypeSelector(storeService.getState())) {
    return returnErrors.USER_HAS_OTP;
  }
  try {
    switch (authenticationType) {
      case WebAuthnCallTypes.CREATE: {
        const result = await handleCompleteAttestation(
          login,
          credential,
          isRoaming,
          webAuthnAuthenticationService
        );
        if (result.success) {
          sendUserSettingsLog(coreServices);
        }
        return result;
      }
      case WebAuthnCallTypes.GET: {
        const result = await handleCompleteAssertion(
          credential,
          webAuthnAuthenticationService
        );
        if (result.success) {
          sendUserSettingsLog(coreServices);
        }
        return result;
      }
      default:
        return returnErrors.UNKNOWN_ERROR;
    }
  } catch (error) {
    return returnErrors.UNKNOWN_ERROR;
  }
}
