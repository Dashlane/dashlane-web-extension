import { PasswordGenerationSettings } from "@dashlane/communication";
import { carbonConnector } from "../../../carbonConnector";
export const getSavedPasswordGenerationSettings = async () => {
  return await carbonConnector.getPasswordGenerationSettings();
};
export const savePasswordGenerationSettings = (
  settings: PasswordGenerationSettings
) => {
  carbonConnector.savePasswordGenerationSettings(settings);
};
