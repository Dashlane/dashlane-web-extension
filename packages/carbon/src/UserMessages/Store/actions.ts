import {
  DismissUserMessagesRequest,
  UserMessage,
} from "@dashlane/communication";
import { Action } from "Store";
export const USER_MESSAGE_ADDED = "USER_MESSAGE_ADDED";
export const USER_MESSAGES_DISMISSED = "USER_MESSAGES_DISMISSED";
export interface UserMessageAddedAction extends Action {
  type: typeof USER_MESSAGE_ADDED;
  userMessage: UserMessage;
}
export interface UserMessagesDismissedAction extends Action {
  type: typeof USER_MESSAGES_DISMISSED;
}
export const userMessageAdded = (
  userMessage: UserMessage
): UserMessageAddedAction => ({
  type: USER_MESSAGE_ADDED,
  userMessage,
});
export const userMessagesDismissed = (
  predicate: DismissUserMessagesRequest
): UserMessagesDismissedAction => ({
  type: USER_MESSAGES_DISMISSED,
  predicate,
});
