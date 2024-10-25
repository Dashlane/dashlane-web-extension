import {
  AddUserMessageRequest,
  DismissUserMessagesRequest,
} from "@dashlane/communication";
import { Command } from "Shared/Api";
export type UserMessagesCommands = {
  dismissUserMessages: Command<DismissUserMessagesRequest, void>;
  addUserMessage: Command<AddUserMessageRequest, void>;
};
