import { CommandQueryBusConfig } from "Shared/Infrastructure";
import { ChangeMasterPasswordCommands } from "ChangeMasterPassword/Api/commands";
import { ChangeMasterPasswordQueries } from "ChangeMasterPassword/Api/queries";
import { ChangeMasterPasswordLiveQueries } from "ChangeMasterPassword/Api/live-queries";
import { changeMasterPassword } from "ChangeMasterPassword/change-master-password";
import { getChangeMasterPasswordStatus$ } from "ChangeMasterPassword/Api/live";
export const config: CommandQueryBusConfig<
  ChangeMasterPasswordCommands,
  ChangeMasterPasswordQueries,
  ChangeMasterPasswordLiveQueries
> = {
  commands: {
    changeMasterPassword: { handler: changeMasterPassword },
  },
  queries: {},
  liveQueries: {
    liveChangeMasterPasswordStatus: {
      subject: getChangeMasterPasswordStatus$,
    },
  },
};
