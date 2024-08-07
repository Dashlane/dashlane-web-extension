import { WebcardDataBase, WebcardType } from "./webcard-data-base";
import { WebcardItem } from "./webcard-item";
export interface WebauthnPasskeySelectionWebcardData extends WebcardDataBase {
  readonly webcardType: WebcardType.WebauthnPasskeySelection;
  readonly passkeys: WebcardItem[];
}
export const isWebauthnPasskeySelectionWebcard = (
  obj: WebcardDataBase
): obj is WebauthnPasskeySelectionWebcardData => {
  return obj.webcardType === WebcardType.WebauthnPasskeySelection;
};
