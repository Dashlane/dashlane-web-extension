import { ReactNode } from "react";
export enum UnlockerAction {
  Show = "show",
  Copy = "copy",
  CopyVerified = "copyVerified",
  Export = "export",
}
export enum LockedItemType {
  UpdateContactEmail = "update-contact-email",
  Password = "password",
  SharedItems = "shared-items",
  GeneratedPassword = "generated-password",
  CreditCard = "credit-card",
  Secret = "secret",
  SecureNote = "secure-note",
  SecureNoteSetting = "secure-note-setting",
  Id = "id",
  ExportData = "export-data",
  BankAccount = "bank-account",
  SecuritySettings = "security-settings",
}
export enum UnlockRequestCustomizableField {
  Title = "title",
  Subtitle = "subtitle",
  Confirm = "confirm",
  Placeholder = "placeholder",
}
export type UnlockRequestOptionsTranslated = {
  fields: Partial<Record<UnlockRequestCustomizableField, ReactNode | string>>;
  translated: true;
};
export type UnlockRequestOptionsNotTranslated = {
  fieldsKeys: Partial<Record<UnlockRequestCustomizableField, string>>;
  translated: false;
};
export type UnlockRequestTranslationOptions =
  | UnlockRequestOptionsNotTranslated
  | UnlockRequestOptionsTranslated;
export interface UnlockRequestTranslatedField {
  translated: true;
  field: ReactNode | string;
}
export interface UnlockRequestTranslationKey {
  translated: false;
  key: string;
}
interface BaseUnlockRequest {
  action?: UnlockerAction;
  options?: UnlockRequestTranslationOptions;
  successCallback?: () => void;
  cancelCallback?: () => void;
}
export interface CredentialUnlockRequest {
  itemType: LockedItemType.Password;
  credentialId: string;
  showNeverAskOption: true;
}
export interface OtherUnlockRequest {
  itemType:
    | LockedItemType.BankAccount
    | LockedItemType.CreditCard
    | LockedItemType.Secret
    | LockedItemType.SecureNote
    | LockedItemType.SecureNoteSetting
    | LockedItemType.ExportData
    | LockedItemType.SecuritySettings
    | LockedItemType.UpdateContactEmail
    | LockedItemType.GeneratedPassword
    | LockedItemType.SharedItems;
}
export type UnlockRequest = BaseUnlockRequest &
  (CredentialUnlockRequest | OtherUnlockRequest);
export interface ProtectedItemsUnlockRequest {
  unlockRequest: UnlockRequest;
  setUnlockRequest?: (unlockRequest: UnlockRequest | null) => void;
}
export interface ProtectedItemsUnlockerProps {
  openProtectedItemsUnlocker: (request: UnlockRequest) => void;
  areProtectedItemsUnlocked: boolean;
  protectedItemsUnlockerShown: boolean;
}
