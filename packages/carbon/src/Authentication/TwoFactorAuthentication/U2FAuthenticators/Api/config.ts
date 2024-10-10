import { CommandQueryBusConfig } from "Shared/Infrastructure";
import { removeU2FAuthenticatorHandler } from "Authentication/TwoFactorAuthentication/U2FAuthenticators/handlers/remove-u2f-authenticator-handler";
import { refreshU2FDevicesListHandler } from "Authentication/TwoFactorAuthentication/U2FAuthenticators/handlers/refresh-u2f-devices";
import { U2FAuthenticatorsCommands } from "Authentication/TwoFactorAuthentication/U2FAuthenticators/Api/commands";
import { U2FAuthenticatorsLiveQueries } from "Authentication/TwoFactorAuthentication/U2FAuthenticators/Api/live-queries";
import { U2FAuthenticatorsQueries } from "Authentication/TwoFactorAuthentication/U2FAuthenticators/Api/queries";
import { listU2FDevices$ } from "Authentication/TwoFactorAuthentication/U2FAuthenticators/live";
import { listU2FDevicesSelector } from "Authentication/TwoFactorAuthentication/U2FAuthenticators/selectors";
export const config: CommandQueryBusConfig<
  U2FAuthenticatorsCommands,
  U2FAuthenticatorsQueries,
  U2FAuthenticatorsLiveQueries
> = {
  commands: {
    removeU2FAuthenticator: {
      handler: removeU2FAuthenticatorHandler,
    },
    refreshU2FDevicesList: { handler: refreshU2FDevicesListHandler },
  },
  queries: {
    getU2FDevicesList: {
      selector: listU2FDevicesSelector,
    },
  },
  liveQueries: {
    liveU2FDevicesList: { operator: listU2FDevices$ },
  },
};
