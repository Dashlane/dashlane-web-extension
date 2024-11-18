import { Query } from "Shared/Api";
export type TeamQueries = {
  getIsRecoveryEnabled: Query<void, boolean>;
};
