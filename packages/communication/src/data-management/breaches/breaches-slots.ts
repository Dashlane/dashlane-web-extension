import { slot } from "ts-event-bus";
import { ListResults, liveSlot, Page } from "../../CarbonApi";
import {
  BreachDetailItemView,
  BreachesFirstTokenParams,
  BreachesQuery,
  BreachesUpdaterStatus,
  BreachItemView,
  UpdateBreachStatusRequest,
  UpdateBreachStatusResult,
} from "./types";
export const breachesQueriesSlots = {
  getBreach: slot<string, BreachDetailItemView | undefined>(),
  getBreaches: slot<BreachesQuery, ListResults<BreachItemView>>(),
  getBreachesPage: slot<string, Page<BreachItemView>>(),
  getBreachesPaginationToken: slot<BreachesFirstTokenParams, string>(),
  getBreachesUpdateStatus: slot<void, BreachesUpdaterStatus>(),
};
export const breachesLiveQueriesSlots = {
  liveBreach: liveSlot<BreachDetailItemView | undefined>(),
  liveBreaches: liveSlot<ListResults<BreachItemView>>(),
  liveBreachesBatch: liveSlot<BreachItemView[]>(),
  liveBreachesUpdaterStatus: liveSlot<BreachesUpdaterStatus>(),
};
export const breachesCommandsSlots = {
  updateBreachStatus: slot<
    UpdateBreachStatusRequest,
    UpdateBreachStatusResult
  >(),
};
