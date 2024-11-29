import { useMemo, useRef } from "react";
import { Trigger } from "@dashlane/hermes";
import { isFailure, isSuccess } from "@dashlane/framework-types";
import { useModuleCommands } from "@dashlane/framework-react";
import { sharingInvitesApi } from "@dashlane/sharing-contracts";
import { syncApi } from "@dashlane/sync-contracts";
import { UseSharingNotifications } from "./use-sharing-notifications";
import { isSharedItemNotification, NotificationStatus } from "./types";
const TEMPORARY_STATUS_TIMEOUT = 2000;
export const useNotificationHandlers = ({
  notifications,
  updateNotificationStatus,
  removeSharingNotifications,
}: UseSharingNotifications) => {
  const { sync } = useModuleCommands(syncApi);
  const {
    acceptCollectionInvite,
    acceptSharedItemInvite,
    acceptUserGroupInvite,
    refuseCollectionInvite,
    refuseItemGroupInvite,
    refuseUserGroupInvite,
  } = useModuleCommands(sharingInvitesApi);
  const delayTimers = useRef<number[]>([]);
  return useMemo(() => {
    const updateNotificationWithFailureTransition = (
      failedNotificationIds: string[],
      status: NotificationStatus.AcceptFailed | NotificationStatus.RefusalFailed
    ) => {
      updateNotificationStatus(failedNotificationIds, status);
      if (failedNotificationIds.length > 0) {
        delayTimers.current.push(
          window.setTimeout(() => {
            updateNotificationStatus(
              failedNotificationIds,
              NotificationStatus.Pending
            );
          }, TEMPORARY_STATUS_TIMEOUT)
        );
      }
    };
    const handleSharingAccept = (
      notificationId: string,
      responseIsSuccessful: boolean
    ) => {
      if (responseIsSuccessful) {
        updateNotificationStatus(
          [notificationId],
          NotificationStatus.AcceptJustSucceeded
        );
        delayTimers.current.push(
          window.setTimeout(() => {
            updateNotificationStatus(
              [notificationId],
              NotificationStatus.Accepted
            );
          }, TEMPORARY_STATUS_TIMEOUT)
        );
      } else {
        updateNotificationWithFailureTransition(
          [notificationId],
          NotificationStatus.AcceptFailed
        );
      }
    };
    const handleSharingRefuse = (
      notificationId: string,
      responseIsSuccessful: boolean
    ) => {
      if (responseIsSuccessful) {
        updateNotificationStatus([notificationId], NotificationStatus.Refused);
      } else {
        updateNotificationWithFailureTransition(
          [notificationId],
          NotificationStatus.RefusalFailed
        );
      }
    };
    const acceptPendingUserGroup = async (userGroupId: string) => {
      updateNotificationStatus(
        [userGroupId],
        NotificationStatus.AcceptInProgress
      );
      const result = await acceptUserGroupInvite({ userGroupId });
      if (isFailure(result)) {
        handleSharingAccept(userGroupId, false);
      } else {
        handleSharingAccept(userGroupId, true);
      }
    };
    const confirmRefusePendingUserGroup = async (userGroupId: string) => {
      updateNotificationStatus(
        [userGroupId],
        NotificationStatus.RefusalInProgress
      );
      try {
        const response = await refuseUserGroupInvite({
          userGroupId: userGroupId,
        });
        if (isSuccess(response)) {
          updateNotificationStatus([userGroupId], NotificationStatus.Refused);
        } else {
          updateNotificationWithFailureTransition(
            [userGroupId],
            NotificationStatus.RefusalFailed
          );
        }
      } catch (error) {
        updateNotificationWithFailureTransition(
          [userGroupId],
          NotificationStatus.RefusalFailed
        );
      }
    };
    const acceptPendingCollection = async (
      collectionId: string,
      setToInProgress = true
    ) => {
      if (setToInProgress) {
        updateNotificationStatus(
          [collectionId],
          NotificationStatus.AcceptInProgress
        );
      }
      const result = await acceptCollectionInvite({
        collectionId,
      });
      if (isFailure(result)) {
        handleSharingAccept(collectionId, false);
      } else {
        handleSharingAccept(collectionId, true);
      }
    };
    const refusePendingCollection = async (collectionId: string) => {
      updateNotificationStatus(
        [collectionId],
        NotificationStatus.RefusalInProgress
      );
      const result = await refuseCollectionInvite({
        collectionId,
      });
      if (isFailure(result)) {
        handleSharingRefuse(collectionId, false);
      } else {
        handleSharingRefuse(collectionId, true);
      }
      sync({
        trigger: Trigger.Sharing,
      });
    };
    const acceptPendingItemGroup = async (itemGroupId: string) => {
      updateNotificationStatus(
        [itemGroupId],
        NotificationStatus.AcceptInProgress
      );
      const result = await acceptSharedItemInvite({ itemGroupId });
      if (isFailure(result)) {
        handleSharingAccept(itemGroupId, false);
      } else {
        handleSharingAccept(itemGroupId, true);
      }
    };
    const softDeclineNotification = (notificationId: string) => {
      updateNotificationStatus(
        [notificationId],
        NotificationStatus.ConfirmRefusal
      );
    };
    const cancelDeclineNotification = (notificationId: string) => {
      updateNotificationStatus([notificationId], NotificationStatus.Pending);
    };
    const confirmRefusePendingItemGroup = async (itemGroupId: string) => {
      updateNotificationStatus(
        [itemGroupId],
        NotificationStatus.RefusalInProgress
      );
      const itemNotifications = notifications.filter(isSharedItemNotification);
      const itemNotificationToRefuse = itemNotifications.find(
        (notification) => notification.itemGroup.sharedItemId === itemGroupId
      );
      if (itemNotificationToRefuse === undefined) {
        return;
      }
      try {
        const response = await refuseItemGroupInvite({
          itemGroupId,
        });
        if (isSuccess(response)) {
          updateNotificationStatus([itemGroupId], NotificationStatus.Refused);
        } else {
          updateNotificationWithFailureTransition(
            [itemGroupId],
            NotificationStatus.RefusalFailed
          );
        }
      } catch (error) {
        updateNotificationWithFailureTransition(
          [itemGroupId],
          NotificationStatus.RefusalFailed
        );
      }
    };
    const removeNotification = (notificationId: string) => {
      removeSharingNotifications([notificationId]);
    };
    return {
      acceptPendingItemGroup,
      acceptPendingCollection,
      acceptPendingUserGroup,
      cancelDeclineNotification,
      confirmRefusePendingUserGroup,
      confirmRefusePendingItemGroup,
      softDeclineNotification,
      refusePendingCollection,
      removeNotification,
    };
  }, [
    acceptCollectionInvite,
    acceptSharedItemInvite,
    acceptUserGroupInvite,
    notifications,
    refuseCollectionInvite,
    refuseItemGroupInvite,
    refuseUserGroupInvite,
    removeSharingNotifications,
    sync,
    updateNotificationStatus,
  ]);
};
