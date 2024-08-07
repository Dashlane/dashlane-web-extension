import { AutofillEngineContext } from "../../../../Api/server/context";
import { UserVerificationResult } from "../../../../client";
import {
  PendingWebauthnRequestOperation,
  WebauthnOperationType,
} from "../../../../types";
import { AutofillEngineActionsWithOptions } from "../../../abstractions/messaging/action-serializer";
import { webauthnUserCanceledHandler } from "../webauthn/webauthn-common";
import { webauthnCreateUserConfirmedHandler } from "../webauthn/webauthn-create";
import { webauthnGetUserConfirmedHandler } from "../webauthn/webauthn-get";
export const userVerificationCompleteForWebauthn = async (
  context: AutofillEngineContext,
  actions: AutofillEngineActionsWithOptions,
  sender: chrome.runtime.MessageSender,
  pendingOperation: PendingWebauthnRequestOperation,
  result: UserVerificationResult,
  webcardId: string
): Promise<void> => {
  if (result === UserVerificationResult.Success) {
    const request = { ...pendingOperation.request, userVerificationDone: true };
    switch (request.type) {
      case WebauthnOperationType.Create:
        await webauthnCreateUserConfirmedHandler(
          context,
          actions,
          sender,
          request,
          webcardId
        );
        break;
      case WebauthnOperationType.Get:
        if (!request.passkeyItemId) {
          await webauthnUserCanceledHandler(
            context,
            actions,
            sender,
            pendingOperation.request
          );
          throw new Error(
            "Can not complete webauthn get operation without passkey item id"
          );
        }
        await webauthnGetUserConfirmedHandler(
          context,
          actions,
          sender,
          request,
          request.passkeyItemId,
          webcardId
        );
        break;
      default:
        throw new Error("Pending operation not supported");
    }
  } else {
    await webauthnUserCanceledHandler(
      context,
      actions,
      sender,
      pendingOperation.request
    );
  }
};
