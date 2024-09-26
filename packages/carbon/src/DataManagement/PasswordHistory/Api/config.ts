import { CommandQueryBusConfig } from "Shared/Infrastructure";
import { PasswordHistoryQueries } from "DataManagement/PasswordHistory/Api/queries";
import {
  makeHasPasswordHistorySelector,
  passwordHistoryPageSelector,
  passwordHistoryPaginationTokenSelector,
} from "DataManagement/PasswordHistory/selectors";
import { GeneratedPasswordCommands } from "DataManagement/GeneratedPassword/Api/commands";
import { saveGeneratedPasswordHandler } from "DataManagement/GeneratedPassword/handlers";
import { passwordHistoryBatch$ } from "DataManagement/PasswordHistory/live";
import { PasswordHistoryLiveQueries } from "./live-queries";
import { CoreServices } from "Services";
export const config: CommandQueryBusConfig<
  GeneratedPasswordCommands,
  PasswordHistoryQueries,
  PasswordHistoryLiveQueries
> = {
  commands: {
    saveGeneratedPassword: { handler: saveGeneratedPasswordHandler },
  },
  queries: {
    getPasswordHistoryPage: { selector: passwordHistoryPageSelector },
    getPasswordHistoryPaginationToken: {
      selector: passwordHistoryPaginationTokenSelector,
    },
    getHasPasswordHistory: {
      selectorFactory: (services: CoreServices) => {
        const sharingItemsClient =
          services.applicationModulesAccess.createClients().sharingItems;
        return Promise.resolve(
          makeHasPasswordHistorySelector(sharingItemsClient)
        );
      },
    },
  },
  liveQueries: {
    livePasswordHistoryBatch: { operator: passwordHistoryBatch$ },
  },
};
