import { CommandQueryBusConfig, NoQueries } from "Shared/Infrastructure";
import { SocialSecurityIdCommands } from "DataManagement/Ids/SocialSecurityIds/Api/commands";
import {
  addSocialSecurityIdHandler,
  editSocialSecurityIdHandler,
} from "DataManagement/Ids/SocialSecurityIds/handlers";
export const config: CommandQueryBusConfig<
  SocialSecurityIdCommands,
  NoQueries,
  NoQueries
> = {
  commands: {
    addSocialSecurityId: { handler: addSocialSecurityIdHandler },
    editSocialSecurityId: { handler: editSocialSecurityIdHandler },
  },
  queries: undefined,
  liveQueries: undefined,
};
