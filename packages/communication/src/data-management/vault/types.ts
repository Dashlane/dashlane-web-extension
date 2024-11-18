import type { DataModelType } from "../../DataModel/Interfaces/Common";
export enum VaultItemDisableProtectionMode {
  CannotDisable,
  DisableSpecificVaultItem,
  DisableGeneralSetting,
}
export const deleteVaultModuleItemFailureReason = Object.freeze({
  NOT_FOUND: "NOT_FOUND",
});
export type DeleteVaultModuleItemFailureReason =
  (typeof deleteVaultModuleItemFailureReason)[keyof typeof deleteVaultModuleItemFailureReason];
export interface DeleteVaultModuleItemParam {
  id: string;
  kwType?: DataModelType;
}
export interface DeleteVaultModuleItemsBulkParam {
  kwType: DataModelType;
  items: Array<DeleteVaultModuleItemParam>;
}
export type DeleteVaultModuleItemResponse =
  | {
      success: true;
    }
  | {
      success: false;
      error: {
        reason: DeleteVaultModuleItemFailureReason;
      };
    };
export type DeleteVaultModuleItemsBulkResponse =
  | {
      success: true;
    }
  | {
      success: false;
      error: {
        errors: Array<{
          id: string;
          reason: DeleteVaultModuleItemFailureReason;
        }>;
      };
    };
export const DATAMODELOBJECT_TYPE_TO_CARBON_STORE_KEY = {
  KWAddress: "addresses",
  KWAuthentifiant: "credentials",
  KWBankStatement: "bankAccounts",
  KWCollection: "collections",
  KWCompany: "companies",
  KWDataChangeHistory: "changeHistories",
  KWDriverLicence: "driverLicenses",
  KWEmail: "emails",
  KWFiscalStatement: "fiscalIds",
  KWGeneratedPassword: "generatedPasswords",
  KWIDCard: "idCards",
  KWIdentity: "identities",
  KWPasskey: "passkeys",
  KWPassport: "passports",
  KWPaymentMean_creditCard: "paymentCards",
  KWPaymentMean_paypal: "paypalAccounts",
  KWPersonalWebsite: "personalWebsites",
  KWPhone: "phones",
  KWSecureNote: "notes",
  KWSecurityBreach: "securityBreaches",
  KWSocialSecurityStatement: "socialSecurityIds",
  KWSecureFileInfo: "secureFileInfo",
  KWSecret: "secrets",
} as const;
