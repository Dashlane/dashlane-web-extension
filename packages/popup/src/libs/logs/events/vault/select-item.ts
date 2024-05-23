import { Highlight, ItemType, UserSelectVaultItemEvent, } from '@dashlane/hermes';
import { logEvent } from '../../logEvent';
export const logSelectVaultItem = (itemId: string, itemType: ItemType, listIndex?: number, listLength?: number, highlight: Highlight = Highlight.None) => {
    logEvent(new UserSelectVaultItemEvent({
        highlight: highlight,
        index: listIndex,
        itemId,
        itemType,
        totalCount: listLength,
    }));
};
