import { SaveGeneratedPasswordRequest } from "@dashlane/communication";
import { Command } from "Shared/Api";
export type GeneratedPasswordCommands = {
  saveGeneratedPassword: Command<SaveGeneratedPasswordRequest, void>;
};
