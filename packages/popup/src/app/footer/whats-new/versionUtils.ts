import whatsNew from 'app/footer/whats-new/whatsNew.json';
import { storageLocalGet, storageLocalSet } from '@dashlane/webextensions-apis';
const lastSeenWhatsNewVersionKey = 'lastSeenWhatsNewVersion';
export const getLocalWhatsNewVersion = (): string => {
    return whatsNew.version || '';
};
export const getLastSeenWhatsNewVersion = async (): Promise<string> => {
    const result = await storageLocalGet(lastSeenWhatsNewVersionKey);
    return result[lastSeenWhatsNewVersionKey]
        ? (result[lastSeenWhatsNewVersionKey] as string)
        : '';
};
export const storeLastSeenWhatsNewVersion = (version: string): void => {
    void storageLocalSet({ [lastSeenWhatsNewVersionKey]: version });
};
