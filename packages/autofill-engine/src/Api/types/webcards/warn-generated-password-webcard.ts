import { WebcardDataBase, WebcardType } from "./webcard-data-base";
import { AutofillDetails } from "../autofill";
export interface WarnGeneratedPasswordWebcardData extends WebcardDataBase {
  readonly webcardType: WebcardType.WarnGeneratedPassword;
  readonly pendingOperation: AutofillDetails;
}
export const isWarnGeneratedPasswordWebcard = (
  obj: WebcardDataBase
): obj is WarnGeneratedPasswordWebcardData => {
  return obj.webcardType === WebcardType.WarnGeneratedPassword;
};
