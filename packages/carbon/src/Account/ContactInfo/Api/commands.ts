import {
  EditContactInfoClientRequest,
  EditContactInfoClientResult,
  RefreshContactInfoResult,
} from "@dashlane/communication";
import { Command } from "Shared/Api";
export type ContactInfoCommands = {
  editContactInfo: Command<
    EditContactInfoClientRequest,
    EditContactInfoClientResult
  >;
  refreshContactInfo: Command<undefined, RefreshContactInfoResult>;
};
