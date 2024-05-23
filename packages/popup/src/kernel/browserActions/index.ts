import WebExtensionsActions from 'kernel/browserActions/webextensions';
import MockBrowserActions from 'kernel/browserActions/mock';
export interface BrowserActions {
    closePopover: () => void;
    onPopoverOpen: (eventListener: () => void) => void;
    getExtensionId: () => string;
}
export const makeBrowserActions = (): BrowserActions => {
    if (window.chrome && window.chrome.runtime) {
        return WebExtensionsActions;
    }
    throw new Error('Communication bridge is not implemented for this browser');
};
