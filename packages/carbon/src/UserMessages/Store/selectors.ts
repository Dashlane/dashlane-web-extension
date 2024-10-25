import { createSelector } from "reselect";
import { State } from "Store";
import { UserMessage, UserMessageTypes } from "@dashlane/communication";
export const getUserMessagesSelector = (state: State): UserMessage[] =>
  state.userSession.localSettings.userMessages;
export const getUserMessagesByTypeSelector = (
  state: State,
  type: UserMessageTypes
): UserMessage[] =>
  state.userSession.localSettings.userMessages.filter(
    (userMessage) => userMessage.type === type
  );
const filterDismissedMessages = (userMessages: UserMessage[]) =>
  userMessages.filter(({ dismissedAt }) => !dismissedAt);
export const getVisibleUserMessagesSelector = createSelector(
  getUserMessagesSelector,
  filterDismissedMessages
);
