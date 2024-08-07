import { VaultSourceType } from "@dashlane/autofill-contracts";
import {
  PasskeyItemView,
  PremiumStatusSpaceItemView,
  PublicKeyCredentialDescriptorJSON,
  PublicKeyCredentialRequestOptionsJSONFuture,
  UserVerificationMethods,
  VaultAutofillView,
} from "@dashlane/communication";
import { base64UrlToArrayBuffer } from "@dashlane/framework-encoding";
import {
  AuthenticatorUserVerificationSource,
  CeremonyStatus,
} from "@dashlane/hermes";
import { ParsedURL } from "@dashlane/url-parser";
import { AutofillEngineContext } from "../../../../Api/server/context";
import { BrowserApi } from "../../../../Api/types/browser/browser-api";
import { UserVerificationUsageLogDetails } from "../../../../Api/types/webcards/user-verification-webcard";
import { isWebauthnRequestWebcardMetadata } from "../../../../implementation/commands/private-types";
import {
  AbstractWebcardMetadata,
  PendingOperationType,
  PendingWebauthnRequestOperation,
  WebauthnErrorName,
  WebauthnOperationType,
  WebauthnRequest,
  WebauthnResultError,
  WebcardItem,
  WebcardMetadataType,
} from "../../../../types";
import {
  logAuthenticateWithPasskeyEvent,
  logRegisterWithPasskeyEvent,
} from "../../../abstractions/logs/passkey-logs";
import {
  AutofillEngineActionsWithOptions,
  AutofillEngineActionTarget,
} from "../../../abstractions/messaging/action-serializer";
import { BROWSER_MAIN_FRAME_ID } from "../../../abstractions/messaging/common";
import { getFormattedWebcardItem } from "../../autofill/get-formatted-webcard-item";
import { getPremiumStatusSpaceItemView } from "../../autofill/user-focus-on-element-handler";
import { buildUserVerificationWebcardData } from "../user-verification/build-user-verification-webcard-data";
import { getAllPasskeysForThisDomainFromVault } from "../vault";
export class WebauthnUseFallback extends Error {
  public readonly errorName?: WebauthnErrorName;
  constructor(options?: { logError?: WebauthnErrorName }) {
    super();
    this.errorName = options?.logError;
  }
}
export class WebauthnSendError extends Error {
  public readonly errorName: WebauthnErrorName;
  constructor(errorName: WebauthnErrorName) {
    super();
    this.errorName = errorName;
  }
}
export enum AuthenticatorFlags {
  USER_PRESENT = 0b00000001,
  USER_VERIFIED = 0b00000100,
  BACKUP_ELIGIBILITY = 0b00001000,
  BACKUP_STATE = 0b00010000,
  ATTESTED_CRED_DATA_INCLUDED = 0b01000000,
  EXTENSION_DATA_INCLUDED = 0b10000000,
}
export const sha256 = (browserApi: BrowserApi, message: string) => {
  const data = new TextEncoder().encode(message);
  return browserApi.crypto.subtle.digest("SHA-256", data);
};
export const extractCredentialIds = (
  credentialDescriptors: PublicKeyCredentialDescriptorJSON[]
): string[] => {
  const credentialIds: string[] = [];
  for (const cred of credentialDescriptors) {
    credentialIds.push(cred.id);
    try {
      const rawCredentialId = base64UrlToArrayBuffer(cred.id);
      const decoder = new TextDecoder("utf-8", { fatal: true });
      credentialIds.push(decoder.decode(rawCredentialId));
    } catch (error) {}
  }
  return credentialIds;
};
export const getFilteredPasskeysFromVault = async (
  context: AutofillEngineContext,
  rpId: string,
  allowedCredentials: PublicKeyCredentialDescriptorJSON[],
  searchValue?: string
): Promise<PasskeyItemView[]> => {
  const existingPasskeysForRp = (
    await getAllPasskeysForThisDomainFromVault(context, rpId, searchValue)
  ).items;
  const allowedCredentialIds = extractCredentialIds(allowedCredentials);
  return allowedCredentials.length > 0
    ? existingPasskeysForRp.filter((passkey) =>
        allowedCredentialIds.includes(passkey.credentialId)
      )
    : existingPasskeysForRp;
};
export const getEffectiveDomainForOrigin = (
  requestOrigin: string | undefined
):
  | {
      effectiveDomain: string;
      requestOrigin: string;
    }
  | undefined => {
  if (!requestOrigin?.startsWith("*****")) {
    return;
  }
  const parsedRequestOrigin = new ParsedURL(requestOrigin);
  const effectiveDomain = parsedRequestOrigin.getHostname();
  if (
    !effectiveDomain ||
    effectiveDomain === "" ||
    parsedRequestOrigin.isUrlIP()
  ) {
    return;
  }
  return { effectiveDomain, requestOrigin };
};
export const isRpIdInvalidForEffectiveDomain = (
  rpId: string,
  effectiveDomain: string
): boolean => {
  const rpIdIsSuffixOfEffectiveDomain =
    rpId === effectiveDomain || effectiveDomain.endsWith(`.${rpId}`);
  const rpIdIsPublicSuffix = false;
  return !rpIdIsSuffixOfEffectiveDomain || rpIdIsPublicSuffix;
};
export const validateWebauthnRequestSender = (
  sender: chrome.runtime.MessageSender,
  request: WebauthnRequest
): {
  effectiveDomain: string;
  requestOrigin: string;
} => {
  if (
    sender.frameId !== BROWSER_MAIN_FRAME_ID &&
    (request.parentFrameId !== BROWSER_MAIN_FRAME_ID ||
      request.type === WebauthnOperationType.Create)
  ) {
    throw new WebauthnSendError(WebauthnErrorName.NotAllowedError);
  }
  const urlOrigin = sender.url ? new URL(sender.url).origin : undefined;
  const origin = sender.origin ?? urlOrigin;
  const getEffDomainResult = getEffectiveDomainForOrigin(origin);
  if (!getEffDomainResult) {
    throw new WebauthnSendError(WebauthnErrorName.NotAllowedError);
  }
  const { effectiveDomain, requestOrigin } = getEffDomainResult;
  const allowedDomains = request.publickeyCredentialsPermissionList?.map(
    (allowedOrigin) => {
      return getEffectiveDomainForOrigin(allowedOrigin)?.effectiveDomain;
    }
  );
  if (
    sender.frameId !== BROWSER_MAIN_FRAME_ID &&
    !allowedDomains?.includes(effectiveDomain)
  ) {
    throw new WebauthnSendError(WebauthnErrorName.NotAllowedError);
  }
  if (
    request.options.hints?.length === 1 &&
    request.options.hints.includes("security-key")
  ) {
    throw new WebauthnSendError(WebauthnErrorName.NotAllowedError);
  }
  return { effectiveDomain, requestOrigin };
};
export const webauthnUseOtherAuthenticatorHandler = (
  context: AutofillEngineContext,
  actions: AutofillEngineActionsWithOptions,
  _sender: chrome.runtime.MessageSender,
  requestOrMetadata:
    | WebauthnRequest
    | AbstractWebcardMetadata<WebcardMetadataType.WebauthnRequest>
): Promise<void> => {
  let request: WebauthnRequest;
  const metadata =
    requestOrMetadata as AbstractWebcardMetadata<WebcardMetadataType>;
  if (isWebauthnRequestWebcardMetadata(metadata)) {
    request = metadata.request;
  } else {
    request = requestOrMetadata as WebauthnRequest;
  }
  switch (request.type) {
    case WebauthnOperationType.Create:
      actions.webauthnCreateResponse(
        AutofillEngineActionTarget.AllFrames,
        request.requestId,
        {
          status: "useFallback",
          reason: "otherAuthenticator",
        }
      );
      break;
    case WebauthnOperationType.Get:
      actions.webauthnGetResponse(
        AutofillEngineActionTarget.AllFrames,
        request.requestId,
        {
          status: "useFallback",
          reason: "otherAuthenticator",
        }
      );
      break;
  }
  return Promise.resolve();
};
export const webauthnUserCanceledHandler = (
  context: AutofillEngineContext,
  actions: AutofillEngineActionsWithOptions,
  _sender: chrome.runtime.MessageSender,
  requestOrMetadata:
    | WebauthnRequest
    | AbstractWebcardMetadata<WebcardMetadataType.WebauthnRequest>
): Promise<void> => {
  let request: WebauthnRequest;
  const metadata =
    requestOrMetadata as AbstractWebcardMetadata<WebcardMetadataType>;
  if (isWebauthnRequestWebcardMetadata(metadata)) {
    request = metadata.request;
  } else {
    request = requestOrMetadata as WebauthnRequest;
  }
  const error: WebauthnResultError = {
    status: "error",
    errorName: WebauthnErrorName.NotAllowedError,
  };
  switch (request.type) {
    case WebauthnOperationType.Create:
      void logRegisterWithPasskeyEvent(
        context,
        request,
        CeremonyStatus.Cancelled
      );
      actions.webauthnCreateResponse(
        AutofillEngineActionTarget.AllFrames,
        request.requestId,
        error
      );
      break;
    case WebauthnOperationType.Get:
      void logAuthenticateWithPasskeyEvent(
        context,
        request,
        CeremonyStatus.Cancelled
      );
      actions.webauthnGetResponse(
        AutofillEngineActionTarget.AllFrames,
        request.requestId,
        error
      );
      break;
  }
  return Promise.resolve();
};
export const putRequestOriginInState = async (
  context: AutofillEngineContext,
  webcardId: string,
  origin: string
) => {
  const tabState = await context.state.tab.get();
  await context.state.tab.set({
    ...tabState,
    pendingWebauthnOperations: {
      ...tabState.pendingWebauthnOperations,
      [webcardId]: { origin },
    },
  });
};
export const takeRequestOriginFromState = async (
  context: AutofillEngineContext,
  webcardId: string
): Promise<string | undefined> => {
  const tabState = await context.state.tab.get();
  const { [webcardId]: match, ...rest } =
    tabState.pendingWebauthnOperations ?? {};
  await context.state.tab.set({
    ...tabState,
    pendingWebauthnOperations: rest,
  });
  return match?.origin;
};
export const buildWebcardItemsForPasskeyAssertion = async (
  context: AutofillEngineContext,
  premiumStatusSpaces: PremiumStatusSpaceItemView[],
  passkeyItems: PasskeyItemView[]
): Promise<
  {
    webcardItem: WebcardItem;
    vaultItem: VaultAutofillView;
  }[]
> => {
  const passkeyDetailedViews = await Promise.all(
    passkeyItems.map((passkey) =>
      context.connectors.carbon.getSinglePasskeyForAutofill(passkey.id)
    )
  );
  return passkeyDetailedViews.map((passkey) => ({
    webcardItem: {
      ...getFormattedWebcardItem({
        vaultType: VaultSourceType.Passkey,
        vaultItem: passkey,
        premiumStatusSpace: getPremiumStatusSpaceItemView(
          passkey,
          premiumStatusSpaces
        ),
      }),
      metadataKeys: [WebcardMetadataType.WebauthnRequest],
    },
    vaultItem: passkey,
  }));
};
export const getCredentialIdFormat = (
  credentialIdString: string
): "uuid" | "base64URL" => {
  const pattern = /[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}/i;
  return pattern.test(credentialIdString) ? "uuid" : "base64URL";
};
export const generateRandomizedTypedArray = (byteLength: number) =>
  crypto.getRandomValues(new Uint8Array(byteLength));
export const handleUserVerification = async (
  context: AutofillEngineContext,
  actions: AutofillEngineActionsWithOptions,
  request: WebauthnRequest,
  confirmationWebcardId: string
): Promise<"continue" | "stop"> => {
  const userVerificationRequested =
    request.type === WebauthnOperationType.Create
      ? request.options.authenticatorSelection?.userVerification
      : request.options.userVerification;
  const availableMethods =
    await context.connectors.carbon.getAvailableUserVerificationMethods();
  const hasOnlyMPCheckUVMethod = availableMethods.every(
    (method) => method === UserVerificationMethods.MasterPassword
  );
  const needUserVerification =
    (userVerificationRequested === "preferred" && !hasOnlyMPCheckUVMethod) ||
    userVerificationRequested === "required";
  if (!request.userVerificationDone && needUserVerification) {
    const usageLogDetails: UserVerificationUsageLogDetails = {
      source:
        request.type === WebauthnOperationType.Create
          ? AuthenticatorUserVerificationSource.PasskeyRegistration
          : AuthenticatorUserVerificationSource.PasskeyLogin,
    };
    const pendingOperation: PendingWebauthnRequestOperation = {
      type: PendingOperationType.Webauthn,
      request,
    };
    const webcard = await buildUserVerificationWebcardData(
      context,
      pendingOperation,
      usageLogDetails,
      confirmationWebcardId
    );
    actions.updateWebcard(AutofillEngineActionTarget.SenderFrame, webcard);
    return "stop";
  }
  actions.closeWebcard(
    AutofillEngineActionTarget.SenderFrame,
    confirmationWebcardId
  );
  return "continue";
};
