import { AutofillEngineContext } from "../../../../Api/server/context";
import { UserVerificationResult } from "../../../../client";
import {
  AutofillEngineActionsWithOptions,
  AutofillEngineActionTarget,
} from "../../../abstractions/messaging/action-serializer";
import { PendingApplyAutofillDetailsOperation } from "../../../commands/private-types";
import { applyAutofillRecipeForVaultDataSourceHandler } from "../../autofill/apply-autofill-recipe-handler";
import { disableAccessProtectionForVaultItemHandler } from "../password-protection";
export const userVerificationCompleteForAutofill = async (
  context: AutofillEngineContext,
  actions: AutofillEngineActionsWithOptions,
  sender: chrome.runtime.MessageSender,
  pendingOperation: PendingApplyAutofillDetailsOperation,
  result: UserVerificationResult,
  options: {
    neverAgain?: boolean;
  },
  webcardId: string
): Promise<void> => {
  if (result === UserVerificationResult.Success) {
    await context.connectors.grapheneClient.autofillSecurity.commands.resetProtectedItemAutofillTimer();
    if (options.neverAgain) {
      await disableAccessProtectionForVaultItemHandler(
        context,
        actions,
        sender,
        pendingOperation.data.dataSource.vaultId
      );
    }
    await applyAutofillRecipeForVaultDataSourceHandler(
      context,
      actions,
      sender,
      pendingOperation.data
    );
    actions.closeWebcard(AutofillEngineActionTarget.SenderFrame, webcardId);
  } else {
  }
};
