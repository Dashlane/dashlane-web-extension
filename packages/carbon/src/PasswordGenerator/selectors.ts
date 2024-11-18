import { PasswordGenerationSettings } from "@dashlane/communication";
import { State } from "Store";
import { personalSettingsSelector } from "Session/selectors";
import { getDefaultPasswordGenerationSettings } from "DataManagement/GeneratedPassword";
export function passwordGenerationSettingsSelector(
  state: State
): PasswordGenerationSettings {
  const personalSettings = personalSettingsSelector(state);
  const settings = getDefaultPasswordGenerationSettings(personalSettings);
  return settings;
}
