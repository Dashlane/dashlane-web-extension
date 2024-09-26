import { CommandQueryBusConfig } from "Shared/Infrastructure";
import { ExportCommands } from "DataManagement/Export/Api/commands";
import { ExportQueries } from "./queries";
import { getPersonalDataExport } from "DataManagement/Export/Services/get-personal-data-export";
import { isForcedDomainsEnabledSelector } from "./isForcedDomainsEnabled.selector";
export const config: CommandQueryBusConfig<ExportCommands, ExportQueries> = {
  commands: {
    getPersonalDataExport: {
      handler: getPersonalDataExport,
    },
  },
  queries: {
    getIsForcedDomainsEnabled: { selector: isForcedDomainsEnabledSelector },
  },
  liveQueries: {},
};
