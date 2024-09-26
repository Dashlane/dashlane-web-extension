import { CommandQueryBusConfig, NoQueries } from "Shared/Infrastructure";
import { DriverLicenseCommands } from "DataManagement/Ids/DriverLicenses/Api/commands";
import {
  addDriverLicenseHandler,
  editDriverLicenseHandler,
} from "DataManagement/Ids/DriverLicenses/handlers";
export const config: CommandQueryBusConfig<
  DriverLicenseCommands,
  NoQueries,
  NoQueries
> = {
  commands: {
    addDriverLicense: { handler: addDriverLicenseHandler },
    editDriverLicense: { handler: editDriverLicenseHandler },
  },
  queries: undefined,
  liveQueries: undefined,
};
