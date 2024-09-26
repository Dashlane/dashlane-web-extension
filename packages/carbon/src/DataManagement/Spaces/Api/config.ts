import { SpaceQueries } from "DataManagement/Spaces/Api/queries";
import {
  viewedSpaceSelector,
  viewedSpacesSelector,
} from "DataManagement/Spaces/selectors";
import { CommandQueryBusConfig, NoCommands } from "Shared/Infrastructure";
export const config: CommandQueryBusConfig<NoCommands, SpaceQueries> = {
  commands: {},
  queries: {
    getSpace: { selector: viewedSpaceSelector },
    getSpaces: { selector: viewedSpacesSelector },
  },
  liveQueries: {},
};
