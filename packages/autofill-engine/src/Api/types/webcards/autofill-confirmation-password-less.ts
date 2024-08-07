import { AutofillDetails } from "../autofill";
import { WebcardDataBase, WebcardType } from "./webcard-data-base";
export interface AutofillConfirmationPasswordLessWebcardData
  extends WebcardDataBase {
  readonly webcardType: WebcardType.AutofillConfirmationPasswordLess;
  readonly pendingOperation?: AutofillDetails;
}
export const isAutofillConfirmationPasswordLessWebcard = (
  obj: WebcardDataBase
): obj is AutofillConfirmationPasswordLessWebcardData => {
  return obj.webcardType === WebcardType.AutofillConfirmationPasswordLess;
};
