import { CommandQueryBusConfig } from "Shared/Infrastructure";
import { PasskeyCommands } from "DataManagement/Passkeys/Api/commands";
import { PasskeyQueries } from "DataManagement/Passkeys/Api/queries";
import { PasskeyLiveQueries } from "DataManagement/Passkeys/Api/live-queries";
import {
  viewedPasskeySelector,
  viewedQueriedPasskeysForDomainSelector,
  viewedQueriedPasskeysSelector,
} from "DataManagement/Passkeys/selectors";
import { getPasskey$, passkeys$ } from "DataManagement/Passkeys/live";
import {
  addPasskeyHandler,
  deletePasskeyHandler,
  updatePasskeyHandler,
} from "DataManagement/Passkeys/handlers";
export const config: CommandQueryBusConfig<
  PasskeyCommands,
  PasskeyQueries,
  PasskeyLiveQueries
> = {
  commands: {
    addPasskey: { handler: addPasskeyHandler },
    updatePasskey: { handler: updatePasskeyHandler },
    deletePasskey: { handler: deletePasskeyHandler },
  },
  queries: {
    getPasskey: { selector: viewedPasskeySelector },
    getPasskeys: { selector: viewedQueriedPasskeysSelector },
    getPasskeysForDomain: {
      selector: viewedQueriedPasskeysForDomainSelector,
    },
  },
  liveQueries: {
    livePasskey: { operator: getPasskey$ },
    livePasskeys: { operator: passkeys$ },
  },
};
