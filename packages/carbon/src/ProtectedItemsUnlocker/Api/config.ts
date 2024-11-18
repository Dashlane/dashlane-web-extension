import { CommandQueryBusConfig } from "Shared/Infrastructure";
import { ProtectedItemsUnlockerCommands } from "ProtectedItemsUnlocker/Api/commands";
import { ProtectedItemsUnlockerLiveQueries } from "ProtectedItemsUnlocker/Api/live-queries";
import { ProtectedItemsUnlockerQueries } from "ProtectedItemsUnlocker/Api/queries";
import { unlockProtectedItems } from "ProtectedItemsUnlocker/ProtectedItemsUnlockerServices";
import { vaultLockDateSelector } from "ProtectedItemsUnlocker/selectors";
import { disableCredentialProtectionHandler } from "../disable-credential-protection-handler";
import { vaultLockDate$ } from "ProtectedItemsUnlocker/live";
export const config: CommandQueryBusConfig<
  ProtectedItemsUnlockerCommands,
  ProtectedItemsUnlockerQueries,
  ProtectedItemsUnlockerLiveQueries
> = {
  commands: {
    unlockProtectedItems: { handler: unlockProtectedItems },
    disableCredentialProtection: {
      handler: disableCredentialProtectionHandler,
    },
  },
  queries: {
    vaultLockDate: {
      selector: vaultLockDateSelector,
    },
  },
  liveQueries: {
    liveVaultLockDate: { operator: vaultLockDate$ },
  },
};
