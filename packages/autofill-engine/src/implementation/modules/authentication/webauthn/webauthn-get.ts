import { PasskeyItemView, WebAuthnKeyAlgorithm } from "@dashlane/communication";
import { arrayBufferToBase64Url } from "@dashlane/framework-encoding";
import { CeremonyStatus } from "@dashlane/hermes";
import { v4 as uuidv4 } from "uuid";
import { AutofillEngineContext } from "../../../../Api/server/context";
import { WebauthnGetRequest } from "../../../../Api/types/webauthn";
import { checkHasPasskeySupport } from "../../../../config/feature-flips";
import { newWebcardMetadataStore } from "../../../../implementation/commands/private-types";
import {
  AssertionCredentialJSON,
  WebauthnErrorName,
  WebauthnGetConfirmationWebcardData,
  WebauthnPasskeySelectionWebcardData,
  WebcardMetadataType,
  WebcardType,
} from "../../../../types";
import { logAuthenticateWithPasskeyEvent } from "../../../abstractions/logs/passkey-logs";
import {
  AutofillEngineActionsWithOptions,
  AutofillEngineActionTarget,
} from "../../../abstractions/messaging/action-serializer";
import {
  AuthenticatorFlags,
  buildWebcardItemsForPasskeyAssertion,
  getCredentialIdFormat,
  getFilteredPasskeysFromVault,
  handleUserVerification,
  isRpIdInvalidForEffectiveDomain,
  putRequestOriginInState,
  sha256,
  takeRequestOriginFromState,
  validateWebauthnRequestSender,
  WebauthnSendError,
  WebauthnUseFallback,
} from "./webauthn-common";
import { supportedWebauthnAlgorithms } from "./webauthn-crypto-algorithms";
import { getAvailableUserVerificationMethods } from "../user-verification/get-available-user-verification-methods";
const handleShowWebauthnWebcards = async (
  actions: AutofillEngineActionsWithOptions,
  context: AutofillEngineContext,
  sender: chrome.runtime.MessageSender,
  request: WebauthnGetRequest,
  rpId: string
): Promise<void> => {
  const { requestOrigin } = validateWebauthnRequestSender(sender, request);
  const allowedCredentials = request.options.allowCredentials ?? [];
  const usablePasskeyItems = await getFilteredPasskeysFromVault(
    context,
    rpId,
    allowedCredentials
  );
  if (usablePasskeyItems.length === 0) {
    throw new WebauthnUseFallback();
  }
  if (usablePasskeyItems.length === 1) {
    const chosenPasskeyItem: PasskeyItemView = usablePasskeyItems[0];
    const webcard: WebauthnGetConfirmationWebcardData = {
      webcardType: WebcardType.WebauthnGetConfirmation,
      webcardId: uuidv4(),
      formType: "login",
      rpName: chosenPasskeyItem.rpName,
      request,
      allowUsingOtherAuthenticator: allowedCredentials.length === 0,
      passkey: {
        passkeyItemId: chosenPasskeyItem.id,
        userDisplayName: chosenPasskeyItem.userDisplayName,
      },
    };
    await putRequestOriginInState(context, webcard.webcardId, requestOrigin);
    actions.showWebcard(AutofillEngineActionTarget.MainFrame, webcard);
    return;
  }
  if (usablePasskeyItems.length > 1) {
    let premiumStatusSpaces = await context.connectors.carbon.getSpaces();
    premiumStatusSpaces =
      premiumStatusSpaces.length > 1 ? premiumStatusSpaces : [];
    const webcardData: WebauthnPasskeySelectionWebcardData = {
      webcardType: WebcardType.WebauthnPasskeySelection,
      webcardId: uuidv4(),
      formType: "login",
      passkeys: (
        await buildWebcardItemsForPasskeyAssertion(
          context,
          premiumStatusSpaces,
          usablePasskeyItems
        )
      ).map((webcardSingleItem) => webcardSingleItem.webcardItem),
      metadata: newWebcardMetadataStore({
        type: WebcardMetadataType.WebauthnRequest,
        request,
      }),
    };
    await putRequestOriginInState(
      context,
      webcardData.webcardId,
      requestOrigin
    );
    actions.showWebcard(AutofillEngineActionTarget.MainFrame, webcardData);
  }
};
const isRpIdValidForDomain = (
  request: WebauthnGetRequest,
  context: AutofillEngineContext,
  effectiveDomain: string
) => {
  request.options.rpId = request.options.rpId ?? effectiveDomain;
  const rpId = request.options.rpId;
  if (isRpIdInvalidForEffectiveDomain(rpId, effectiveDomain)) {
    throw new WebauthnUseFallback({
      logError: WebauthnErrorName.SecurityError,
    });
  }
};
let startAuthenticationTimestamp: number;
export const webauthnGetHandler = async (
  context: AutofillEngineContext,
  actions: AutofillEngineActionsWithOptions,
  sender: chrome.runtime.MessageSender,
  request: WebauthnGetRequest
) => {
  try {
    startAuthenticationTimestamp = Date.now();
    const { loggedIn } = await context.connectors.carbon.getUserLoginStatus();
    if (!loggedIn) {
      throw new WebauthnUseFallback();
    }
    const hasPasskeySupport = await checkHasPasskeySupport(context.connectors);
    if (!hasPasskeySupport) {
      throw new WebauthnUseFallback();
    }
    if (request.userVerificationDone) {
      throw new WebauthnSendError(WebauthnErrorName.InvalidStateError);
    }
    const { effectiveDomain } = validateWebauthnRequestSender(sender, request);
    isRpIdValidForDomain(request, context, effectiveDomain);
    const availableMethods = await getAvailableUserVerificationMethods(context);
    if (
      request.options.userVerification === "required" &&
      availableMethods.length === 0
    ) {
      throw new WebauthnUseFallback({
        logError: WebauthnErrorName.NotSupportedError,
      });
    }
    if (request.mediation === "conditional") {
      actions.webauthnStoreConditionalUiRequest(
        AutofillEngineActionTarget.SenderFrame,
        {
          ...request,
          mediation: "conditional",
        }
      );
      return;
    }
    request.options.rpId = request.options.rpId ?? effectiveDomain;
    const rpId = request.options.rpId;
    await handleShowWebauthnWebcards(actions, context, sender, request, rpId);
  } catch (exception) {
    const errorName =
      exception instanceof WebauthnSendError ||
      exception instanceof WebauthnUseFallback
        ? exception.errorName
        : WebauthnErrorName.UnknownError;
    if (errorName) {
      void logAuthenticateWithPasskeyEvent(
        context,
        request,
        sender,
        CeremonyStatus.Failure,
        errorName
      );
    }
    actions.webauthnGetResponse(
      AutofillEngineActionTarget.SenderFrame,
      request.requestId,
      {
        status: "useFallback",
        reason: "cannotAuthenticate",
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
export const webauthnGetUserConfirmedHandler = async (
  context: AutofillEngineContext,
  actions: AutofillEngineActionsWithOptions,
  _sender: chrome.runtime.MessageSender,
  request: WebauthnGetRequest,
  passkeyItemId: string,
  confirmationWebcardId: string
) => {
  try {
    const userLoginStatus =
      await context.connectors.carbon.getUserLoginStatus();
    if (!userLoginStatus.loggedIn) {
      throw new WebauthnSendError(WebauthnErrorName.InvalidStateError);
    }
    const userVerificationResult = await handleUserVerification(
      context,
      actions,
      { ...request, passkeyItemId },
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
      type: "webauthn.get",
      challenge: request.options.challenge,
      origin: requestOrigin,
      crossOrigin:
        request.parentFrameOrigin !== "" &&
        request.parentFrameOrigin !== undefined &&
        request.parentFrameOrigin !== requestOrigin,
    };
    const clientDataJSON = JSON.stringify(collectedClientData);
    const clientDataHash = await sha256(context.browserApi, clientDataJSON);
    const passkeyItem = await context.connectors.carbon.getPasskey(
      passkeyItemId
    );
    const counterHasPastIncrements =
      Number.isInteger(passkeyItem.counter) && passkeyItem.counter !== 0;
    const counter = counterHasPastIncrements ? passkeyItem.counter + 1 : 0;
    await context.connectors.carbon.updatePasskey({
      id: passkeyItemId,
      counter,
    });
    const rpIdHash = await sha256(context.browserApi, passkeyItem.rpId);
    const flags = new Uint8Array([
      AuthenticatorFlags.USER_PRESENT |
        AuthenticatorFlags.BACKUP_ELIGIBILITY |
        AuthenticatorFlags.BACKUP_STATE |
        (request.userVerificationDone ? AuthenticatorFlags.USER_VERIFIED : 0),
    ]);
    const counterBuffer = new ArrayBuffer(4);
    new DataView(counterBuffer).setUint32(0, counter, false);
    const authenticatorData = await new Blob([
      rpIdHash,
      flags,
      counterBuffer,
    ]).arrayBuffer();
    const cryptoAlgorithm = supportedWebauthnAlgorithms.find(
      (algorithm) =>
        algorithm.coseAlgorithmIdentifier === passkeyItem.keyAlgorithm
    );
    if (
      cryptoAlgorithm === undefined ||
      passkeyItem.keyAlgorithm === WebAuthnKeyAlgorithm.CloudPasskey
    ) {
      throw new WebauthnSendError(WebauthnErrorName.NotSupportedError);
    }
    const signature = await cryptoAlgorithm.sign(
      await new Blob([authenticatorData, clientDataHash]).arrayBuffer(),
      passkeyItem.privateKey
    );
    const credentialIdBuffer = new TextEncoder().encode(
      passkeyItem.credentialId
    );
    const credentialIdBase64Url =
      getCredentialIdFormat(passkeyItem.credentialId) === "uuid"
        ? arrayBufferToBase64Url(credentialIdBuffer)
        : passkeyItem.credentialId;
    const assertionCredential: AssertionCredentialJSON = {
      type: "public-key",
      rawId: credentialIdBase64Url,
      id: credentialIdBase64Url,
      response: {
        authenticatorData: arrayBufferToBase64Url(authenticatorData),
        clientDataJSON: arrayBufferToBase64Url(
          new TextEncoder().encode(clientDataJSON)
        ),
        signature: arrayBufferToBase64Url(signature),
        userHandle: passkeyItem.userHandle,
      },
      authenticatorAttachment: "platform",
    };
    actions.webauthnGetResponse(
      AutofillEngineActionTarget.AllFrames,
      request.requestId,
      {
        status: "success",
        value: assertionCredential,
      }
    );
    const msToAuthentication = Date.now() - startAuthenticationTimestamp;
    void logAuthenticateWithPasskeyEvent(
      context,
      request,
      _sender,
      CeremonyStatus.Success,
      undefined,
      msToAuthentication,
      passkeyItem.userDisplayName
    );
  } catch (exception) {
    const errorName =
      exception instanceof WebauthnSendError
        ? exception.errorName
        : WebauthnErrorName.UnknownError;
    void logAuthenticateWithPasskeyEvent(
      context,
      request,
      _sender,
      CeremonyStatus.Failure,
      errorName
    );
    actions.webauthnGetResponse(
      AutofillEngineActionTarget.AllFrames,
      request.requestId,
      { status: "error", errorName }
    );
    if (!(exception instanceof WebauthnSendError)) {
      throw exception;
    }
  }
};
