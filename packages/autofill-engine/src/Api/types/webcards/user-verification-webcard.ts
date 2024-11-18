import { UserVerificationMethods } from "@dashlane/authentication-contracts";
import { AuthenticatorUserVerificationSource } from "@dashlane/hermes";
import {
  WebcardDataBase,
  WebcardMetadataStore,
  WebcardMetadataType,
  WebcardType,
} from "./webcard-data-base";
export enum NeverAskAgainMode {
  None,
  VaultItem,
  Global,
}
export interface UserVerificationUsageLogDetails {
  readonly source: AuthenticatorUserVerificationSource;
}
export interface UserVerificationWebcardData extends WebcardDataBase {
  readonly webcardType: WebcardType.UserVerification;
  readonly userLogin: string;
  readonly neverAskAgainMode: NeverAskAgainMode;
  readonly availableMethods: UserVerificationMethods[];
  readonly defaultMethod?: UserVerificationMethods;
  readonly usageLogDetails: UserVerificationUsageLogDetails;
  readonly metadata: WebcardMetadataStore &
    Required<Pick<WebcardMetadataStore, WebcardMetadataType.PendingOperation>>;
}
export const isUserVerificationWebcard = (
  obj: WebcardDataBase
): obj is UserVerificationWebcardData => {
  return obj.webcardType === WebcardType.UserVerification;
};
