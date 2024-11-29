export enum CantDeleteReason {
  LastAdmin = "LastAdmin",
  GroupSharing = "GroupSharing",
  CollectionSharing = "CollectionSharing",
  Generic = "Generic",
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
  collectionSharingTitle?: string;
  collectionSharingSubtitle?: string;
  genericErrorTitle?: string;
  genericErrorSubtitle?: string;
}
