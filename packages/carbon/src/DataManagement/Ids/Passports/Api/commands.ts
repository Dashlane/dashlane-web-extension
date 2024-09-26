import {
  AddPassportRequest,
  AddPassportResult,
  EditPassportRequest,
  EditPassportResult,
} from "@dashlane/communication";
import { Command } from "Shared/Api";
export type PassportCommands = {
  addPassport: Command<AddPassportRequest, AddPassportResult>;
  editPassport: Command<EditPassportRequest, EditPassportResult>;
};
