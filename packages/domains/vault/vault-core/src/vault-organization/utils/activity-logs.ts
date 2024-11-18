import {
  ActivityLog,
  ActivityLogType,
  PropertiesForCollectionLogs,
  PropertiesWithDomain,
} from "@dashlane/risk-monitoring-contracts";
export const createActivityLog = <
  TType extends
    | ActivityLogType.UserAddedCredentialToCollection
    | ActivityLogType.UserRemovedCredentialFromCollection
    | ActivityLogType.UserDeletedCollection
    | ActivityLogType.UserRenamedCollection
    | ActivityLogType.UserCreatedCollection
    | ActivityLogType.UserDeletedCredential,
  TProperties extends PropertiesForCollectionLogs | PropertiesWithDomain
>(
  type: TType,
  properties: TProperties
) => {
  return {
    date_time: new Date().getTime(),
    log_type: type,
    properties,
    schema_version: "1.0.0",
    uuid: crypto.randomUUID().toUpperCase(),
  } satisfies ActivityLog<TType, TProperties>;
};
