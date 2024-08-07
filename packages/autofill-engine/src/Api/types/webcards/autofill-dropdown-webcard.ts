import { OtherSourceType, VaultSourceType } from "@dashlane/autofill-contracts";
import { AutofillRecipeBySourceType, FieldFormat } from "../autofill";
import { WebauthnRequest } from "../webauthn";
import { WebcardDataBase, WebcardType } from "./webcard-data-base";
import { WebcardItem } from "./webcard-item";
export interface ElementPositionAndDimensions {
  x: number;
  y: number;
  width: number;
  height: number;
}
export enum AutofillDropdownWebcardConfiguration {
  Classic = "classic",
  FixAutofillIssue = "fixAutofillIssue",
  GeneratePassword = "pwdGenerator",
  Reactivation = "reactivation",
  WebAuthnReactivation = "webAuthnReactivation",
  FieldDisabledNotification = "fieldDisabledNotification",
  SelfCorrecting = "selfCorrecting",
  AccountFrozen = "accountFrozen",
}
export interface SrcElementDetails {
  readonly elementId: string;
  readonly frameId: string;
  readonly frameSandboxed: boolean;
  readonly isInputPassword?: boolean;
  readonly formId: string;
  readonly positionInFrame: ElementPositionAndDimensions;
  readonly persistentIdentifier: string;
  readonly fieldFormat: FieldFormat;
}
export interface AutofillDropdownWebcardDataBase extends WebcardDataBase {
  readonly webcardType: WebcardType.AutofillDropdown;
  readonly configuration: AutofillDropdownWebcardConfiguration;
  readonly warningType?: AutofillDropdownWebcardWarningType;
  readonly context?: string;
  readonly srcElement: SrcElementDetails;
  readonly fieldType?: VaultSourceType[];
  readonly autofillRecipes: AutofillRecipeBySourceType;
}
export const isAutofillDropdownWebcard = (
  obj: WebcardDataBase
): obj is AutofillDropdownWebcardDataBase => {
  return obj.webcardType === WebcardType.AutofillDropdown;
};
export interface ClassicDropdownWebcardData
  extends AutofillDropdownWebcardDataBase {
  readonly configuration: AutofillDropdownWebcardConfiguration.Classic;
  readonly items: WebcardItem[];
  readonly withSearch: boolean;
  readonly withNonDashlaneKeyButton?: boolean;
  readonly webauthnRequest?: WebauthnRequest;
}
export interface SelfCorrectingDropdownWebcardData
  extends AutofillDropdownWebcardDataBase {
  readonly configuration: AutofillDropdownWebcardConfiguration.SelfCorrecting;
  readonly elementHasImpala: boolean;
}
export const isClassicDropdownWebcard = (
  obj: WebcardDataBase
): obj is ClassicDropdownWebcardData => {
  return (
    isAutofillDropdownWebcard(obj) &&
    obj.configuration === AutofillDropdownWebcardConfiguration.Classic
  );
};
export const isSelfCorrectingDropdownWebcard = (
  obj: WebcardDataBase
): obj is SelfCorrectingDropdownWebcardData => {
  return (
    isAutofillDropdownWebcard(obj) &&
    obj.configuration === AutofillDropdownWebcardConfiguration.SelfCorrecting
  );
};
export const isB2CFrozenDropdownWebcard = (
  obj: WebcardDataBase
): obj is AccountFrozenDropdownWebcardData => {
  return (
    isAutofillDropdownWebcard(obj) &&
    obj.configuration === AutofillDropdownWebcardConfiguration.AccountFrozen
  );
};
export interface GeneratePasswordWebcardData
  extends AutofillDropdownWebcardDataBase {
  readonly configuration: AutofillDropdownWebcardConfiguration.GeneratePassword;
  readonly passwordLimitStatus: {
    shouldShowPasswordLimitReached: boolean;
    shouldShowNearPasswordLimit: boolean;
    passwordsLeft?: number;
  };
  readonly passwordGenerationSettings: AutofillDropdownWebcardPasswordGenerationSettings;
  readonly showAccountFrozenStatus: {
    isB2BDiscontinued: boolean;
    isB2CFrozen: boolean;
    isAccountFrozen: boolean;
  };
}
export const isGeneratePasswordWebcard = (
  obj: WebcardDataBase
): obj is GeneratePasswordWebcardData => {
  return (
    isAutofillDropdownWebcard(obj) &&
    obj.configuration === AutofillDropdownWebcardConfiguration.GeneratePassword
  );
};
export interface ReactivationWebcardData
  extends AutofillDropdownWebcardDataBase {
  readonly configuration: AutofillDropdownWebcardConfiguration.Reactivation;
  readonly extensionShortcuts?: string[];
}
export const isReactivationWebcard = (
  obj: WebcardDataBase
): obj is ReactivationWebcardData => {
  return (
    isAutofillDropdownWebcard(obj) &&
    obj.configuration === AutofillDropdownWebcardConfiguration.Reactivation
  );
};
export interface WebAuthnReactivationWebcardData
  extends AutofillDropdownWebcardDataBase {
  readonly configuration: AutofillDropdownWebcardConfiguration.WebAuthnReactivation;
  readonly extensionShortcuts?: string[];
}
export interface AccountFrozenDropdownWebcardData
  extends AutofillDropdownWebcardDataBase {
  readonly configuration: AutofillDropdownWebcardConfiguration.AccountFrozen;
  readonly cardTitleSourceType?: VaultSourceType | OtherSourceType;
  readonly passwordLimit: number;
}
export const isAccountFrozenWebcard = (
  obj: WebcardDataBase
): obj is AccountFrozenDropdownWebcardData => {
  return (
    isAutofillDropdownWebcard(obj) &&
    obj.configuration === AutofillDropdownWebcardConfiguration.AccountFrozen
  );
};
export const isWebAuthnReactivationWebcard = (
  obj: WebcardDataBase
): obj is WebAuthnReactivationWebcardData => {
  return (
    isAutofillDropdownWebcard(obj) &&
    obj.configuration ===
      AutofillDropdownWebcardConfiguration.WebAuthnReactivation
  );
};
export interface FieldDisabledNotificationWebcardData
  extends AutofillDropdownWebcardDataBase {
  readonly configuration: AutofillDropdownWebcardConfiguration.FieldDisabledNotification;
}
export const isFieldDisabledNotificationWebcard = (
  obj: WebcardDataBase
): obj is FieldDisabledNotificationWebcardData => {
  return (
    isAutofillDropdownWebcard(obj) &&
    obj.configuration ===
      AutofillDropdownWebcardConfiguration.FieldDisabledNotification
  );
};
export interface AutofillDropdownWebcardPasswordGenerationSettings {
  readonly length: number;
  readonly digits: boolean;
  readonly letters: boolean;
  readonly symbols: boolean;
  readonly avoidAmbiguous: boolean;
}
export enum AutofillDropdownWebcardWarningType {
  PasswordGenerationDashlaneLogin = "generation",
  PossibleDuplicateRegistration = "registration",
  UnsecureProtocol = "unsecure",
  UnsecureIframe = "unsecureIframe",
  SandboxedIframe = "sandboxedIframe",
  B2BDiscontinued = "b2BDiscontinued",
  NearPasswordLimit = "nearPasswordLimit",
  PasswordLimitReached = "passwordLimitReached",
  None = "",
}
export interface WarningData {
  readonly warningType: AutofillDropdownWebcardWarningType;
  readonly warningContext: string;
}
export type AutofillDropdownWebcardData =
  | AccountFrozenDropdownWebcardData
  | ClassicDropdownWebcardData
  | FieldDisabledNotificationWebcardData
  | ReactivationWebcardData
  | WebAuthnReactivationWebcardData
  | GeneratePasswordWebcardData
  | SelfCorrectingDropdownWebcardData;
