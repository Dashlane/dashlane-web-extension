import { AssertionCredentialJSON } from "@dashlane/authentication-contracts";
import { isSuccess } from "@dashlane/framework-types";
import { AutofillEngineContext } from "../../../../Api/server/context";
import { WebAuthnStatus } from "../../../../types";
import {
  AutofillEngineActionsWithOptions,
  AutofillEngineActionTarget,
} from "../../../abstractions/messaging/action-serializer";
export async function validateWebAuthnUserVerificationFlowHandler(
  context: AutofillEngineContext,
  actions: AutofillEngineActionsWithOptions,
  _sender: chrome.runtime.MessageSender,
  assertion: AssertionCredentialJSON
) {
  try {
    const result =
      await context.connectors.grapheneClient.userVerification.commands.validateWebauthnAssertion(
        {
          assertion,
        }
      );
    actions.updateWebAuthnStatus(
      AutofillEngineActionTarget.SenderFrame,
      isSuccess(result) ? WebAuthnStatus.Success : WebAuthnStatus.Error
    );
  } catch (error) {
    actions.updateWebAuthnStatus(
      AutofillEngineActionTarget.SenderFrame,
      WebAuthnStatus.Error
    );
    throw error;
  }
}
