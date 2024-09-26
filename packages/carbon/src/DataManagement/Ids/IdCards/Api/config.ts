import { CommandQueryBusConfig, NoQueries } from "Shared/Infrastructure";
import { IdCardCommands } from "DataManagement/Ids/IdCards/Api/commands";
import {
  addIdCardHandler,
  editIdCardHandler,
} from "DataManagement/Ids/IdCards/handlers";
export const config: CommandQueryBusConfig<
  IdCardCommands,
  NoQueries,
  NoQueries
> = {
  commands: {
    addIdCard: { handler: addIdCardHandler },
    editIdCard: { handler: editIdCardHandler },
  },
  queries: undefined,
  liveQueries: undefined,
};
