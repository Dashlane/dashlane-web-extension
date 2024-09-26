import { ImportPersonalDataCommands } from "./commands";
import { ImportPersonalDataLives } from "./lives";
import { ImportPersonalDataQueries } from "./queries";
import { importPersonalDataState$ } from "../live";
import { importPersonalDataStateSelector } from "../selectors";
import { CommandQueryBusConfig } from "Shared/Infrastructure";
import { importPersonalDataHandler } from "../handlers/import-personal-data";
import { previewPersonalDataHandler } from "../handlers/preview-personal-data";
import { dismissDataImportHandler } from "../handlers/dismiss-data-import";
export const importApiConfig: CommandQueryBusConfig<
  ImportPersonalDataCommands,
  ImportPersonalDataQueries,
  ImportPersonalDataLives
> = {
  commands: {
    importPersonalData: {
      handler: importPersonalDataHandler,
    },
    previewPersonalData: {
      handler: previewPersonalDataHandler,
    },
    dismissPersonalDataImportNotifications: {
      handler: dismissDataImportHandler,
    },
  },
  queries: {
    getImportPersonalDataStatus: {
      selector: importPersonalDataStateSelector,
    },
  },
  liveQueries: {
    liveImportPersonalDataStatus: {
      operator: importPersonalDataState$,
    },
  },
};
