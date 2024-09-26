import {
  AddFiscalIdRequest,
  AddFiscalIdResult,
  EditFiscalIdRequest,
  EditFiscalIdResult,
} from "@dashlane/communication";
import { Command } from "Shared/Api";
export type FiscalIdCommands = {
  addFiscalId: Command<AddFiscalIdRequest, AddFiscalIdResult>;
  editFiscalId: Command<EditFiscalIdRequest, EditFiscalIdResult>;
};
