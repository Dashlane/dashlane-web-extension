import { CommandQueryBusConfig, NoQueries } from "Shared/Infrastructure";
import { FiscalIdCommands } from "DataManagement/Ids/FiscalIds/Api/commands";
import {
  addFiscalIdHandler,
  editFiscalIdHandler,
} from "DataManagement/Ids/FiscalIds/handlers";
export const config: CommandQueryBusConfig<
  FiscalIdCommands,
  NoQueries,
  NoQueries
> = {
  commands: {
    addFiscalId: { handler: addFiscalIdHandler },
    editFiscalId: { handler: editFiscalIdHandler },
  },
  queries: undefined,
  liveQueries: undefined,
};
