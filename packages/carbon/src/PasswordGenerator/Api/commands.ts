import {
  GenerateAndSavePasswordRequest,
  GeneratePasswordRequest,
  GeneratePasswordResult,
  PasswordGenerationSettings,
} from "@dashlane/communication";
import { Command } from "Shared/Api";
export type PasswordGeneratorCommands = {
  generatePassword: Command<GeneratePasswordRequest, GeneratePasswordResult>;
  generateAndSavePassword: Command<
    GenerateAndSavePasswordRequest,
    GeneratePasswordResult
  >;
  savePasswordGenerationSettings: Command<PasswordGenerationSettings, void>;
};
