import { CommandQueryBusConfig } from "Shared/Infrastructure";
import {
  getUserMessagesSelector,
  getVisibleUserMessagesSelector,
} from "UserMessages/Store/selectors";
import { liveUserMessages$, liveVisibleUserMessages$ } from "UserMessages/live";
import { dismissUserMessagesHandler } from "UserMessages/handlers/dismissUserMessagesHandler";
import { addUserMessageHandler } from "UserMessages/handlers/addUserMessageHandler";
import { UserMessagesCommands } from "UserMessages/Api/commands";
import { UserMessagesQueries } from "UserMessages/Api/queries";
import { UserMessagesLiveQueries } from "UserMessages/Api/live-queries";
export const config: CommandQueryBusConfig<
  UserMessagesCommands,
  UserMessagesQueries,
  UserMessagesLiveQueries
> = {
  commands: {
    dismissUserMessages: { handler: dismissUserMessagesHandler },
    addUserMessage: { handler: addUserMessageHandler },
  },
  queries: {
    getVisibleUserMessages: { selector: getVisibleUserMessagesSelector },
    getUserMessages: { selector: getUserMessagesSelector },
  },
  liveQueries: {
    liveVisibleUserMessages: { operator: liveVisibleUserMessages$ },
    liveUserMessages: { operator: liveUserMessages$ },
  },
};
