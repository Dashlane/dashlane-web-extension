import { UserMessage } from "@dashlane/communication";
import { Query } from "Shared/Api";
export type UserMessagesQueries = {
  getVisibleUserMessages: Query<void, UserMessage[]>;
  getUserMessages: Query<void, UserMessage[]>;
};
