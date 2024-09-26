import { BaseDataModelObject } from "./Common";
export interface PersonalSettings extends BaseDataModelObject {
  BanishedUrlsList?: string[];
  DisabledDomainsList?: string[];
  DisabledUrlsList?: string[];
  DisabledDomainsAutologinList?: string[];
  DisabledUrlsAutologinList?: string[];
  AutofillSettings?: {
    isAutofillDisabled: boolean;
    isAutologinDisabled: boolean;
    disabledSourceTypes: string[];
    disabledDomains: string[];
    isFollowUpNotificationEnabled: boolean;
  };
  RealLogin: string;
  SecurityEmail: string;
  accountCreationDatetime: number;
  AnonymousUserId: string;
  UsagelogToken: string;
  Format: string;
  Language: string;
  SpaceAnonIds?: {
    [k: string]: string;
  };
  SecurityPhone?: string[];
  SyncBackup: boolean;
  SyncBackupCreditCardsCCV?: boolean;
  SyncBackupCreditCardsNumber?: boolean;
  SyncBackupPasswords?: boolean;
  SyncBackupPersonaldata?: boolean;
  SyncBackupPurchase?: boolean;
  SecuredDataAutofillCreditcard: boolean;
  SecuredDataShowCreditcard: boolean;
  SecuredDataShowIDs: boolean;
  SecuredDataShowPassword: boolean;
  SecuredDataShowScreenshots: boolean;
  ProtectPasswords: boolean;
  ProtectPayments: boolean;
  ProtectIDs: boolean;
  RichIcons: boolean;
  PasswordLeakAnonymousId?: string;
  PasswordLeakLastCheckedTimestamp?: number;
  CryptoUserPayload?: string;
  CryptoFixedSalt?: string;
  GeneratorDefaultAvoidAmbiguousChars?: boolean;
  GeneratorDefaultDigits?: boolean;
  GeneratorDefaultLetters?: boolean;
  GeneratorDefaultMixedCase?: boolean;
  GeneratorDefaultPronounceable?: boolean;
  GeneratorDefaultSize?: number;
  GeneratorDefaultSymbols?: boolean;
  RecoveryHash?: string;
  RecoveryKey?: string;
  RecoveryOptIn?: boolean;
  AccountRecoveryKey?: string;
  AccountRecoveryKeyId?: string;
}
export function isPersonalSettings(
  o: BaseDataModelObject
): o is PersonalSettings {
  return Boolean(o) && o.kwType === "KWSettingsManagerApp";
}
