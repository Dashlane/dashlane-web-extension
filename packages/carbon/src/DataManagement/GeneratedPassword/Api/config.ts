import { CommandQueryBusConfig } from "Shared/Infrastructure";
import { GeneratedPasswordQueries } from "DataManagement/GeneratedPassword/Api/queries";
import {
  countAllGeneratedPasswordsSelector,
  generatedPasswordsPageSelector,
  generatedPasswordsPaginationTokenSelector,
  viewedGeneratedPasswordSelector,
  viewedQueriedGeneratedPasswordsSelector,
} from "DataManagement/GeneratedPassword/selectors";
import { GeneratedPasswordCommands } from "DataManagement/GeneratedPassword/Api/commands";
import { GeneratedPasswordsLiveQueries } from "DataManagement/GeneratedPassword/Api/live-queries";
import { saveGeneratedPasswordHandler } from "DataManagement/GeneratedPassword/handlers";
import {
  generatedPasswordCount$,
  generatedPasswords$,
} from "DataManagement/GeneratedPassword/live";
export const config: CommandQueryBusConfig<
  GeneratedPasswordCommands,
  GeneratedPasswordQueries,
  GeneratedPasswordsLiveQueries
> = {
  commands: {
    saveGeneratedPassword: { handler: saveGeneratedPasswordHandler },
  },
  queries: {
    getGeneratedPassword: {
      selector: viewedGeneratedPasswordSelector,
    },
    getGeneratedPasswordsCount: {
      selector: countAllGeneratedPasswordsSelector,
    },
    getGeneratedPasswords: {
      selector: viewedQueriedGeneratedPasswordsSelector,
    },
    getGeneratedPasswordsPage: { selector: generatedPasswordsPageSelector },
    getGeneratedPasswordsPaginationToken: {
      selector: generatedPasswordsPaginationTokenSelector,
    },
  },
  liveQueries: {
    liveGeneratedPasswordsCount: {
      operator: generatedPasswordCount$,
    },
    liveGeneratedPasswords: {
      operator: generatedPasswords$,
    },
  },
};
