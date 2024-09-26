import { CommandQueryBusConfig } from "Shared/Infrastructure";
import { anonymousComputerIdSelector } from "Device/selectors";
import { platformInfoSelector } from "Authentication/selectors";
import { DeviceQueries } from "./queries";
import { DeviceCommands } from "./commands";
import { cleanRemotelyRemovedProfilesHandler } from "Device/handlers";
export const config: CommandQueryBusConfig<DeviceCommands, DeviceQueries> = {
  commands: {
    cleanRemotelyRemovedProfiles: {
      handler: cleanRemotelyRemovedProfilesHandler,
    },
  },
  queries: {
    getAnonymousComputerId: {
      selector: anonymousComputerIdSelector,
    },
    getPlatformInfo: {
      selector: platformInfoSelector,
    },
  },
  liveQueries: {},
};
