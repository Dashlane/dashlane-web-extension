import { PendingItemGroup, PendingUserGroup } from '@dashlane/communication';
import { PendingCollection } from '@dashlane/sharing-contracts';
export enum NotificationStatus {
    AcceptFailed,
    AcceptInProgress,
    AcceptJustSucceeded,
    Accepted,
    ConfirmRefusal,
    New,
    Pending,
    RefusalFailed,
    RefusalInProgress,
    Refused,
    Unshared
}
export interface SharedItemNotificationWithoutItems {
    itemGroup: Omit<PendingItemGroup, 'items'>;
    status: NotificationStatus;
    id: string;
    type: 'item';
}
export type SharingNotification = SharedItemNotificationWithoutItems | GroupInviteNotification | SharedCollectionNotification;
export interface SharedItemNotification {
    itemGroup: PendingItemGroup;
    status: NotificationStatus;
    id: string;
    type: 'item';
}
export interface GroupInviteNotification {
    userGroup: PendingUserGroup;
    status: NotificationStatus;
    id: string;
    type: 'group';
}
export interface SharedCollectionNotification {
    collection: PendingCollection;
    status: NotificationStatus;
    id: string;
    type: 'collection';
}
export function isSharedItemNotification(notification: SharedItemNotification | GroupInviteNotification | SharedCollectionNotification): notification is SharedItemNotification {
    return notification.type === 'item';
}
export function isGroupInviteNotification(notification: SharedItemNotification | GroupInviteNotification | SharedCollectionNotification): notification is GroupInviteNotification {
    return notification.type === 'group';
}
export function isSharedCollectionNotification(notification: SharingNotification): notification is SharedCollectionNotification {
    return notification.type === 'collection';
}
export const isNotificationDisabled = ({ status, }: SharingNotification): boolean => [
    NotificationStatus.AcceptFailed,
    NotificationStatus.AcceptInProgress,
    NotificationStatus.AcceptJustSucceeded,
    NotificationStatus.Unshared,
].includes(status);
export const isNotificationVisible = ({ status }: SharingNotification) => status !== NotificationStatus.Refused;
export const isNotificationAcceptable = ({ status, }: SharingNotification): boolean => [
    NotificationStatus.AcceptInProgress,
    NotificationStatus.AcceptFailed,
    NotificationStatus.ConfirmRefusal,
    NotificationStatus.New,
    NotificationStatus.Pending,
    NotificationStatus.RefusalInProgress,
    NotificationStatus.RefusalFailed,
].includes(status);
export const isNotificationPending = ({ status, }: SharingNotification): boolean => status === NotificationStatus.New || status === NotificationStatus.Pending;
export const isNotificationNew = ({ status }: SharingNotification): boolean => status === NotificationStatus.New;
export const isNotificationPendingAccepted = ({ status, }: SharingNotification): boolean => status === NotificationStatus.AcceptInProgress ||
    status === NotificationStatus.AcceptJustSucceeded;
export const isNotificationAccepted = ({ status, }: SharingNotification): boolean => status === NotificationStatus.Accepted;
