import { v4 as uuidv4 } from "uuid";
import {
  ActivityLogCategory,
  ActivityLogType,
  PropertiesForCollectionLogs,
  UserAddedCredentialToCollection,
  UserCreatedCollection,
  UserDeletedCollection,
  UserRemovedCredentialFromCollection,
  UserRenamedCollection,
} from "@dashlane/risk-monitoring-contracts";
export const createActivityLog = (
  type:
    | ActivityLogType.UserAddedCredentialToCollection
    | ActivityLogType.UserRemovedCredentialFromCollection
    | ActivityLogType.UserDeletedCollection
    | ActivityLogType.UserRenamedCollection
    | ActivityLogType.UserCreatedCollection,
  payload: PropertiesForCollectionLogs
) => {
  const activityLog:
    | UserAddedCredentialToCollection
    | UserCreatedCollection
    | UserDeletedCollection
    | UserRemovedCredentialFromCollection
    | UserRenamedCollection = {
    log_type: type,
    category: ActivityLogCategory.VaultCollections,
    date_time: new Date().getTime(),
    schema_version: "1.0.0",
    is_sensitive: true,
    uuid: uuidv4().toUpperCase(),
    properties: payload,
  };
  return activityLog;
};
