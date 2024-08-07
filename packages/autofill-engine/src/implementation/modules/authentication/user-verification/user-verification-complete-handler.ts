import { AutofillEngineContext } from "../../../../Api/server/context";
import { UserVerificationResult } from "../../../../client";
import {
  AbstractWebcardMetadata,
  PendingOperationType,
  WebcardMetadataType,
} from "../../../../types";
import { AutofillEngineActionsWithOptions } from "../../../abstractions/messaging/action-serializer";
import { isPendingOperationWebcardMetadata } from "../../../commands/private-types";
import { userVerificationCompleteForAutofill } from "./user-verification-complete-for-autofill";
import { userVerificationCompleteForCopy } from "./user-verification-complete-for-copy";
import { userVerificationCompleteForWebauthn } from "./user-verification-complete-for-webauthn";
export const userVerificationCompleteHandler = async (
  context: AutofillEngineContext,
  actions: AutofillEngineActionsWithOptions,
  sender: chrome.runtime.MessageSender,
  pendingOperation: AbstractWebcardMetadata<WebcardMetadataType.PendingOperation>,
  result: UserVerificationResult,
  options: {
    neverAgain?: boolean;
  },
  webcardId: string
): Promise<void> => {
  if (!isPendingOperationWebcardMetadata(pendingOperation)) {
    throw new Error("Invalid pending operation");
  }
  const operation = pendingOperation.operation;
  switch (operation.type) {
    case PendingOperationType.ApplyAutofillDetails:
      await userVerificationCompleteForAutofill(
        context,
        actions,
        sender,
        operation,
        result,
        options,
        webcardId
      );
      break;
    case PendingOperationType.Webauthn:
      await userVerificationCompleteForWebauthn(
        context,
        actions,
        sender,
        operation,
        result,
        webcardId
      );
      break;
    case PendingOperationType.CopyValue:
      await userVerificationCompleteForCopy(
        context,
        actions,
        sender,
        operation,
        result,
        webcardId
      );
      break;
    default:
      throw new Error("Pending operation not supported");
  }
};
