import { AutofillRecipeBySourceType } from "../autofill";
import { WebcardDataBase, WebcardType } from "./webcard-data-base";
import { WebcardItem } from "./webcard-item";
export interface AutologinSelectionWebcardData extends WebcardDataBase {
  readonly webcardType: WebcardType.AutologinSelection;
  readonly webcards: WebcardItem[];
  readonly extensionShortcuts?: string[];
  readonly autofillRecipes: AutofillRecipeBySourceType;
}
export const isAutologinSelectionWebcard = (
  obj: WebcardDataBase
): obj is AutologinSelectionWebcardData => {
  return obj.webcardType === WebcardType.AutologinSelection;
};
