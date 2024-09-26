import {
  AddIdCardRequest,
  AddIdCardResult,
  EditIdCardRequest,
  EditIdCardResult,
} from "@dashlane/communication";
import { Command } from "Shared/Api";
export type IdCardCommands = {
  addIdCard: Command<AddIdCardRequest, AddIdCardResult>;
  editIdCard: Command<EditIdCardRequest, EditIdCardResult>;
};
