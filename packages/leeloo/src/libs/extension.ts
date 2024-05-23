import { browser } from '@dashlane/browser-utils';
import { runtimeGetId } from '@dashlane/webextensions-apis';
export function isChromiumExtension(url = '') {
    return url.startsWith('*****');
}
export function isInChromeExtension(url = '') {
    return url.startsWith('*****') && browser.isChrome();
}
export function isInLegacyEdgeExtension(url = '') {
    return url.startsWith('ms-browser-extension://');
}
export function isInFirefoxExtension(url = '') {
    return url.startsWith('*****');
}
export function isInEdgeExtension(url = '') {
    return url.startsWith('*****') && browser.isEdge();
}
export const getExtensionId = (): string | null => {
    if (!APP_PACKAGED_IN_EXTENSION) {
        return null;
    }
    return runtimeGetId();
};
