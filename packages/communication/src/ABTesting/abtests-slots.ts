import { slot } from "ts-event-bus";
import { liveSlot } from "../CarbonApi";
export const abTestsCommandsSlots = {
  participateToUserABTest: slot<string>(),
};
export const abTestsQueriesSlots = {
  getUserABTestVariant: slot<string, string | undefined>(),
};
export const abTestsLiveQueriesSlots = {
  liveUserABTestVariant: liveSlot<string | undefined>(),
};
