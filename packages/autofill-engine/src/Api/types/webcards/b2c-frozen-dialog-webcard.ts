import { WebcardDataBase, WebcardType } from "./webcard-data-base";
export interface B2CFrozenDialogWebcardData extends WebcardDataBase {
  readonly webcardType: WebcardType.B2CFrozenDialog;
  readonly savePasswordDisplayUrl: string;
  readonly passwordLimit: number;
}
export const isB2CFrozenDialogWebcard = (
  obj: WebcardDataBase
): obj is B2CFrozenDialogWebcardData => {
  return obj.webcardType === WebcardType.B2CFrozenDialog;
};
