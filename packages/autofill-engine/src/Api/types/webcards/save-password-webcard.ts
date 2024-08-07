import {
  WebcardCollectionData,
  WebcardDataBase,
  WebcardSpacesData,
  WebcardType,
} from "./webcard-data-base";
import { WebcardItem } from "./webcard-item";
export interface SavePasswordWebcardData extends WebcardDataBase {
  readonly webcardType: WebcardType.SavePassword;
  readonly capturedUsernames: {
    email: string;
    login: string;
    secondaryLogin: string;
  };
  readonly emailOrLogin: string;
  readonly existingCredentialsForDomain: WebcardItem[];
  readonly dropdownLoginOptions: string[];
  readonly domain: string;
  readonly subdomain: string;
  readonly fullDomain: string;
  readonly url: string;
  readonly loggedIn: boolean;
  readonly allowMasterPasswordProtection: boolean;
  readonly showSubdomainOpt: boolean;
  readonly passwordLimitStatus: {
    shouldShowPasswordLimitReached: boolean;
    shouldShowNearPasswordLimit: boolean;
    passwordsLeft?: number;
  };
  readonly showAccountFrozenStatus: {
    isB2BDiscontinued: boolean;
    isB2CFrozen: boolean;
    isAccountFrozen: boolean;
  };
  readonly space: string;
  readonly showSpacesList: boolean;
  readonly spaces: WebcardSpacesData[];
  readonly passwordToSave: string;
  readonly collections?: WebcardCollectionData[];
  readonly showCollectionList: boolean;
}
export const isSavePasswordWebcard = (
  obj: WebcardDataBase
): obj is SavePasswordWebcardData => {
  return obj.webcardType === WebcardType.SavePassword;
};
