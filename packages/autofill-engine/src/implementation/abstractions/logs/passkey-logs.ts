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
import {
  ActivityLogType,
  UserAuthenticatedWithPasskey,
} from "@dashlane/risk-monitoring-contracts";
import { ParsedURL } from "@dashlane/url-parser";
import { makeItemUsageActivityLog } from "./activity-logs";
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
async function sendPasskeyUsageActivityLog({
  context,
  rpId,
  displayName,
  currentDomain,
}: {
  context: AutofillEngineContext;
  rpId: string;
  displayName: string;
  currentDomain: string;
}) {
  const premiumStatus = await context.connectors.carbon.getNodePremiumStatus();
  if (premiumStatus.b2bStatus?.currentTeam) {
    const log = makeItemUsageActivityLog<UserAuthenticatedWithPasskey>(
      ActivityLogType.UserAuthenticatedWithPasskey,
      {
        passkey_domain: rpId,
        current_domain: currentDomain,
        credential_login: displayName,
      }
    );
    await context.connectors.grapheneClient.activityLogs.commands.storeActivityLogs(
      {
        activityLogs: [log],
      }
    );
  }
}
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
  sender: chrome.runtime.MessageSender,
  passkeyRegistrationStatus: CeremonyStatus,
  passkeyRegistrationErrorType?: WebauthnErrorName,
  msToCompleteRegistration?: number
): Promise<void> {
  if (passkeyRegistrationStatus === CeremonyStatus.Success) {
    await sendPasskeyUsageActivityLog({
      context,
      rpId: request.options.rp.id ?? "",
      currentDomain: sender.tab?.url
        ? new ParsedURL(sender.tab.url).getHostname()
        : "",
      displayName: request.options.user.displayName,
    });
  }
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
  sender: chrome.runtime.MessageSender,
  passkeyAuthenticationStatus: CeremonyStatus,
  passkeyAuthenticationErrorType?: WebauthnErrorName,
  msToCompleteAuthentication?: number,
  displayName?: string
): Promise<void> {
  if (passkeyAuthenticationStatus === CeremonyStatus.Success) {
    await sendPasskeyUsageActivityLog({
      context,
      rpId: request.options.rpId ?? "",
      currentDomain: sender.tab?.url
        ? new ParsedURL(sender.tab.url).getHostname()
        : "",
      displayName: displayName ?? "",
    });
  }
  await context.connectors.carbon.logEvent({
    event: await makeAnonymousAuthenticateWithPasskeyEvent(
      request,
      passkeyAuthenticationStatus,
      passkeyAuthenticationErrorType,
      msToCompleteAuthentication
    ),
  });
}
