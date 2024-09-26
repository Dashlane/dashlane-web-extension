import {
  ChangeMasterPasswordParams,
  ChangeMasterPasswordResponse,
} from "@dashlane/communication";
import { Command } from "Shared/Api";
export type ChangeMasterPasswordCommands = {
  changeMasterPassword: Command<
    ChangeMasterPasswordParams,
    ChangeMasterPasswordResponse
  >;
};
