import { useCallback, useEffect, useState } from 'react';
import { isEqual } from 'lodash';
import { DataStatus } from '@dashlane/carbon-api-consumers';
import { NotificationStatus, SharingNotification } from './types';
import { useSharingInvites } from './use-sharing-invites';
export interface UseSharingNotifications {
    isLoading: boolean;
    notifications: SharingNotification[];
    updateNotificationStatus: (notificationIds: string[], status: NotificationStatus, matchingPrevStatus?: NotificationStatus) => void;
    removeSharingNotifications: (notificationIds: string[]) => void;
}
export const useSharingNotifications = (): UseSharingNotifications => {
    const sharingInvitesQuery = useSharingInvites();
    const [notifications, setNotifications] = useState<SharingNotification[]>([]);
    const [cachedItemGroupIds, setCachedItemGroupIds] = useState<string[]>([]);
    const [cachedUserGroupIds, setCachedUserGroupIds] = useState<string[]>([]);
    const [cachedCollectionIds, setCachedCollectionIds] = useState<string[]>([]);
    const isLoading = sharingInvitesQuery.status === DataStatus.Loading;
    const updateNotifications = useCallback((latestNotifications: SharingNotification[]) => {
        setNotifications((prevNotifications) => [
            ...prevNotifications,
            ...latestNotifications.filter(({ id }) => !prevNotifications.some((notification) => notification.id === id)),
        ]);
    }, []);
    const updateNotificationStatus = useCallback((notificationIds: string[], status: NotificationStatus, matchingPrevStatus?: NotificationStatus) => {
        setNotifications((prevNotifications) => prevNotifications.map((prevNotification) => notificationIds.includes(prevNotification.id) &&
            (matchingPrevStatus === undefined ||
                prevNotification.status === matchingPrevStatus)
            ? {
                ...prevNotification,
                status,
            }
            : prevNotification));
    }, []);
    const removeSharingNotifications = useCallback((notificationIds: string[]) => {
        setCachedItemGroupIds((prevCache) => prevCache.filter((id) => !notificationIds.includes(id)));
        setCachedUserGroupIds((prevCache) => prevCache.filter((id) => !notificationIds.includes(id)));
        setCachedCollectionIds((prevCache) => prevCache.filter((id) => !notificationIds.includes(id)));
        setNotifications((prevNotifications) => prevNotifications.filter((notification) => !notificationIds.includes(notification.id)));
    }, []);
    useEffect(() => {
        if (sharingInvitesQuery.status === DataStatus.Success) {
            const pendingItemGroups = sharingInvitesQuery.data.pendingItemGroups;
            const latestItemGroupIds = pendingItemGroups.map((sharingGroup) => sharingGroup.itemGroupId);
            if (!isEqual(cachedItemGroupIds, latestItemGroupIds)) {
                setCachedItemGroupIds(latestItemGroupIds);
                updateNotifications(pendingItemGroups.map((itemGroup) => ({
                    itemGroup,
                    status: itemGroup.seen
                        ? NotificationStatus.Pending
                        : NotificationStatus.New,
                    id: itemGroup.itemGroupId,
                    type: 'item' as const,
                })));
                const refusedNotifications = notifications.filter(({ id, status }) => cachedItemGroupIds.includes(id) &&
                    !latestItemGroupIds.includes(id) &&
                    (status === NotificationStatus.Refused ||
                        status === NotificationStatus.RefusalInProgress));
                if (refusedNotifications.length > 0) {
                    removeSharingNotifications(refusedNotifications.map(({ id }) => id));
                }
                const revokedNotifications = notifications.filter(({ id, status }) => cachedItemGroupIds.includes(id) &&
                    !latestItemGroupIds.includes(id) &&
                    status !== NotificationStatus.Accepted &&
                    status !== NotificationStatus.AcceptJustSucceeded &&
                    status !== NotificationStatus.AcceptInProgress &&
                    status !== NotificationStatus.Refused &&
                    status !== NotificationStatus.RefusalInProgress);
                if (revokedNotifications.length > 0) {
                    updateNotificationStatus(revokedNotifications.map(({ id }) => id), NotificationStatus.Unshared);
                }
            }
            const pendingUserGroups = sharingInvitesQuery.data.pendingUserGroups;
            const latestUserGroupIds = pendingUserGroups.map((sharingGroup) => sharingGroup.groupId);
            if (!isEqual(cachedUserGroupIds, latestUserGroupIds)) {
                setCachedUserGroupIds(latestUserGroupIds);
                updateNotifications(pendingUserGroups.map((userGroup) => ({
                    userGroup,
                    status: userGroup.seen
                        ? NotificationStatus.Pending
                        : NotificationStatus.New,
                    id: userGroup.groupId,
                    type: 'group' as const,
                })));
                const refusedNotifications = notifications.filter(({ id, status }) => cachedUserGroupIds.includes(id) &&
                    !latestUserGroupIds.includes(id) &&
                    (status === NotificationStatus.Refused ||
                        status === NotificationStatus.RefusalInProgress));
                if (refusedNotifications.length > 0) {
                    removeSharingNotifications(refusedNotifications.map(({ id }) => id));
                }
                const revokedNotifications = notifications.filter(({ id, status }) => cachedUserGroupIds.includes(id) &&
                    !latestUserGroupIds.includes(id) &&
                    status !== NotificationStatus.Accepted &&
                    status !== NotificationStatus.AcceptJustSucceeded &&
                    status !== NotificationStatus.AcceptInProgress &&
                    status !== NotificationStatus.Refused &&
                    status !== NotificationStatus.RefusalInProgress);
                if (revokedNotifications.length > 0) {
                    updateNotificationStatus(revokedNotifications.map(({ id }) => id), NotificationStatus.Unshared);
                }
            }
            const pendingCollections = sharingInvitesQuery.data.pendingCollections;
            const latestCollectionIds = pendingCollections.map((sharingCollection) => sharingCollection.uuid);
            if (!isEqual(cachedCollectionIds, latestCollectionIds)) {
                setCachedCollectionIds(latestCollectionIds);
                updateNotifications(pendingCollections.map((collection) => ({
                    collection,
                    status: collection.seen
                        ? NotificationStatus.Pending
                        : NotificationStatus.New,
                    id: collection.uuid,
                    type: 'collection' as const,
                })));
                const refusedNotifications = notifications.filter(({ id, status }) => cachedCollectionIds.includes(id) &&
                    !latestCollectionIds.includes(id) &&
                    (status === NotificationStatus.Refused ||
                        status === NotificationStatus.RefusalInProgress));
                if (refusedNotifications.length > 0) {
                    removeSharingNotifications(refusedNotifications.map(({ id }) => id));
                }
                const revokedNotifications = notifications.filter(({ id, status }) => cachedCollectionIds.includes(id) &&
                    !latestCollectionIds.includes(id) &&
                    status !== NotificationStatus.Accepted &&
                    status !== NotificationStatus.AcceptJustSucceeded &&
                    status !== NotificationStatus.AcceptInProgress &&
                    status !== NotificationStatus.Refused &&
                    status !== NotificationStatus.RefusalInProgress);
                if (revokedNotifications.length > 0) {
                    updateNotificationStatus(revokedNotifications.map(({ id }) => id), NotificationStatus.Unshared);
                }
            }
        }
    }, [
        notifications,
        sharingInvitesQuery,
        cachedItemGroupIds,
        cachedUserGroupIds,
        cachedCollectionIds,
        updateNotifications,
        removeSharingNotifications,
        updateNotificationStatus,
    ]);
    return {
        isLoading,
        notifications,
        updateNotificationStatus,
        removeSharingNotifications,
    };
};
