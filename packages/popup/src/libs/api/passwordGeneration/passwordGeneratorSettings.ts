import { PasswordGenerationSettings } from '@dashlane/communication';
import { carbonConnector } from 'src/carbonConnector';
export const getSavedPasswordGenerationSettings = async () => {
    return await carbonConnector.getPasswordGenerationSettings();
};
export const savePasswordGenerationSettings = (settings: PasswordGenerationSettings) => {
    carbonConnector.savePasswordGenerationSettings(settings);
};
