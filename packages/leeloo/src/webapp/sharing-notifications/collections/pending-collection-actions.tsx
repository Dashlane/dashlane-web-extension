import React from "react";
import { redirect } from "../../../libs/router";
import { NotificationActions } from "../common/notification-actions";
import { SharingNotification } from "../types";
interface PendingCollectionActionsProps {
  notification: SharingNotification;
  acceptPendingCollection: (collectionId: string) => void;
  refusePendingCollection: (collectionId: string) => void;
  removeUnsharedCollection: (collectionId: string) => void;
  confirmRefusePendingCollection: (collectionId: string) => void;
  cancelRefusePendingCollection: (collectionId: string) => void;
  routes: {
    userCollection: (id: string) => string;
  };
}
export const PendingCollectionActions = ({
  notification,
  acceptPendingCollection,
  refusePendingCollection,
  removeUnsharedCollection,
  confirmRefusePendingCollection,
  cancelRefusePendingCollection,
  routes,
}: PendingCollectionActionsProps) => {
  return (
    <NotificationActions
      notificationId={notification.id}
      notificationStatus={notification.status}
      onAcceptPending={acceptPendingCollection}
      onRefusePending={refusePendingCollection}
      onRemoveUnshared={removeUnsharedCollection}
      onConfirmRefusal={confirmRefusePendingCollection}
      onCancelRefusal={cancelRefusePendingCollection}
      onAccepted={() => {
        redirect(routes.userCollection(notification.id));
      }}
    />
  );
};
