import { UserMessage } from "@dashlane/communication";
import { LiveQuery } from "Shared/Api";
export type UserMessagesLiveQueries = {
  liveUserMessages: LiveQuery<void, UserMessage[]>;
  liveVisibleUserMessages: LiveQuery<void, UserMessage[]>;
};
