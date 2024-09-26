import { slot } from "ts-event-bus";
import { liveSlot, Page } from "../../CarbonApi";
import {
  PasswordHistoryFirstTokenParams,
  PasswordHistoryItemView,
} from "./types";
export const passwordHistoryQueriesSlots = {
  getHasPasswordHistory: slot<string, boolean>(),
  getPasswordHistoryPage: slot<string, Page<PasswordHistoryItemView>>(),
  getPasswordHistoryPaginationToken: slot<
    PasswordHistoryFirstTokenParams,
    string
  >(),
};
export const passwordHistoryLiveQueriesSlots = {
  livePasswordHistoryBatch: liveSlot<PasswordHistoryItemView[]>(),
};
