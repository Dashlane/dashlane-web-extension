import { Query } from "Shared/Api";
export type ExportQueries = {
  getIsForcedDomainsEnabled: Query<void, boolean>;
};
