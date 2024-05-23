import { runtimeGetId, tabsGetCurrent } from '@dashlane/webextensions-apis';
export default {
    closePopover: async () => {
        const tab = await tabsGetCurrent();
        const isPopover = typeof tab === 'undefined';
        if (isPopover) {
            window.close();
        }
    },
    onPopoverOpen: (eventListener: () => void) => {
        window.addEventListener('load', eventListener, true);
    },
    getExtensionId: () => runtimeGetId(),
};
