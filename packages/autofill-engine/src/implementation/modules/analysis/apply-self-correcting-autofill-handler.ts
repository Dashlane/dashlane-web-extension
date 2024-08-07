import {
  AutofillDataSourceOrNone,
  AutofillDataSourceRef,
} from "@dashlane/autofill-contracts";
import { AutofillEngineContext } from "../../../Api/server/context";
import {
  AutofillIngredient,
  AutofillRecipeBySourceType,
  AutofillRequestOriginType,
  DisableDashlaneOnFieldOption,
} from "../../../Api/types/autofill";
import {
  AutofillDropdownWebcardConfiguration,
  AutofillDropdownWebcardData,
  AutofillDropdownWebcardDataBase,
  SrcElementDetails,
} from "../../../Api/types/webcards/autofill-dropdown-webcard";
import { WebcardItem } from "../../../Api/types/webcards/webcard-item";
import {
  AutofillEngineActionsWithOptions,
  AutofillEngineActionTarget,
} from "../../abstractions/messaging/action-serializer";
import { applyAutofillRecipeHandler } from "../autofill/apply-autofill-recipe-handler";
import { buildDropdownWebcardData } from "../autofill/user-focus-on-element-handler";
import {
  buildIngredientsFromDataSources,
  insertIngredientInRecipesBySourceType,
} from "./analysis-results-available-handler";
import { createAndSaveUserAutofillCorrection } from "./user-autofill-correction";
import { disableDashlaneOnFieldHandler } from "./disable-dashlane-on-field-handler";
export const createAutofillRecipeBySourceTypeFromNewDataSources = (
  srcElementDetails: SrcElementDetails,
  newDataSources?: AutofillDataSourceRef
): AutofillRecipeBySourceType => {
  const { elementId, frameId } = srcElementDetails;
  const autofillRecipesBySourceType: AutofillRecipeBySourceType = {};
  const ingredients: AutofillIngredient[] = buildIngredientsFromDataSources(
    newDataSources,
    srcElementDetails.fieldFormat
  );
  for (const ingredient of ingredients) {
    insertIngredientInRecipesBySourceType(
      ingredient,
      frameId,
      elementId,
      "",
      autofillRecipesBySourceType
    );
  }
  return autofillRecipesBySourceType;
};
const autofillOrUpdateWebcard = async (
  context: AutofillEngineContext,
  actions: AutofillEngineActionsWithOptions,
  sender: chrome.runtime.MessageSender,
  webcardData: AutofillDropdownWebcardData,
  selectedItem?: WebcardItem
) => {
  const { autofillRecipes, configuration, formType, srcElement, webcardId } =
    webcardData;
  const itemToFill =
    selectedItem ??
    (configuration === AutofillDropdownWebcardConfiguration.Classic &&
    webcardData.items.length === 1
      ? webcardData.items[0]
      : undefined);
  if (itemToFill) {
    actions.closeWebcard(AutofillEngineActionTarget.SenderFrame, webcardId);
    const autofillRecipe = autofillRecipes[itemToFill.itemType];
    if (autofillRecipe) {
      await applyAutofillRecipeHandler(context, actions, sender, {
        autofillRecipe,
        dataSource: {
          type: itemToFill.itemType,
          vaultId: itemToFill.itemId,
        },
        formClassification: formType,
        focusedElement: srcElement,
        requestOrigin: {
          type: AutofillRequestOriginType.UserAppliedAutofillCorrection,
        },
      });
    }
  } else {
    actions.updateWebcard(AutofillEngineActionTarget.SenderFrame, webcardData);
  }
};
export const applySelfCorrectingAutofillHandler = async (
  context: AutofillEngineContext,
  actions: AutofillEngineActionsWithOptions,
  sender: chrome.runtime.MessageSender,
  webcardInfos: AutofillDropdownWebcardDataBase,
  correction: {
    dataSource: AutofillDataSourceOrNone;
    selectedItem?: WebcardItem;
  }
) => {
  if (!sender.tab?.url) {
    return;
  }
  const {
    formType,
    srcElement,
    webcardId,
    context: warningContext,
    warningType,
  } = webcardInfos;
  void createAndSaveUserAutofillCorrection(
    context,
    sender.tab.url,
    srcElement.persistentIdentifier,
    correction.dataSource
  );
  if (correction.dataSource === "none") {
    void disableDashlaneOnFieldHandler(
      context,
      actions,
      sender,
      webcardInfos,
      DisableDashlaneOnFieldOption.PermanentlyDisable
    );
    return;
  }
  const focusInformations = {
    ...srcElement,
    autofillRecipes: createAutofillRecipeBySourceTypeFromNewDataSources(
      srcElement,
      correction.dataSource
    ),
    formClassification: formType,
  };
  const webcardData = {
    ...(await buildDropdownWebcardData(
      context,
      sender.tab.url,
      sender.url ?? "",
      sender,
      focusInformations,
      webcardId
    )),
    context: warningContext,
    warningType,
  };
  await autofillOrUpdateWebcard(
    context,
    actions,
    sender,
    webcardData,
    correction.selectedItem
  );
};
