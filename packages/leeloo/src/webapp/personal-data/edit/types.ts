export enum CantDeleteReason {
    LastAdmin = 'LastAdmin',
    GroupSharing = 'GroupSharing',
    Generic = 'Generic'
}
export interface DeleteTranslations {
    confirmDeleteConfirm: string;
    confirmDeleteDismiss: string;
    confirmDeleteSubtitle: string;
    confirmDeleteTitle: string;
    deleteSuccessToast?: string;
    lastAdminActionLabel?: string;
    lastAdminTitle?: string;
    lastAdminSubtitle?: string;
    groupSharingTitle?: string;
    groupSharingSubtitle?: string;
    genericErrorTitle?: string;
    genericErrorSubtitle?: string;
}
