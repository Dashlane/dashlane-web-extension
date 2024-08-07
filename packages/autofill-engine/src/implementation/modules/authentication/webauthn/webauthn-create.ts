import {
  AddPasskeyRequest,
  PublicKeyCredentialCreationOptionsJSONFuture,
  WebAuthnPrivateKey,
} from "@dashlane/communication";
import {
  arrayBufferToBase64Url,
  base64UrlToArrayBuffer,
} from "@dashlane/framework-encoding";
import { CeremonyStatus } from "@dashlane/hermes";
import * as cbor from "cbor";
import { v4 as uuidv4 } from "uuid";
import { AutofillEngineContext } from "../../../../Api/server/context";
import {
  AttestationCredentialData,
  WebauthnCreationRequest,
  WebauthnErrorName,
} from "../../../../Api/types/webauthn";
import { checkHasPasskeySupport } from "../../../../config/feature-flips";
import {
  WebauthnCreateConfirmationWebcardData,
  WebcardType,
} from "../../../../types";
import { logRegisterWithPasskeyEvent } from "../../../abstractions/logs/passkey-logs";
import {
  AutofillEngineActionsWithOptions,
  AutofillEngineActionTarget,
} from "../../../abstractions/messaging/action-serializer";
import { getAllPasskeysForThisDomainFromVault } from "../vault";
import {
  AuthenticatorFlags,
  extractCredentialIds,
  generateRandomizedTypedArray,
  getCredentialIdFormat,
  handleUserVerification,
  isRpIdInvalidForEffectiveDomain,
  putRequestOriginInState,
  sha256,
  takeRequestOriginFromState,
  validateWebauthnRequestSender,
  WebauthnSendError,
  WebauthnUseFallback,
} from "./webauthn-common";
import {
  selectWebauthnCryptoAlgorithm,
  WebauthnCryptoAlgorithm,
} from "./webauthn-crypto-algorithms";
export const emptyAAGUID = new Uint8Array(16).fill(0);
export const dashlaneAAGUID = new Uint8Array([
  0x53, 0x11, 0x26, 0xd6, 0xe7, 0x17, 0x41, 0x5c, 0x93, 0x20, 0x3d, 0x9a, 0xa6,
  0x98, 0x12, 0x39,
]);
export const DomainsUsingEmptyAaguid: string[] = [];
function getAaguidForRpid(rpId: string): Uint8Array {
  for (const domain of DomainsUsingEmptyAaguid) {
    if (rpId === domain || rpId.endsWith(`.${domain}`)) {
      return emptyAAGUID;
    }
  }
  return dashlaneAAGUID;
}
const checkPasskeySupportFlag = async (context: AutofillEngineContext) => {
  const hasPasskeySupport = await checkHasPasskeySupport(context.connectors);
  if (!hasPasskeySupport) {
    throw new WebauthnUseFallback();
  }
};
const isAuthenticatorSelectionRequestValid = async (
  context: AutofillEngineContext,
  options: PublicKeyCredentialCreationOptionsJSONFuture
) => {
  const { authenticatorSelection, hints } = options;
  if (
    authenticatorSelection?.userVerification === "required" &&
    (await context.connectors.carbon.getAvailableUserVerificationMethods())
      .length === 0
  ) {
    return false;
  }
  const isHintsPresent = hints instanceof Array && hints.length > 0;
  if (
    !isHintsPresent &&
    authenticatorSelection?.authenticatorAttachment &&
    authenticatorSelection.authenticatorAttachment !== "platform"
  ) {
    return false;
  }
  if (
    authenticatorSelection?.residentKey &&
    authenticatorSelection.residentKey === "discouraged"
  ) {
    return false;
  }
  return true;
};
const isRpIdValidForDomain = (
  request: WebauthnCreationRequest,
  context: AutofillEngineContext,
  effectiveDomain: string
) => {
  request.options.rp.id = request.options.rp.id ?? effectiveDomain;
  const rpId = request.options.rp.id;
  if (isRpIdInvalidForEffectiveDomain(rpId, effectiveDomain)) {
    throw new WebauthnUseFallback({
      logError: WebauthnErrorName.SecurityError,
    });
  }
};
let startRegistrationTimeStamp: number;
export const webauthnCreateHandler = async (
  context: AutofillEngineContext,
  actions: AutofillEngineActionsWithOptions,
  sender: chrome.runtime.MessageSender,
  request: WebauthnCreationRequest
) => {
  try {
    startRegistrationTimeStamp = Date.now();
    const userLoginStatus =
      await context.connectors.carbon.getUserLoginStatus();
    if (!userLoginStatus.loggedIn) {
      throw new WebauthnUseFallback();
    }
    await checkPasskeySupportFlag(context);
    if (request.userVerificationDone) {
      throw new WebauthnSendError(WebauthnErrorName.InvalidStateError);
    }
    const { effectiveDomain, requestOrigin } = validateWebauthnRequestSender(
      sender,
      request
    );
    const rawUserId = base64UrlToArrayBuffer(request.options.user.id);
    if (rawUserId.byteLength < 1 || rawUserId.byteLength > 64) {
      throw new WebauthnUseFallback({
        logError: WebauthnErrorName.InvalidStateError,
      });
    }
    isRpIdValidForDomain(request, context, effectiveDomain);
    const cryptoAlgorithm = selectWebauthnCryptoAlgorithm(
      request.options.pubKeyCredParams
    );
    if (cryptoAlgorithm === undefined) {
      throw new WebauthnUseFallback({
        logError: WebauthnErrorName.NotSupportedError,
      });
    }
    if (
      !(await isAuthenticatorSelectionRequestValid(context, request.options))
    ) {
      throw new WebauthnUseFallback({
        logError: WebauthnErrorName.NotSupportedError,
      });
    }
    const webcard: WebauthnCreateConfirmationWebcardData = {
      webcardType: WebcardType.WebauthnCreateConfirmation,
      webcardId: uuidv4(),
      formType: "login",
      rpName: request.options.rp.name,
      userDisplayName: request.options.user.displayName,
      request,
    };
    await putRequestOriginInState(context, webcard.webcardId, requestOrigin);
    actions.showWebcard(AutofillEngineActionTarget.MainFrame, webcard);
  } catch (exception) {
    const errorName =
      exception instanceof WebauthnSendError ||
      exception instanceof WebauthnUseFallback
        ? exception.errorName
        : WebauthnErrorName.UnknownError;
    if (errorName) {
      void logRegisterWithPasskeyEvent(
        context,
        request,
        CeremonyStatus.Failure,
        errorName
      );
    }
    actions.webauthnCreateResponse(
      AutofillEngineActionTarget.SenderFrame,
      request.requestId,
      {
        status: "useFallback",
        reason: "cannotRegister",
      }
    );
    if (
      !(
        exception instanceof WebauthnSendError ||
        exception instanceof WebauthnUseFallback
      )
    ) {
      throw exception;
    }
  }
};
async function createPasskey(
  request: WebauthnCreationRequest,
  context: AutofillEngineContext
): Promise<{
  readonly cryptoAlgorithm: WebauthnCryptoAlgorithm;
  readonly credentialIdBuffer: Uint8Array;
  readonly credentialIdBase64Url: string;
  readonly counter: number;
  readonly publicKey: JsonWebKey;
  readonly rpId: string;
}> {
  const cryptoAlgorithm = selectWebauthnCryptoAlgorithm(
    request.options.pubKeyCredParams
  );
  if (cryptoAlgorithm === undefined) {
    throw new WebauthnSendError(WebauthnErrorName.NotSupportedError);
  }
  const { publicKey, privateKey } = await cryptoAlgorithm.generateNewKeyPair(
    context.browserApi
  );
  const rpId = request.options.rp.id;
  if (rpId === undefined) {
    throw new WebauthnSendError(WebauthnErrorName.SecurityError);
  }
  const privateKeyDefaults: WebAuthnPrivateKey = {
    crv: "",
    d: "",
    ext: true,
    key_ops: [],
    kty: "",
    x: "",
    y: "",
  };
  let credentialIdBuffer: Uint8Array;
  let credentialIdBase64Url: string;
  let premiumStatusSpaces = await context.connectors.carbon.getSpaces();
  premiumStatusSpaces =
    premiumStatusSpaces.length > 1 ? premiumStatusSpaces : [];
  do {
    credentialIdBuffer = generateRandomizedTypedArray(16);
    credentialIdBase64Url = arrayBufferToBase64Url(credentialIdBuffer);
  } while (getCredentialIdFormat(credentialIdBase64Url) === "uuid");
  const counter = 0;
  const userBusinessSpace = premiumStatusSpaces.find(
    (space) => space.spaceId !== ""
  );
  const isForcedCategorizationEnabled =
    userBusinessSpace?.settings.enableForcedCategorization;
  const spaceId = isForcedCategorizationEnabled
    ? userBusinessSpace.spaceId
    : "";
  const newPasskeyItem: AddPasskeyRequest = {
    credentialId: credentialIdBase64Url,
    rpId,
    rpName: request.options.rp.name,
    userHandle: request.options.user.id,
    userDisplayName: request.options.user.displayName,
    counter,
    spaceId,
    keyAlgorithm: cryptoAlgorithm.coseAlgorithmIdentifier,
    privateKey: {
      ...privateKeyDefaults,
      ...privateKey,
    },
  };
  const addPasskeyResult = await context.connectors.carbon.addPasskey(
    newPasskeyItem
  );
  if (!addPasskeyResult.success) {
    throw new WebauthnSendError(WebauthnErrorName.UnknownError);
  }
  return {
    cryptoAlgorithm,
    credentialIdBuffer,
    credentialIdBase64Url,
    counter,
    publicKey,
    rpId,
  };
}
const checkExcludedCredentials = async (
  context: AutofillEngineContext,
  actions: AutofillEngineActionsWithOptions,
  _sender: chrome.runtime.MessageSender,
  request: WebauthnCreationRequest,
  confirmationWebcardId: string
) => {
  const rpId = request.options.rp.id;
  if (request.options.excludeCredentials.length > 0 && rpId) {
    const existingPasskeysForRp = (
      await getAllPasskeysForThisDomainFromVault(context, rpId)
    ).items;
    const excludedCredentialIds = extractCredentialIds(
      request.options.excludeCredentials
    );
    if (
      existingPasskeysForRp.some((cred) =>
        excludedCredentialIds.includes(cred.credentialId)
      )
    ) {
      actions.closeWebcard(
        AutofillEngineActionTarget.SenderFrame,
        confirmationWebcardId
      );
      throw new WebauthnSendError(WebauthnErrorName.InvalidStateError);
    }
  }
};
export const webauthnCreateUserConfirmedHandler = async (
  context: AutofillEngineContext,
  actions: AutofillEngineActionsWithOptions,
  _sender: chrome.runtime.MessageSender,
  request: WebauthnCreationRequest,
  confirmationWebcardId: string
) => {
  try {
    const userLoginStatus =
      await context.connectors.carbon.getUserLoginStatus();
    if (!userLoginStatus.loggedIn) {
      throw new WebauthnSendError(WebauthnErrorName.InvalidStateError);
    }
    await checkExcludedCredentials(
      context,
      actions,
      _sender,
      request,
      confirmationWebcardId
    );
    const userVerificationResult = await handleUserVerification(
      context,
      actions,
      request,
      confirmationWebcardId
    );
    if (userVerificationResult === "stop") {
      return;
    }
    const requestOrigin = await takeRequestOriginFromState(
      context,
      confirmationWebcardId
    );
    if (requestOrigin === undefined) {
      throw new WebauthnSendError(WebauthnErrorName.InvalidStateError);
    }
    const collectedClientData = {
      type: "webauthn.create",
      challenge: request.options.challenge,
      origin: requestOrigin,
      crossOrigin: false,
    };
    const clientDataJSON = JSON.stringify(collectedClientData);
    const newPasskeyInfo = await createPasskey(request, context);
    const clientExtensionResults: AuthenticationExtensionsClientOutputs = {};
    if (request.options.extensions?.credProps) {
      clientExtensionResults.credProps = { rk: true };
    }
    const credentialIdBufferLength = new ArrayBuffer(2);
    new DataView(credentialIdBufferLength).setUint16(
      0,
      newPasskeyInfo.credentialIdBuffer.byteLength,
      false
    );
    const credentialPublicKey = newPasskeyInfo.cryptoAlgorithm.encodePublicKey(
      newPasskeyInfo.publicKey
    );
    const attestedCredentialData = await new Blob([
      getAaguidForRpid(newPasskeyInfo.rpId),
      credentialIdBufferLength,
      newPasskeyInfo.credentialIdBuffer,
      credentialPublicKey,
    ]).arrayBuffer();
    const rpIdHash = await sha256(context.browserApi, newPasskeyInfo.rpId);
    const flags = new Uint8Array([
      AuthenticatorFlags.USER_PRESENT |
        AuthenticatorFlags.ATTESTED_CRED_DATA_INCLUDED |
        AuthenticatorFlags.BACKUP_ELIGIBILITY |
        AuthenticatorFlags.BACKUP_STATE |
        (request.userVerificationDone ? AuthenticatorFlags.USER_VERIFIED : 0),
    ]);
    const counterBuffer = new ArrayBuffer(4);
    new DataView(counterBuffer).setUint32(0, newPasskeyInfo.counter, false);
    const authenticatorData = await new Blob([
      rpIdHash,
      flags,
      counterBuffer,
      attestedCredentialData,
    ]).arrayBuffer();
    const attestationObject = cbor.encode({
      fmt: "none",
      attStmt: {},
      authData: authenticatorData,
    });
    const credentialCreationData: AttestationCredentialData = {
      type: "public-key",
      rawId: newPasskeyInfo.credentialIdBase64Url,
      id: newPasskeyInfo.credentialIdBase64Url,
      clientDataJSON: arrayBufferToBase64Url(
        new TextEncoder().encode(clientDataJSON)
      ),
      attestationObject: arrayBufferToBase64Url(attestationObject),
      authenticatorAttachment: "platform",
      authenticatorData: arrayBufferToBase64Url(authenticatorData),
      publicKey: arrayBufferToBase64Url(credentialPublicKey),
      publicKeyAlgorithm:
        newPasskeyInfo.cryptoAlgorithm.coseAlgorithmIdentifier,
      transports: ["internal", "hybrid"],
      clientExtensionResults,
    };
    actions.webauthnCreateResponse(
      AutofillEngineActionTarget.AllFrames,
      request.requestId,
      {
        status: "success",
        value: credentialCreationData,
      }
    );
    const msToRegistration = Date.now() - startRegistrationTimeStamp;
    void logRegisterWithPasskeyEvent(
      context,
      request,
      CeremonyStatus.Success,
      undefined,
      msToRegistration
    );
  } catch (exception) {
    const errorName =
      exception instanceof WebauthnSendError
        ? exception.errorName
        : WebauthnErrorName.UnknownError;
    void logRegisterWithPasskeyEvent(
      context,
      request,
      CeremonyStatus.Failure,
      errorName
    );
    actions.webauthnCreateResponse(
      AutofillEngineActionTarget.AllFrames,
      request.requestId,
      { status: "error", errorName }
    );
    if (!(exception instanceof WebauthnSendError)) {
      throw exception;
    }
  }
};
