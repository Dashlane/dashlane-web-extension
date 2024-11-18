import {
  PasswordGenerationSettings,
  PersonalSettings,
} from "@dashlane/communication";
import { Trigger } from "@dashlane/hermes";
import { logError } from "Logs/Debugger";
import { sendExceptionLog } from "Logs/Exception";
import { CoreServices } from "Services";
import { fixIncoherentSettings } from "DataManagement/GeneratedPassword";
import { updatePersonalSettings } from "DataManagement/Settings";
import { getDebounceSync } from "DataManagement/utils";
function generationSettingsToPersonalSettingsPartial(
  passwordGenerationSettings: PasswordGenerationSettings
): Partial<PersonalSettings> {
  return {
    GeneratorDefaultSize: passwordGenerationSettings.length,
    GeneratorDefaultAvoidAmbiguousChars:
      passwordGenerationSettings.avoidAmbiguous,
    GeneratorDefaultDigits: passwordGenerationSettings.digits,
    GeneratorDefaultLetters: passwordGenerationSettings.letters,
    GeneratorDefaultSymbols: passwordGenerationSettings.symbols,
  };
}
export async function savePasswordGenerationSettingsHandler(
  coreServices: CoreServices,
  request: PasswordGenerationSettings
): Promise<void> {
  try {
    const options = fixIncoherentSettings(request);
    const personalSettingsPartial =
      generationSettingsToPersonalSettingsPartial(options);
    updatePersonalSettings(
      coreServices.storeService,
      coreServices.sessionService,
      personalSettingsPartial
    );
    getDebounceSync(coreServices.storeService, coreServices.sessionService)(
      { immediateCall: true },
      Trigger.SettingsChange
    );
  } catch (error) {
    logError(error);
    sendExceptionLog({ error });
  }
}
