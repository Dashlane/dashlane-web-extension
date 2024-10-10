import {
  CommandQueryBusConfig,
  NoCommands,
  NoQueries,
} from "Shared/Infrastructure";
import { AntiPhishingLiveQueries } from "./live-queries";
import { antiPhishingURLList$ } from "AntiPhishing/live";
export const AntiPhishingConfig: CommandQueryBusConfig<
  NoCommands,
  NoQueries,
  AntiPhishingLiveQueries
> = {
  commands: {},
  queries: {},
  liveQueries: {
    livePhishingURLList: {
      operator: antiPhishingURLList$,
    },
  },
};
