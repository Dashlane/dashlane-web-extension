import { CommandQueryBusConfig } from "Shared/Infrastructure";
import { BreachCommands } from "DataManagement/Breaches/Api/commands";
import { BreachQueries } from "DataManagement/Breaches/Api/queries";
import { BreachLiveQueries } from "DataManagement/Breaches/Api/live-queries";
import {
  breachesPageSelector,
  breachesPaginationTokenSelector,
  breachesUpdaterStatusSelector,
  viewedBreachSelector,
  viewedQueriedBreachesSelector,
} from "DataManagement/Breaches/selectors";
import {
  breaches$,
  breachesBatch$,
  breachesUpdaterStatus$,
  getBreach$,
} from "DataManagement/Breaches/live";
import { updateBreachStatusHandler } from "DataManagement/Breaches/CommandHandlers/updateBreachStatus";
export const config: CommandQueryBusConfig<
  BreachCommands,
  BreachQueries,
  BreachLiveQueries
> = {
  commands: {
    updateBreachStatus: { handler: updateBreachStatusHandler },
  },
  queries: {
    getBreach: { selector: viewedBreachSelector },
    getBreaches: { selector: viewedQueriedBreachesSelector },
    getBreachesPage: { selector: breachesPageSelector },
    getBreachesPaginationToken: {
      selector: breachesPaginationTokenSelector,
    },
    getBreachesUpdateStatus: { selector: breachesUpdaterStatusSelector },
  },
  liveQueries: {
    liveBreach: { operator: getBreach$ },
    liveBreaches: { operator: breaches$ },
    liveBreachesBatch: { operator: breachesBatch$ },
    liveBreachesUpdaterStatus: { operator: breachesUpdaterStatus$ },
  },
};
