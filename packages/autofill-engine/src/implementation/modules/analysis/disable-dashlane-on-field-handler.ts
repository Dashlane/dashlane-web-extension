import { v4 as uuidv4 } from "uuid";
import { AutofillEngineContext } from "../../../Api/server/context";
import {
  DisableDashlaneOnFieldOption,
  FocusInformations,
} from "../../../Api/types/autofill";
import {
  AutofillDropdownWebcardConfiguration,
  AutofillDropdownWebcardDataBase,
  FieldDisabledNotificationWebcardData,
} from "../../../Api/types/webcards/autofill-dropdown-webcard";
import { WebcardType } from "../../../Api/types/webcards/webcard-data-base";
import {
  AutofillEngineActionsWithOptions,
  AutofillEngineActionTarget,
} from "../../abstractions/messaging/action-serializer";
import { createAutofillRecipeBySourceTypeFromNewDataSources } from "./apply-self-correcting-autofill-handler";
import { createAndSaveUserAutofillCorrection } from "./user-autofill-correction";
export function buildFieldDisabledNotificationWebcardData(
  focusInformations: FocusInformations,
  webcardId?: string
): FieldDisabledNotificationWebcardData {
  return {
    webcardId: webcardId ?? uuidv4(),
    configuration:
      AutofillDropdownWebcardConfiguration.FieldDisabledNotification,
    webcardType: WebcardType.AutofillDropdown,
    srcElement: focusInformations,
    formType: focusInformations.formClassification,
    autofillRecipes: focusInformations.autofillRecipes,
  };
}
const disableDashlanePermanently = (
  context: AutofillEngineContext,
  actions: AutofillEngineActionsWithOptions,
  url: string,
  webcardInfos: AutofillDropdownWebcardDataBase
) => {
  void createAndSaveUserAutofillCorrection(
    context,
    url,
    webcardInfos.srcElement.persistentIdentifier,
    "none"
  );
  const focusInformations = {
    ...webcardInfos.srcElement,
    autofillRecipes: createAutofillRecipeBySourceTypeFromNewDataSources(
      webcardInfos.srcElement
    ),
    formClassification: webcardInfos.formType,
  };
  actions.updateWebcard(
    AutofillEngineActionTarget.SenderFrame,
    buildFieldDisabledNotificationWebcardData(
      focusInformations,
      webcardInfos.webcardId
    )
  );
};
export const disableDashlaneOnFieldHandler = (
  context: AutofillEngineContext,
  actions: AutofillEngineActionsWithOptions,
  sender: chrome.runtime.MessageSender,
  webcardInfos: AutofillDropdownWebcardDataBase,
  option: DisableDashlaneOnFieldOption
): Promise<void> => {
  if (!sender.tab?.url) {
    return Promise.resolve();
  }
  actions.disableDashlaneOnField(
    AutofillEngineActionTarget.AllFrames,
    webcardInfos.srcElement.elementId
  );
  if (option === DisableDashlaneOnFieldOption.PermanentlyDisable) {
    disableDashlanePermanently(context, actions, sender.tab.url, webcardInfos);
  }
  return Promise.resolve();
};
