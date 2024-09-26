import { slot } from "ts-event-bus";
import { liveSlot } from "../CarbonApi";
import {
  AddUserMessageRequest,
  DismissUserMessagesRequest,
  UserMessage,
} from "./types";
export const userMessagesQueriesSlots = {
  getVisibleUserMessages: slot<void, UserMessage[]>(),
  getUserMessages: slot<void, UserMessage[]>(),
};
export const userMessagesLiveQueriesSlots = {
  liveUserMessages: liveSlot<UserMessage[]>(),
  liveVisibleUserMessages: liveSlot<UserMessage[]>(),
};
export const userMessagesCommandsSlots = {
  dismissUserMessages: slot<DismissUserMessagesRequest, void>(),
  addUserMessage: slot<AddUserMessageRequest, void>(),
};
