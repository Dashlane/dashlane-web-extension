import { Query } from "Shared/Api";
export type RecoveryQueries = {
  getRecoveryOptInSetting: Query<void, boolean>;
  getAccountRecoveryRequestCount: Query<void, number>;
};
