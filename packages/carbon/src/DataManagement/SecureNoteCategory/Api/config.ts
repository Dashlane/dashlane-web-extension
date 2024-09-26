import { CommandQueryBusConfig } from "Shared/Infrastructure";
import { setupDefaultNoteCategoriesHandler } from "../handlers/setupDefaultNoteCategories";
import { SecureNoteCategoryCommands } from "DataManagement/SecureNoteCategory/Api/commands";
export const config: CommandQueryBusConfig<SecureNoteCategoryCommands> = {
  commands: {
    setupDefaultNoteCategories: {
      handler: setupDefaultNoteCategoriesHandler,
    },
  },
  queries: {},
  liveQueries: {},
};
