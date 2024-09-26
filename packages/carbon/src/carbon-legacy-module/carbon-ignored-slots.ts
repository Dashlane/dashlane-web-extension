import {
  CarbonLeelooConnector,
  LEGACY_CARBON_LEELOO_USED_COMMANDS,
} from "@dashlane/communication";
import { safeCast } from "@dashlane/framework-types";
import { LEGACY_LEELOO_EVENTS_TO_SUBSCRIBE } from "./carbon-legacy-event-relay";
import { LEGACY_LEELOO_SLOTS_ALL } from "./carbon-legacy-infrastructure";
export const LEGACY_LEELOO_SLOTS_TO_IGNORE = safeCast<
  (keyof typeof CarbonLeelooConnector)[]
>(
  LEGACY_LEELOO_SLOTS_ALL.filter(
    (slot) =>
      !LEGACY_LEELOO_EVENTS_TO_SUBSCRIBE.includes(slot) &&
      !safeCast<typeof LEGACY_LEELOO_SLOTS_ALL>(
        LEGACY_CARBON_LEELOO_USED_COMMANDS
      ).includes(slot)
  )
);
