import { PersonalDataCollections } from "Session/Store/personalData/types";
export const DATAMODELOBJECT_TYPE_TO_STORE_KEY = {
  KWAddress: "addresses",
  KWAuthCategory: "credentialCategories",
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
  KWSecureNoteCategory: "noteCategories",
  KWSecurityBreach: "securityBreaches",
  KWSocialSecurityStatement: "socialSecurityIds",
  KWSecureFileInfo: "secureFileInfo",
  KWSecret: "secrets",
} as const;
export default DATAMODELOBJECT_TYPE_TO_STORE_KEY;
export const PERSONAL_DATA_COLLECTIONS_KEYS = Object.keys(
  DATAMODELOBJECT_TYPE_TO_STORE_KEY
).map(
  (key) => DATAMODELOBJECT_TYPE_TO_STORE_KEY[key]
) as (keyof PersonalDataCollections)[];
