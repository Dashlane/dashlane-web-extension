import { AutofillEngineContext } from "../../../Api/server/context";
import { AutofillEngineActionsWithOptions } from "../../abstractions/messaging/action-serializer";
import { handleOnboardingSavePasswordFlow } from "../autofill/onboarding";
export const cancelSaveCredentialHandler = async (
  context: AutofillEngineContext,
  actions: AutofillEngineActionsWithOptions
): Promise<void> => {
  await handleOnboardingSavePasswordFlow(context, actions, false);
};
