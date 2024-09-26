import { slot } from "ts-event-bus";
import {
  AddFiscalIdRequest,
  AddFiscalIdResult,
  EditFiscalIdRequest,
  EditFiscalIdResult,
} from "./types";
export const fiscalsIdCommandsSlots = {
  addFiscalId: slot<AddFiscalIdRequest, AddFiscalIdResult>(),
  editFiscalId: slot<EditFiscalIdRequest, EditFiscalIdResult>(),
};
