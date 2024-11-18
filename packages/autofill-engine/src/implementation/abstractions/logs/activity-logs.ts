import { v4 as uuidv4 } from "uuid";
import {
  ActivityLogCategory,
  ActivityLogType,
  UserAuthenticatedWithPasskey,
  UserCopiedBankAccountField,
  UserCopiedCredentialField,
  UserCopiedCreditCardField,
  UserPerformedAutofillCredential,
  UserPerformedAutofillPayment,
} from "@dashlane/risk-monitoring-contracts";
import { AutofillEngineContext } from "../../../Api/server/context";
import { AutofillEngineActionsWithOptions } from "../messaging/action-serializer";
import { VaultSourceType } from "@dashlane/autofill-contracts";
import { checkHasFUNAuditLogs } from "../../../config/feature-flips";
export type AutofillActivityLog =
  | UserPerformedAutofillCredential
  | UserPerformedAutofillPayment
  | UserAuthenticatedWithPasskey;
export type UserCopiedActivityLog =
  | UserCopiedCredentialField
  | UserCopiedCreditCardField
  | UserCopiedBankAccountField;
export type ItemUsageActivityLog = AutofillActivityLog | UserCopiedActivityLog;
const makeActivityLog = <T extends ItemUsageActivityLog>(
  activityLogType: T["log_type"],
  category: ActivityLogCategory,
  properties: T["properties"],
  isSensitive: boolean
): T => {
  return {
    log_type: activityLogType,
    category,
    date_time: new Date().getTime(),
    schema_version: "1.0.0",
    is_sensitive: isSensitive,
    uuid: uuidv4().toUpperCase(),
    properties,
  } as T;
};
export const makeItemUsageActivityLog = <T extends ItemUsageActivityLog>(
  activityLogType: T["log_type"],
  properties: T["properties"],
  isSensitive = true
): T =>
  makeActivityLog(
    activityLogType,
    ActivityLogCategory.ItemUsage,
    properties,
    isSensitive
  );
export interface SendPropertyCopiedActivityLogParams {
  itemType:
    | VaultSourceType.Credential
    | VaultSourceType.PaymentCard
    | VaultSourceType.BankAccount;
  field: UserCopiedActivityLog["properties"]["field"];
  title: string;
  login?: string;
}
const mapItemTypeToCopiedActivityLog: Record<
  | VaultSourceType.Credential
  | VaultSourceType.PaymentCard
  | VaultSourceType.BankAccount,
  UserCopiedActivityLog["log_type"]
> = {
  [VaultSourceType.Credential]: ActivityLogType.UserCopiedCredentialField,
  [VaultSourceType.BankAccount]: ActivityLogType.UserCopiedBankAccountField,
  [VaultSourceType.PaymentCard]: ActivityLogType.UserCopiedCreditCardField,
};
export const sendPropertyCopiedActivityLogHandler = async (
  context: AutofillEngineContext,
  actions: AutofillEngineActionsWithOptions,
  sender: chrome.runtime.MessageSender,
  params: SendPropertyCopiedActivityLogParams
): Promise<void> => {
  const hasFunAuditLogsFF = await checkHasFUNAuditLogs(context.connectors);
  const premiumStatus = await context.connectors.carbon.getNodePremiumStatus();
  if (hasFunAuditLogsFF && premiumStatus.b2bStatus?.currentTeam) {
    const logType = mapItemTypeToCopiedActivityLog[params.itemType];
    let log: UserCopiedActivityLog | undefined = undefined;
    switch (logType) {
      case ActivityLogType.UserCopiedCredentialField:
        log = makeItemUsageActivityLog<UserCopiedCredentialField>(logType, {
          field:
            params.field as UserCopiedCredentialField["properties"]["field"],
          credential_domain: params.title,
          credential_login: params.login ?? "",
        });
        break;
      case ActivityLogType.UserCopiedBankAccountField:
        log = makeItemUsageActivityLog<UserCopiedBankAccountField>(logType, {
          field:
            params.field as UserCopiedBankAccountField["properties"]["field"],
          name: params.title,
        });
        break;
      case ActivityLogType.UserCopiedCreditCardField:
        log = makeItemUsageActivityLog<UserCopiedCreditCardField>(logType, {
          field:
            params.field as UserCopiedCreditCardField["properties"]["field"],
          name: params.title,
        });
        break;
      default:
        throw new Error(
          "sendPropertyCopiedActivityLogHandler: unknown log type"
        );
    }
    await context.connectors.grapheneClient.activityLogs.commands.storeActivityLogs(
      {
        activityLogs: [log],
      }
    );
  }
};
