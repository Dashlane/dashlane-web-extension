import {
  AnonymousAuthenticateWithPasskeyEvent,
  AnonymousRegisterPasskeyEvent,
  CeremonyStatus,
  DomainType,
  hashDomain,
  WebauthnExtensionId,
} from "@dashlane/hermes";
import { AutofillEngineContext } from "../../../Api/server/context";
import {
  authenticatorAttachmentStringToHermesAuthenticatorAttachmentType,
  authenticatorResidentKeyRequirementToAuthenticatorResidentKeyHermesType,
  authenticatorUserVerificationRequirementToHermesType,
  credentialMediationRequirementToHermesAuthenticationMediationType,
  mapOptional,
  numberToCorrespondingAlgorithmName,
  WebauthnCreationRequest,
  WebauthnErrorName,
  webAuthnErrorNameToHermesPasskeyAuthenticationErrorType,
  webAuthnErrorNameToHermesPasskeyRegistrationErrorType,
  WebauthnGetRequest,
} from "../../../types";
const getWebauthnExtensionSupportedList = (
  authenticationExtensions?: AuthenticationExtensionsClientInputs
) => {
  const supportedExtensionList: WebauthnExtensionId[] = [];
  if (authenticationExtensions?.appid) {
    supportedExtensionList.push(WebauthnExtensionId.Appid);
  }
  if (authenticationExtensions?.credProps) {
    supportedExtensionList.push(WebauthnExtensionId.CredProps);
  }
  if (authenticationExtensions?.hmacCreateSecret) {
    supportedExtensionList.push(WebauthnExtensionId.HmacSecret);
  }
  return supportedExtensionList;
};
export async function makeAnonymousRegisterPasskeyEvent(
  request: WebauthnCreationRequest,
  passkeyRegistrationStatus: CeremonyStatus,
  passkeyRegistrationErrorType?: WebauthnErrorName,
  msToCompleteRegistration?: number
): Promise<AnonymousRegisterPasskeyEvent> {
  const rpSupportedAlgorithms = request.options.pubKeyCredParams.map(
    (param) => numberToCorrespondingAlgorithmName[param.alg]
  );
  return new AnonymousRegisterPasskeyEvent({
    algorithmsSupportedList: rpSupportedAlgorithms,
    authenticatorAttachment: mapOptional(
      request.options.authenticatorSelection?.authenticatorAttachment,
      authenticatorAttachmentStringToHermesAuthenticatorAttachmentType
    ),
    authenticatorResidentKey: mapOptional(
      request.options.authenticatorSelection?.residentKey,
      authenticatorResidentKeyRequirementToAuthenticatorResidentKeyHermesType
    ),
    authenticatorUserVerification: mapOptional(
      request.options.authenticatorSelection?.userVerification,
      authenticatorUserVerificationRequirementToHermesType
    ),
    domain: {
      type: DomainType.Web,
      id: await hashDomain(request.options.rp.id ?? ""),
    },
    isRegisteredWithDashlane:
      passkeyRegistrationStatus === CeremonyStatus.Success,
    msToCompleteRegistration,
    msToCompleteRegistrationTimeout: request.options.timeout,
    passkeyRegistrationErrorType: mapOptional(
      passkeyRegistrationErrorType,
      webAuthnErrorNameToHermesPasskeyRegistrationErrorType
    ),
    passkeyRegistrationStatus,
    webauthnExtensionSupportedList: getWebauthnExtensionSupportedList(
      request.options.extensions
    ),
  });
}
export async function logRegisterWithPasskeyEvent(
  context: AutofillEngineContext,
  request: WebauthnCreationRequest,
  passkeyRegistrationStatus: CeremonyStatus,
  passkeyRegistrationErrorType?: WebauthnErrorName,
  msToCompleteRegistration?: number
): Promise<void> {
  await context.connectors.carbon.logEvent({
    event: await makeAnonymousRegisterPasskeyEvent(
      request,
      passkeyRegistrationStatus,
      passkeyRegistrationErrorType,
      msToCompleteRegistration
    ),
  });
}
export async function makeAnonymousAuthenticateWithPasskeyEvent(
  request: WebauthnGetRequest,
  passkeyAuthenticationStatus: CeremonyStatus,
  passkeyAuthenticationErrorType?: WebauthnErrorName,
  msToCompleteAuthentication?: number
): Promise<AnonymousAuthenticateWithPasskeyEvent> {
  return new AnonymousAuthenticateWithPasskeyEvent({
    authenticationMediationType: mapOptional(
      request.mediation,
      credentialMediationRequirementToHermesAuthenticationMediationType
    ),
    authenticatorUserVerification: mapOptional(
      request.options.userVerification,
      authenticatorUserVerificationRequirementToHermesType
    ),
    domain: {
      type: DomainType.Web,
      id: await hashDomain(request.options.rpId ?? ""),
    },
    hasCredentialsAllowed: !!request.options.allowCredentials,
    isAuthenticatedWithDashlane:
      passkeyAuthenticationStatus === CeremonyStatus.Success,
    msToCompleteAuthentication,
    msToCompleteAuthenticationTimeout: request.options.timeout,
    passkeyAuthenticationErrorType: mapOptional(
      passkeyAuthenticationErrorType,
      webAuthnErrorNameToHermesPasskeyAuthenticationErrorType
    ),
    passkeyAuthenticationStatus,
    webauthnExtensionSupportedList: getWebauthnExtensionSupportedList(
      request.options.extensions
    ),
  });
}
export async function logAuthenticateWithPasskeyEvent(
  context: AutofillEngineContext,
  request: WebauthnGetRequest,
  passkeyAuthenticationStatus: CeremonyStatus,
  passkeyAuthenticationErrorType?: WebauthnErrorName,
  msToCompleteAuthentication?: number
): Promise<void> {
  await context.connectors.carbon.logEvent({
    event: await makeAnonymousAuthenticateWithPasskeyEvent(
      request,
      passkeyAuthenticationStatus,
      passkeyAuthenticationErrorType,
      msToCompleteAuthentication
    ),
  });
}
