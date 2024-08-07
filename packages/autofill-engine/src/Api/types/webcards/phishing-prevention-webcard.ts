import { WebcardDataBase, WebcardType } from "./webcard-data-base";
export interface PhishingPreventionWebcardData extends WebcardDataBase {
  readonly webcardType: WebcardType.PhishingPrevention;
  readonly urlOfCopiedItem: string;
  readonly urlOfPasteDestination: string;
}
export const isPhishingPreventionWebcard = (
  obj: WebcardDataBase
): obj is PhishingPreventionWebcardData => {
  return obj.webcardType === WebcardType.PhishingPrevention;
};
