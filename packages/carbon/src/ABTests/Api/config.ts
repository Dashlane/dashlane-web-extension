import { ABTestsCommands } from "ABTests/Api/commands";
import { ABTestsQueries } from "ABTests/Api/queries";
import { userABTestVariant$ } from "ABTests/live";
import { participateToUserABTest } from "ABTests/participateToUserABTest";
import { userABTestVariantSelector } from "Session/Store/abTests/selector";
import { CommandQueryBusConfig } from "Shared/Infrastructure";
import { ABTestsLiveQueries } from "./live-queries";
export const config: CommandQueryBusConfig<
  ABTestsCommands,
  ABTestsQueries,
  ABTestsLiveQueries
> = {
  commands: {
    participateToUserABTest: { handler: participateToUserABTest },
  },
  queries: {
    getUserABTestVariant: { selector: userABTestVariantSelector },
  },
  liveQueries: {
    liveUserABTestVariant: { operator: userABTestVariant$ },
  },
};
