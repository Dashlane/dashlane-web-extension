import { AutofillEngineContext } from "../../../../Api/server/context";
import { FollowUpNotificationWebcardData } from "../../../../Api/types/webcards/follow-up-notification-webcard";
import { UserVerificationResult } from "../../../../client";
import { PendingCopyOperation, WebcardType } from "../../../../types";
import {
  AutofillEngineActionsWithOptions,
  AutofillEngineActionTarget,
} from "../../../abstractions/messaging/action-serializer";
import { getAutofillDataFromVault } from "../../../abstractions/vault/get";
import { getValueToFillFromVaultItem } from "../../autofill/apply-autofill-recipe-handler";
import { getFormattedFollowUpNotificationWebcardData } from "../../autofill/get-formatted-webcard-item";
export const userVerificationCompleteForCopy = async (
  context: AutofillEngineContext,
  actions: AutofillEngineActionsWithOptions,
  sender: chrome.runtime.MessageSender,
  pendingOperation: PendingCopyOperation,
  result: UserVerificationResult,
  webcardId: string
): Promise<void> => {
  if (result === UserVerificationResult.Success) {
    if (!sender.url || !sender.tab?.url) {
      return;
    }
    await context.connectors.grapheneClient.autofillSecurity.commands.resetProtectedItemAutofillTimer();
    const { vaultIngredient, itemId, previouslyCopiedProperties } =
      pendingOperation;
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
  } else {
  }
};
