import {
  BreachDetailItemView,
  BreachesUpdaterStatus,
  BreachItemView,
  ListResults,
} from "@dashlane/communication";
import { LiveQuery } from "Shared/Api";
export type BreachLiveQueries = {
  liveBreach: LiveQuery<string, BreachDetailItemView | undefined>;
  liveBreaches: LiveQuery<string, ListResults<BreachItemView>>;
  liveBreachesBatch: LiveQuery<string, BreachItemView[]>;
  liveBreachesUpdaterStatus: LiveQuery<void, BreachesUpdaterStatus>;
};
