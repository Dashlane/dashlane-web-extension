import { AutofillEngineContext } from "../../../Api/server/context";
import { FollowUpNotificationWebcardData } from "../../../Api/types/webcards/follow-up-notification-webcard";
import {
  PendingOperation,
  PendingOperationType,
  WebauthnOperationType,
  WebcardType,
} from "../../../types";
import {
  AutofillEngineActionsWithOptions,
  AutofillEngineActionTarget,
} from "../../abstractions/messaging/action-serializer";
import { getAutofillDataFromVault } from "../../abstractions/vault/get";
import { webauthnCreateUserConfirmedHandler } from "../authentication/webauthn/webauthn-create";
import { webauthnGetUserConfirmedHandler } from "../authentication/webauthn/webauthn-get";
import {
  applyAutofillRecipeForVaultDataSourceHandler,
  getValueToFillFromVaultItem,
} from "./apply-autofill-recipe-handler";
import { getFormattedFollowUpNotificationWebcardData } from "./get-formatted-webcard-item";
export const userValidatedMasterPasswordHandler = async (
  context: AutofillEngineContext,
  actions: AutofillEngineActionsWithOptions,
  sender: chrome.runtime.MessageSender,
  pendingOperationData: PendingOperation,
  webcardId: string
): Promise<void> => {
  switch (pendingOperationData.type) {
    case PendingOperationType.ApplyAutofillDetails:
      applyAutofillRecipeForVaultDataSourceHandler(
        context,
        actions,
        sender,
        pendingOperationData.data
      );
      break;
    case PendingOperationType.Webauthn:
      if (pendingOperationData.request.type === WebauthnOperationType.Create) {
        webauthnCreateUserConfirmedHandler(
          context,
          actions,
          sender,
          { ...pendingOperationData.request, userVerificationDone: true },
          webcardId
        );
      }
      if (
        pendingOperationData.request.type === WebauthnOperationType.Get &&
        pendingOperationData.request.passkeyItemId
      ) {
        webauthnGetUserConfirmedHandler(
          context,
          actions,
          sender,
          { ...pendingOperationData.request, userVerificationDone: true },
          pendingOperationData.request.passkeyItemId,
          webcardId
        );
      }
      break;
    case PendingOperationType.CopyValue: {
      if (!sender.url || !sender.tab?.url) {
        return;
      }
      const { vaultIngredient, itemId, previouslyCopiedProperties } =
        pendingOperationData;
      const vaultItem = await getAutofillDataFromVault(
        context,
        vaultIngredient.type,
        itemId,
        sender.tab.url
      );
      if (!vaultItem) {
        return;
      }
      const valueToCopy = await getValueToFillFromVaultItem(context, {
        ingredient: vaultIngredient,
        vaultItem,
      });
      const webcardData = getFormattedFollowUpNotificationWebcardData(
        vaultItem,
        vaultIngredient.type
      );
      const followUpNotificationWebcard: FollowUpNotificationWebcardData = {
        webcardType: WebcardType.FollowUpNotification,
        webcardId,
        formType: "",
        webcardData,
        copiedProperties: [
          ...previouslyCopiedProperties,
          vaultIngredient.property,
        ],
      };
      if (valueToCopy) {
        actions.copyValueToClipboard(
          AutofillEngineActionTarget.AllFrames,
          valueToCopy
        );
        actions.updateWebcard(
          AutofillEngineActionTarget.SenderFrame,
          followUpNotificationWebcard
        );
      }
      break;
    }
    default:
      throw new Error("Pending operation not supported");
  }
};
