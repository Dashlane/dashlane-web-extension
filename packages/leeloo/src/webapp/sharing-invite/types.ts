import { ShareItemResponse } from '@dashlane/communication';
import { Permission } from '@dashlane/sharing-contracts';
export enum SharingInviteStep {
    Elements,
    Recipients,
    Permission,
    Loading,
    Success,
    Failure,
    UnlockProtectedItems,
    CollectionRecipients,
    CollectionItemPermissions,
    UnlockProtectedCollection
}
export interface Sharing {
    permission: Permission;
    selectedCredentials: string[];
    selectedGroups: string[];
    selectedNotes: string[];
    selectedSecrets: string[];
    selectedUsers: string[];
    selectedPrivateCollections: string[];
    selectedSharedCollections: string[];
    step: SharingInviteStep;
    tab: ItemsTabs;
}
export interface State {
    sharing?: Sharing;
    displaySharingLimitReached: boolean;
}
export enum ItemsTabs {
    Passwords,
    SecureNotes,
    Secrets
}
export interface SharingInviteUser {
    id: string;
    itemCount: string;
}
export interface DetailedError {
    result: ShareItemResponse;
    itemId: string;
}
