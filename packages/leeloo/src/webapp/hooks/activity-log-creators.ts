import {
  ActivityLogCategory,
  ActivityLogType,
  PropertiesForBankAccountLogs,
  PropertiesForCredentialLogs,
  PropertiesForCreditCardLogs,
  UserCopiedBankAccountField,
  UserCopiedCredentialField,
  UserCopiedCreditCardField,
  UserCopiedSecret,
  UserCopiedSecureNote,
  UserRevealedBankAccountField,
  UserRevealedCredentialField,
  UserRevealedCreditCardField,
  UserRevealedSecret,
  UserRevealedSecureNote,
} from "@dashlane/risk-monitoring-contracts";
import { v4 as uuidv4 } from "uuid";
export const createBaseActivityLog = () => {
  return {
    category: ActivityLogCategory.ItemUsage,
    date_time: new Date().getTime(),
    schema_version: "1.0.0",
    is_sensitive: true,
    uuid: uuidv4().toUpperCase(),
  } as const;
};
export const createRevealedCredentialFieldLog = (
  properties: PropertiesForCredentialLogs
): UserRevealedCredentialField => ({
  ...createBaseActivityLog(),
  log_type: ActivityLogType.UserRevealedCredentialField,
  properties,
});
export const createRevealedCreditCardFieldLog = (
  properties: PropertiesForCreditCardLogs
): UserRevealedCreditCardField => ({
  ...createBaseActivityLog(),
  log_type: ActivityLogType.UserRevealedCreditCardField,
  properties,
});
export const createRevealedBankAccountFieldLog = (
  properties: PropertiesForBankAccountLogs
): UserRevealedBankAccountField => ({
  ...createBaseActivityLog(),
  log_type: ActivityLogType.UserRevealedBankAccountField,
  properties,
});
export const createRevealedSecretContentLog = (
  name: string
): UserRevealedSecret => ({
  ...createBaseActivityLog(),
  log_type: ActivityLogType.UserRevealedSecret,
  properties: { name },
});
export const createRevealedSecureNoteContentLog = (
  name: string
): UserRevealedSecureNote => ({
  ...createBaseActivityLog(),
  log_type: ActivityLogType.UserRevealedSecureNote,
  properties: { name },
});
export const createCopiedCredentialFieldLog = (
  properties: PropertiesForCredentialLogs
): UserCopiedCredentialField => ({
  ...createBaseActivityLog(),
  log_type: ActivityLogType.UserCopiedCredentialField,
  properties,
});
export const createCopiedCreditCardFieldLog = (
  properties: PropertiesForCreditCardLogs
): UserCopiedCreditCardField => ({
  ...createBaseActivityLog(),
  log_type: ActivityLogType.UserCopiedCreditCardField,
  properties,
});
export const createCopiedBankAccountFieldLog = (
  properties: PropertiesForBankAccountLogs
): UserCopiedBankAccountField => ({
  ...createBaseActivityLog(),
  log_type: ActivityLogType.UserCopiedBankAccountField,
  properties,
});
export const createCopiedSecretContentLog = (
  name: string
): UserCopiedSecret => ({
  ...createBaseActivityLog(),
  log_type: ActivityLogType.UserCopiedSecret,
  properties: { name },
});
export const createCopiedSecureNoteContentLog = (
  name: string
): UserCopiedSecureNote => ({
  ...createBaseActivityLog(),
  log_type: ActivityLogType.UserCopiedSecureNote,
  properties: { name },
});
