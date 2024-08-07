import { runtimeGetId } from "@dashlane/webextensions-apis";
import { AutofillEngineContext } from "../../../../Api/server/context";
import { WebAuthnStatus } from "../../../../types";
import {
  AutofillEngineActionsWithOptions,
  AutofillEngineActionTarget,
} from "../../../abstractions/messaging/action-serializer";
export async function startWebAuthnUserVerificationFlowHandler(
  context: AutofillEngineContext,
  actions: AutofillEngineActionsWithOptions
) {
  try {
    const relyingPartyId = runtimeGetId();
    const result =
      await context.connectors.carbon.initUserVerificationWithWebAuthn({
        relyingPartyId,
      });
    if (!result.success) {
      actions.updateWebAuthnStatus(
        AutofillEngineActionTarget.SenderFrame,
        WebAuthnStatus.Error
      );
      return;
    }
    const loginStatus = await context.connectors.carbon.getUserLoginStatus();
    actions.updateWebAuthnChallenge(AutofillEngineActionTarget.SenderFrame, {
      login: loginStatus.login,
      publicKeyOptions: result.response.publicKeyOptions,
    });
  } catch (error) {
    actions.updateWebAuthnStatus(
      AutofillEngineActionTarget.SenderFrame,
      WebAuthnStatus.Error
    );
    throw error;
  }
}
