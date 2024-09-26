import {
  AddPasskeyRequest,
  AddPasskeyResult,
  DeletePasskeyRequest,
  DeletePasskeyResult,
  UpdatePasskeyRequest,
  UpdatePasskeyResult,
} from "@dashlane/communication";
import { Command } from "Shared/Api";
export type PasskeyCommands = {
  addPasskey: Command<AddPasskeyRequest, AddPasskeyResult>;
  updatePasskey: Command<UpdatePasskeyRequest, UpdatePasskeyResult>;
  deletePasskey: Command<DeletePasskeyRequest, DeletePasskeyResult>;
};
