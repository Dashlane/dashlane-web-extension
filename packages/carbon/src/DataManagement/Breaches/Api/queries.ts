import {
  BreachDetailItemView,
  BreachesFirstTokenParams,
  BreachesQuery,
  BreachesUpdaterStatus,
  BreachItemView,
  ListResults,
  Page,
} from "@dashlane/communication";
import { Query } from "Shared/Api";
export type BreachQueries = {
  getBreach: Query<string, BreachDetailItemView | undefined>;
  getBreaches: Query<BreachesQuery, ListResults<BreachItemView>>;
  getBreachesPage: Query<string, Page<BreachItemView>>;
  getBreachesPaginationToken: Query<BreachesFirstTokenParams, string>;
  getBreachesUpdateStatus: Query<void, BreachesUpdaterStatus>;
};
