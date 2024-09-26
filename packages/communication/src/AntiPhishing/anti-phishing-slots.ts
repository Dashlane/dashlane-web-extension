import { liveSlot } from "../CarbonApi";
export const antiPhishingLiveQueriesSlots = {
  livePhishingURLList: liveSlot<Set<string>>(),
};
