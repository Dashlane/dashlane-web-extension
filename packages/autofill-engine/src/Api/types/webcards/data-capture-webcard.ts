import { DataCaptureWebcardItem } from "../data-capture";
import { WebcardDataBase, WebcardType } from "./webcard-data-base";
export interface DataCaptureWebcardData extends WebcardDataBase {
  readonly webcardType: WebcardType.DataCapture;
  readonly data: DataCaptureWebcardItem[];
  readonly loggedIn: boolean;
}
export const isDataCaptureWebcard = (
  obj: WebcardDataBase
): obj is DataCaptureWebcardData => {
  return obj.webcardType === WebcardType.DataCapture;
};
