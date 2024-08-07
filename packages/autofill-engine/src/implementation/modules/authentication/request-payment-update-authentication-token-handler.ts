import { AutofillEngineContext } from "../../../Api/server/context";
import {
  AutofillEngineActionsWithOptions,
  AutofillEngineActionTarget,
} from "../../abstractions/messaging/action-serializer";
export const requestPaymentUpdateAuthenticationTokenHandler = async (
  context: AutofillEngineContext,
  actions: AutofillEngineActionsWithOptions
): Promise<void> => {
  const token =
    await context.connectors.carbon.requestPaymentUpdateAuthenticationToken();
  actions.updatePaymentUpdateAuthenticationToken(
    AutofillEngineActionTarget.SenderFrame,
    token
  );
};
