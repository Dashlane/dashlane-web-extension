import { CommandQueryBusConfig } from "Shared/Infrastructure";
import { CryptoMigrationCommands } from "CryptoMigration/Api/commands";
import { CryptoMigrationQueries } from "CryptoMigration/Api/queries";
import { CryptoMigrationLiveQueries } from "CryptoMigration/Api/live-queries";
import {
  canUserSelectCryptoSelector,
  userDerivationMethodSelector,
  userDerivationMethodSelector$,
} from "CryptoMigration/selectors";
import { changeUserCrypto } from "CryptoMigration/services/changeUserCrypto";
export const config: CommandQueryBusConfig<
  CryptoMigrationCommands,
  CryptoMigrationQueries,
  CryptoMigrationLiveQueries
> = {
  commands: {
    changeUserCrypto: { handler: changeUserCrypto },
  },
  queries: {
    getCanUserChangeCrypto: {
      selector: canUserSelectCryptoSelector,
    },
    getUserDerivationMethod: { selector: userDerivationMethodSelector },
  },
  liveQueries: {
    liveUserDerivationMethod: { operator: userDerivationMethodSelector$ },
  },
};
