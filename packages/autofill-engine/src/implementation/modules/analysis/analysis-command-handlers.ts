import { HandlersForModuleCommands } from "../../commands/handlers";
import { analysisResultsAvailableHandler } from "./analysis-results-available-handler";
import { applySelfCorrectingAutofillHandler } from "./apply-self-correcting-autofill-handler";
import { disableDashlaneOnFieldHandler } from "./disable-dashlane-on-field-handler";
import { documentCompleteHandler } from "./document-complete-handler";
import { userRightClickOnElementHandler } from "./user-right-click-on-element-handler";
export const AnalysisCommandHandlers: HandlersForModuleCommands<
  | "analysisResultsAvailable"
  | "userRightClickOnElement"
  | "documentComplete"
  | "applySelfCorrectingAutofill"
  | "disableDashlaneOnField"
> = {
  analysisResultsAvailable: analysisResultsAvailableHandler,
  documentComplete: documentCompleteHandler,
  applySelfCorrectingAutofill: applySelfCorrectingAutofillHandler,
  disableDashlaneOnField: disableDashlaneOnFieldHandler,
  userRightClickOnElement: userRightClickOnElementHandler,
};
