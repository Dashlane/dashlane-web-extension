import { slot } from "ts-event-bus";
import {
  GenerateAndSavePasswordRequest,
  GeneratePasswordRequest,
  GeneratePasswordResult,
  PasswordGenerationSettings,
} from "./types";
export const passwordGeneratorCommandsSlots = {
  generatePassword: slot<GeneratePasswordRequest, GeneratePasswordResult>(),
  generateAndSavePassword: slot<
    GenerateAndSavePasswordRequest,
    GeneratePasswordResult
  >(),
  savePasswordGenerationSettings: slot<PasswordGenerationSettings, void>(),
};
export const passwordGeneratorQueriesSlots = {
  getPasswordGenerationSettings: slot<void, PasswordGenerationSettings>(),
};
