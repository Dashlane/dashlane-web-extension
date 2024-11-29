import React from "react";
import { NotificationActions } from "../common/notification-actions";
import { SharingNotification } from "../types";
interface PendingGroupActionsProps {
  notification: SharingNotification;
  acceptPendingUserGroup: (userGroupId: string) => void;
  refusePendingUserGroup: (userGroupId: string) => void;
  removeUnsharedUserGroup: (userGroupId: string) => void;
  confirmRefusePendingUserGroup: (userGroupId: string) => void;
  cancelRefusePendingUserGroup: (userGroupId: string) => void;
}
export const PendingGroupActions = ({
  notification,
  acceptPendingUserGroup,
  refusePendingUserGroup,
  removeUnsharedUserGroup,
  confirmRefusePendingUserGroup,
  cancelRefusePendingUserGroup,
}: PendingGroupActionsProps) => {
  return (
    <NotificationActions
      notificationId={notification.id}
      notificationStatus={notification.status}
      onAcceptPending={acceptPendingUserGroup}
      onRefusePending={refusePendingUserGroup}
      onRemoveUnshared={removeUnsharedUserGroup}
      onConfirmRefusal={confirmRefusePendingUserGroup}
      onCancelRefusal={cancelRefusePendingUserGroup}
      acceptedTranslationKey={
        "webapp_sharing_notifications_accept_group_succeeded"
      }
    />
  );
};
