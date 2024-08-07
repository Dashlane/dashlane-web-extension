import { AutofillDropdownWebcardPasswordGenerationSettings } from "../../../types";
import { AutofillEngineActionTarget } from "../../abstractions/messaging/action-serializer";
import { HandlersForModuleCommands } from "../../commands/handlers";
import {
  applyAutofillRecipeForOtherDataSourceHandler,
  applyAutofillRecipeHandler,
} from "./apply-autofill-recipe-handler";
import { getVaultItemDetailsHandler } from "./get-vault-item-details-handler";
import { queryVaultItemsHandler } from "./query-vault-items-handler";
import { userFocusOnElementHandler } from "./user-focus-on-element-handler";
import { webcardItemSelectedHandler } from "./webcard-item-selected-handler";
import { logAutofillPerformedEventHandler } from "./log-autofill-performed-event-handler";
import { userValidatedMasterPasswordHandler } from "./user-validated-master-password-handler";
import { getCredentialsAtRiskByIdsHandler } from "./get-credentials-at-risk-by-ids-handler";
export const AutofillCommandHandlers: HandlersForModuleCommands<
  | "userFocusOnElement"
  | "applyAutofillRecipe"
  | "applyAutofillRecipeForOtherDataSource"
  | "logAutofillPerformedEvent"
  | "generateNewPassword"
  | "queryVaultItems"
  | "getVaultItemDetails"
  | "webcardItemSelected"
  | "userValidatedMasterPassword"
  | "getCredentialsAtRiskByIds"
> = {
  userFocusOnElement: userFocusOnElementHandler,
  applyAutofillRecipe: applyAutofillRecipeHandler,
  applyAutofillRecipeForOtherDataSource:
    applyAutofillRecipeForOtherDataSourceHandler,
  logAutofillPerformedEvent: logAutofillPerformedEventHandler,
  generateNewPassword: async (
    context,
    actions,
    _sender,
    settings: AutofillDropdownWebcardPasswordGenerationSettings
  ) => {
    const carbon = context.connectors.carbon;
    const genPwdResult = await carbon.generatePassword({
      settings: {
        digits: settings.digits,
        letters: settings.letters,
        avoidAmbiguous: settings.avoidAmbiguous,
        symbols: settings.symbols,
        length: settings.length,
      },
    });
    const [generatedPassword, passwordStrength] = genPwdResult.success
      ? [genPwdResult.password, genPwdResult.strength]
      : ["", -1];
    actions.updateNewPassword(
      AutofillEngineActionTarget.SenderFrame,
      generatedPassword,
      passwordStrength
    );
  },
  queryVaultItems: queryVaultItemsHandler,
  getVaultItemDetails: getVaultItemDetailsHandler,
  webcardItemSelected: webcardItemSelectedHandler,
  userValidatedMasterPassword: userValidatedMasterPasswordHandler,
  getCredentialsAtRiskByIds: getCredentialsAtRiskByIdsHandler,
};
