const nextTick = require("next-tick");
import { isEmpty, isNil, merge, reject } from "ramda";
import { generate } from "@dashlane/password-generator";
import {
  ExceptionCriticality,
  PasswordGenerationSettings,
  PersonalSettings,
} from "@dashlane/communication";
import Debugger from "Logs/Debugger";
import { generateItemUuid } from "Utils/generateItemUuid";
import { getUnixTimestamp } from "Utils/getUnixTimestamp";
import * as SessionAction from "Session/Store/actions";
import { StoreService } from "Store/index";
import { SessionService } from "User/Services/types";
import { sendExceptionLog } from "Logs/Exception";
import { createGeneratedPassword } from "DataManagement/GeneratedPassword/generated-password.factories";
import { platformInfoSelector } from "Authentication/selectors";
export { associateGeneratedPasswordsToCredential } from "DataManagement/GeneratedPassword/associated-credential";
export const passwordGeneratorDefaultSettings: PasswordGenerationSettings = {
  length: 16,
  digits: true,
  letters: true,
  symbols: true,
  avoidAmbiguous: true,
};
export function getDefaultPasswordGenerationSettings(
  userSettings: PersonalSettings
): PasswordGenerationSettings {
  const rejectUnusableValues = reject((val) => isNil(val) || isEmpty(val));
  const userPasswordGenerationDefaultSettings: Partial<PasswordGenerationSettings> =
    rejectUnusableValues({
      length: userSettings.GeneratorDefaultSize,
      digits: userSettings.GeneratorDefaultDigits,
      letters: userSettings.GeneratorDefaultLetters,
      symbols: userSettings.GeneratorDefaultSymbols,
      avoidAmbiguous: userSettings.GeneratorDefaultAvoidAmbiguousChars,
    });
  const settings = merge(
    passwordGeneratorDefaultSettings,
    userPasswordGenerationDefaultSettings
  );
  return fixIncoherentSettings(settings);
}
export function fixIncoherentSettings(settings: PasswordGenerationSettings) {
  if (!settings.digits && !settings.letters && !settings.symbols) {
    settings.digits = true;
    settings.letters = true;
    settings.symbols = true;
  }
  if (settings.length === undefined || settings.length < 1) {
    settings.length = passwordGeneratorDefaultSettings.length;
  }
  return settings;
}
export function generatePassword(
  personalSettings: PersonalSettings,
  customSettings?: PasswordGenerationSettings
): string {
  const settingsToUse = isNil(customSettings)
    ? getDefaultPasswordGenerationSettings(personalSettings)
    : fixIncoherentSettings(customSettings);
  if (
    !settingsToUse.digits &&
    !settingsToUse.letters &&
    settingsToUse.symbols
  ) {
    const augmentedError = new Error(
      `Should not generate password from symbols only`
    );
    const personalSettingsGeneratorDefaults = {
      length: personalSettings.GeneratorDefaultSize,
      digits: personalSettings.GeneratorDefaultDigits,
      letters: personalSettings.GeneratorDefaultLetters,
      symbols: personalSettings.GeneratorDefaultSymbols,
      avoidAmbiguous: personalSettings.GeneratorDefaultAvoidAmbiguousChars,
    };
    const precisions = `customSettings = ${JSON.stringify(
      customSettings
    )}\npersonalSettingsGeneratorDefaults = ${JSON.stringify(
      personalSettingsGeneratorDefaults
    )}`;
    Debugger.error(augmentedError);
    sendExceptionLog({
      error: augmentedError,
      code: ExceptionCriticality.WARNING,
      precisions,
    });
    settingsToUse.digits = true;
    settingsToUse.letters = true;
    settingsToUse.symbols = true;
  }
  return generate(settingsToUse);
}
export function saveGeneratedPassword(
  storeService: StoreService,
  sessionService: SessionService,
  password: string,
  domain?: string
) {
  const newGeneratedPassword = createGeneratedPassword({
    Domain: domain ?? "",
    GeneratedDate: getUnixTimestamp(),
    Id: generateItemUuid(),
    Password: password,
    LastBackupTime: 0,
    Platform: platformInfoSelector(storeService.getState()).platformName,
  });
  storeService.dispatch(
    SessionAction.saveGeneratedPassword(newGeneratedPassword)
  );
  sessionService.getInstance().user.persistPersonalData();
}
export function generateAndSavePassword(
  storeService: StoreService,
  sessionService: SessionService,
  domain: string
): string | null {
  if (!storeService.isAuthenticated()) {
    Debugger.log("No session available to generateAndSavePassword");
    return null;
  }
  const password = generatePassword(storeService.getPersonalSettings());
  nextTick(() => {
    saveGeneratedPassword(storeService, sessionService, password, domain);
  });
  return password;
}
