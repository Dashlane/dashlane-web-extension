import { PersonalSettings } from "@dashlane/communication";
import { CoreServices } from "Services";
import { editPersonalSettings } from "Session/Store/personalSettings/actions";
export const updateAccountRecoveryKeyPersonalSettingsHandler = (
  services: CoreServices,
  personalSettings: Partial<PersonalSettings>
): Promise<void> => {
  services.storeService.dispatch(editPersonalSettings(personalSettings));
  return Promise.resolve();
};
