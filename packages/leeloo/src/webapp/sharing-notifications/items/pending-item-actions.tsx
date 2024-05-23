import React from 'react';
import { isCredential, isNote } from '@dashlane/communication';
import { redirect } from 'libs/router';
import { useProtectedItemsUnlocker } from 'webapp/unlock-items/useProtectedItemsUnlocker';
import { LockedItemType, UnlockerAction } from 'webapp/unlock-items/types';
import { NotificationActions } from '../common/notification-actions';
import { SharedItemNotification } from '../types';
interface PendingItemActionsProps {
    notification: SharedItemNotification;
    acceptPendingItemGroup: (itemGroupId: string) => void;
    refusePendingItemGroup: (itemGroupId: string) => void;
    removeUnsharedItem: (itemGroupId: string) => void;
    confirmRefusePendingItemGroup: (itemGroupId: string) => void;
    cancelRefusePendingItemGroup: (itemGroupId: string) => void;
    routes: {
        userCredential: (id: string) => string;
        userSecureNote: (id: string) => string;
        userSecret: (id: string) => string;
    };
}
export const PendingItemActions = ({ notification, acceptPendingItemGroup, refusePendingItemGroup, removeUnsharedItem, confirmRefusePendingItemGroup, cancelRefusePendingItemGroup, routes, }: PendingItemActionsProps) => {
    const { areProtectedItemsUnlocked, openProtectedItemsUnlocker } = useProtectedItemsUnlocker();
    const sharedItem = notification.itemGroup.items[0];
    const isItemNoteAndLocked = isNote(sharedItem) && sharedItem.Secured && !areProtectedItemsUnlocked;
    return (<NotificationActions notificationId={notification.id} notificationStatus={notification.status} onAcceptPending={acceptPendingItemGroup} onRefusePending={refusePendingItemGroup} onRemoveUnshared={removeUnsharedItem} onConfirmRefusal={confirmRefusePendingItemGroup} onCancelRefusal={cancelRefusePendingItemGroup} onAccepted={() => {
            const path = isCredential(sharedItem)
                ? routes.userCredential(sharedItem.Id)
                : isNote(sharedItem)
                    ? routes.userSecureNote(sharedItem.Id)
                    : routes.userSecret(sharedItem.Id);
            if (isItemNoteAndLocked) {
                openProtectedItemsUnlocker({
                    action: UnlockerAction.Show,
                    itemType: LockedItemType.SecureNote,
                    successCallback: () => {
                        redirect(path);
                    },
                });
            }
            else {
                redirect(path);
            }
        }}/>);
};
