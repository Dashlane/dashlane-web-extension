import { ShareableItemType } from "@dashlane/sharing-contracts";
import { redirect } from "../../../libs/router";
import { useProtectedItemsUnlocker } from "../../unlock-items/useProtectedItemsUnlocker";
import { LockedItemType, UnlockerAction } from "../../unlock-items/types";
import { NotificationActions } from "../common/notification-actions";
import { SharedItemNotification } from "../types";
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
export const PendingItemActions = ({
  notification,
  acceptPendingItemGroup,
  refusePendingItemGroup,
  removeUnsharedItem,
  confirmRefusePendingItemGroup,
  cancelRefusePendingItemGroup,
  routes,
}: PendingItemActionsProps) => {
  const { areProtectedItemsUnlocked, openProtectedItemsUnlocker } =
    useProtectedItemsUnlocker();
  const sharedItem = notification.itemGroup;
  const isItemLocked =
    (sharedItem.itemType === ShareableItemType.SecureNote ||
      sharedItem.itemType === ShareableItemType.Secret) &&
    sharedItem.secured &&
    !areProtectedItemsUnlocked;
  const path =
    sharedItem.itemType === ShareableItemType.Credential
      ? routes.userCredential(sharedItem.vaultItemId)
      : sharedItem.itemType === ShareableItemType.SecureNote
      ? routes.userSecureNote(sharedItem.vaultItemId)
      : routes.userSecret(sharedItem.vaultItemId);
  return (
    <NotificationActions
      notificationId={notification.id}
      notificationStatus={notification.status}
      onAcceptPending={acceptPendingItemGroup}
      onRefusePending={refusePendingItemGroup}
      onRemoveUnshared={removeUnsharedItem}
      onConfirmRefusal={confirmRefusePendingItemGroup}
      onCancelRefusal={cancelRefusePendingItemGroup}
      onAccepted={() => {
        if (isItemLocked) {
          openProtectedItemsUnlocker({
            action: UnlockerAction.Show,
            itemType:
              sharedItem.itemType === ShareableItemType.SecureNote
                ? LockedItemType.SecureNote
                : LockedItemType.Secret,
            successCallback: () => {
              redirect(path);
            },
          });
        } else {
          redirect(path);
        }
      }}
    />
  );
};
