import { AutofillEngineContext } from "../../../Api/server/context";
import {
  AutofillEngineActionsWithOptions,
  AutofillEngineActionTarget,
} from "../../abstractions/messaging/action-serializer";
export const validateMasterPasswordHandler = async (
  context: AutofillEngineContext,
  actions: AutofillEngineActionsWithOptions,
  _sender: chrome.runtime.MessageSender,
  password: string
): Promise<void> => {
  const isPasswordValidated =
    await context.connectors.carbon.validateMasterPassword(password);
  actions.setMasterPasswordValidationResult(
    AutofillEngineActionTarget.SenderFrame,
    isPasswordValidated
  );
};
