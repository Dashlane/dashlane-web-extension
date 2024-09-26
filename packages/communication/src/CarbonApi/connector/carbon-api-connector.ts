import { combineEvents } from "ts-event-bus";
import { carbonCommandsSlots } from "./carbon-commands-slots";
import { carbonQueriesSlots } from "./carbon-queries-slots";
import { carbonLiveQueriesSlots } from "./carbon-live-queries-slots";
export const CarbonApiConnector = combineEvents(
  carbonCommandsSlots,
  carbonQueriesSlots,
  carbonLiveQueriesSlots
);
export type CarbonApiEvents = typeof CarbonApiConnector;
