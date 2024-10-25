import { CommandQueryBusConfig, NoCommands } from "Shared/Infrastructure";
import { StaticDataQueries } from "StaticData/Api/queries";
import { getAllBanks, getBanks } from "StaticData/Banks";
import { getSecureDocumentsAllowedExtensions } from "StaticData/SecureDocuments";
export const config: CommandQueryBusConfig<NoCommands, StaticDataQueries> = {
  commands: {},
  queries: {
    getBanks: { staticDataHandler: getBanks },
    getAllBanks: { staticDataHandler: getAllBanks },
    getSecureDocumentsExtensionsList: {
      staticDataHandler: getSecureDocumentsAllowedExtensions,
    },
  },
  liveQueries: {},
};
