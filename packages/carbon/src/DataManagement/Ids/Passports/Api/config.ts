import { CommandQueryBusConfig, NoQueries } from "Shared/Infrastructure";
import { PassportCommands } from "DataManagement/Ids/Passports/Api/commands";
import {
  addPassportHandler,
  editPassportHandler,
} from "DataManagement/Ids/Passports/handlers";
export const config: CommandQueryBusConfig<
  PassportCommands,
  NoQueries,
  NoQueries
> = {
  commands: {
    addPassport: { handler: addPassportHandler },
    editPassport: { handler: editPassportHandler },
  },
  queries: undefined,
  liveQueries: undefined,
};
