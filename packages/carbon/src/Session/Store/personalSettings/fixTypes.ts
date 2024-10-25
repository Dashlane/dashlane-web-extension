import { curry } from "ramda";
import { fixProperties, MapperProperty } from "Session/Store/fixTypes";
const booleanProperties: MapperProperty = {
  GeneratorDefaultAvoidAmbiguousChars: "boolean",
  GeneratorDefaultDigits: "boolean",
  GeneratorDefaultLetters: "boolean",
  GeneratorDefaultMixedCase: "boolean",
  GeneratorDefaultPronounceable: "boolean",
  GeneratorDefaultSymbols: "boolean",
  RecoveryOptIn: "boolean",
  ProtectPasswords: "boolean",
  ProtectPayments: "boolean",
  ProtectIDs: "boolean",
  RichIcons: "boolean",
  SecuredDataShowScreenshots: "yes-no",
  SecuredDataShowPassword: "yes-no",
  SecuredDataShowIDs: "yes-no",
  SecuredDataShowCreditcard: "yes-no",
  SecuredDataAutofillCreditcard: "yes-no",
  SyncBackup: "yes-no",
  SyncBackupPurchase: "yes-no",
  SyncBackupPersonaldata: "yes-no",
  SyncBackupPasswords: "yes-no",
  SyncBackupCreditCardsNumber: "yes-no",
  SyncBackupCreditCardsCCV: "yes-no",
};
const numberProperties: MapperProperty = {
  GeneratorDefaultSize: "number",
  accountCreationDatetime: "number",
};
const jsonProperties: MapperProperty = {
  SpaceAnonIds: "json",
  AutofillSettings: "json",
};
const fixPersonalSettingTypesFromTransaction = curry(
  fixProperties.fromTransaction
)(booleanProperties, numberProperties, jsonProperties);
const fixPersonalSettingTypesFromStore = curry(fixProperties.fromStore)(
  booleanProperties,
  numberProperties,
  jsonProperties
);
export const fixPersonalSettingTypes = {
  fromTransaction: fixPersonalSettingTypesFromTransaction,
  fromStore: fixPersonalSettingTypesFromStore,
};
