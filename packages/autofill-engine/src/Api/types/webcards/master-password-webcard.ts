import { PendingOperation } from "../pending-operation";
import { NeverAskAgainMode } from "./user-verification-webcard";
import { WebcardDataBase, WebcardType } from "./webcard-data-base";
export interface MasterPasswordWebcardData extends WebcardDataBase {
  readonly webcardType: WebcardType.MasterPassword;
  readonly userLogin: string;
  readonly neverAskAgainMode: NeverAskAgainMode;
  readonly wrongPassword: boolean;
  readonly pendingOperation: PendingOperation;
}
export const isMasterPasswordWebcard = (
  obj: WebcardDataBase
): obj is MasterPasswordWebcardData => {
  return obj.webcardType === WebcardType.MasterPassword;
};
