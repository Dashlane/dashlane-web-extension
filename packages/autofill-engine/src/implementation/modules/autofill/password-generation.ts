import { v4 as uuidv4 } from "uuid";
import { AutofillEngineContext } from "../../../Api/server/context";
import { AutofillDetails } from "../../../Api/types/autofill";
import { WebcardType } from "../../../Api/types/webcards/webcard-data-base";
import { WarnGeneratedPasswordWebcardData } from "../../../Api/types/webcards/warn-generated-password-webcard";
import {
  AutofillEngineActionsWithOptions,
  AutofillEngineActionTarget,
} from "../../abstractions/messaging/action-serializer";
const buildWarnGeneratedPasswordWebcardData = (
  pendingOperation: AutofillDetails
): WarnGeneratedPasswordWebcardData => {
  return {
    webcardId: uuidv4(),
    webcardType: WebcardType.WarnGeneratedPassword,
    formType: pendingOperation.formClassification,
    pendingOperation,
  };
};
export const askUserToConfirmPasswordGeneration = (
  context: AutofillEngineContext,
  actions: AutofillEngineActionsWithOptions,
  pendingAutofillOperation: AutofillDetails
) => {
  const webcardData = buildWarnGeneratedPasswordWebcardData(
    pendingAutofillOperation
  );
  actions.showWebcard(AutofillEngineActionTarget.MainFrame, webcardData);
};
