import { RequiredExtensionSettings } from '@dashlane/communication';
import { carbonConnector } from '../../libs/carbon/connector';
export const useGlobalExtensionSettings = () => {
    return {
        getIsConsentNeeded: async () => (await carbonConnector.getGlobalExtensionSettings())
            .personalDataConsent !== true,
        setUserConsent: async (settings: RequiredExtensionSettings) => await carbonConnector.setGlobalExtensionSettings(settings),
        getUserConsent: async () => await carbonConnector.getGlobalExtensionSettings(),
    };
};
