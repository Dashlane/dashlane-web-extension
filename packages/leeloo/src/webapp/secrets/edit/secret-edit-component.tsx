import { useState } from "react";
import {
  AddSecureFileResult,
  EmbeddedAttachment,
  GroupRecipient,
  UserRecipient,
} from "@dashlane/communication";
import { DataStatus, useFeatureFlip } from "@dashlane/framework-react";
import { Secret, VaultItemType } from "@dashlane/vault-contracts";
import useTranslate from "../../../libs/i18n/useTranslate";
import { SecretsTabs } from "./types";
import { GrapheneShareActions } from "../../personal-data/edit/sharing/actions";
import { ConfirmDeleteVaultItemDialog } from "../../personal-data/edit/confirm-delete-vault-item-dialog";
import { EditPanel } from "../../panel";
import { getSecretSharing } from "../../sharing-invite/helpers";
import { SecretForm } from "../form/secret-form";
import { Header } from "../form/header/header";
import { useFrozenState } from "../../../libs/frozen-state/frozen-state-dialog-context";
import { useSharedAccessData } from "../../shared-access/hooks/use-shared-access-data";
import { useUpdateSecret } from "../hooks/use-update-secret";
import { SaveSecretContentValues } from "../../personal-data/types";
import { useRouterGlobalSettingsContext } from "../../../libs/router";
import { SecureAttachmentUploadButton } from "../../secure-files/components/secure-attachment-upload-button";
import { carbonConnector } from "../../../libs/carbon/connector";
import { createEmbeddedAttachmentFromSecureFile } from "../../secure-files/helpers/embedded-attachment";
import { useNavigateBack } from "../../vault-items-panel-routes/common";
const { CONTENT, SHARED_ACCESS, DOCUMENT_STORAGE } = SecretsTabs;
const I18N_KEYS = {
  TAB_TITLE_DETAILS_EDITION: "webapp_secrets_edition_field_tab_title_details",
  TAB_TITLE_SHARED_ACCESS_EDITION:
    "webapp_secure_notes_edition_field_tab_title_shared_access",
  TAB_TITLE_ATTACHMENTS_EDITION:
    "webapp_secrets_edition_field_tab_title_attachments",
  DELETE_CONFIRM: "webapp_secrets_edition_delete_confirm",
  DELETE_DISMISS: "webapp_credential_edition_delete_dismiss",
  DELETE_SUBTITLE: "webapp_credential_edition_confirm_delete_subtitle",
  DELETE_TITLE: "webapp_secrets_edition_delete_title",
  LAST_ADMIN_ACTION: "webapp_credential_edition_change_permissions",
  LAST_ADMIN_TITLE: "webapp_credential_edition_last_admin_title",
  LAST_ADMIN_SUBTITLE: "webapp_credential_edition_last_admin_subtitle",
  GROUP_SHARING_TITLE: "webapp_secrets_edition_group_sharing_title",
  GROUP_SHARING_SUBTITLE: "webapp_credential_edition_group_sharing_subtitle",
  GENERIC_ERROR_TITLE: "webapp_account_recovery_generic_error_title",
  GENERIC_ERROR_SUBTITLE: "webapp_account_recovery_generic_error_subtitle",
  GENERIC_COPY: "webapp_credential_edition_field_generic_action_copy",
};
export interface Props {
  location?: {
    pathname: string;
    state: {
      entity: UserRecipient | GroupRecipient;
    };
  };
  secret: Secret;
  isShared: boolean;
  isAdmin: boolean;
  isSharedViaUserGroup: boolean;
  isLastAdmin: boolean;
}
export const SecretEditPanelComponent = ({
  secret,
  isShared,
  isAdmin,
  isSharedViaUserGroup,
  isLastAdmin,
}: Props) => {
  const { translate } = useTranslate();
  const { routes } = useRouterGlobalSettingsContext();
  const { navigateBack } = useNavigateBack();
  const [activeTab, setActiveTab] = useState(CONTENT);
  const [hasDataBeenModified, setHasDataBeenModified] = useState(false);
  const [displayConfirmDeleteDialog, setDisplayConfirmDeleteDialog] =
    useState(false);
  const [childComponentModalOpen, setChildComponentModalOpen] = useState(false);
  const [isUpdatePending, setIsUpdatePending] = useState(false);
  const [isAttachmentUploading, setIsAttachmentUploading] = useState(false);
  const [secretValues, setSecretValues] = useState<SaveSecretContentValues>({
    id: secret.id,
    limitedPermissions: isShared && !isAdmin,
    title: secret.title,
    content: secret.content,
    spaceId: secret.spaceId ?? "",
    secured: secret.isSecured ?? false,
    attachments: secret.attachments ?? [],
  });
  const { data: sharedAccessData, status } = useSharedAccessData(secret.id);
  const updateSecret = useUpdateSecret();
  const { shouldShowFrozenStateDialog: isUserFrozen } = useFrozenState();
  const isAttachmentsEnabled = useFeatureFlip("ace_secrets_vault_attachment");
  const displayStorageTab =
    isAttachmentsEnabled ||
    (!!secret.attachments && secret.attachments.length > 0);
  const getRecipientsCount = (): number => {
    if (!isShared) {
      return 0;
    }
    return status === DataStatus.Success ? sharedAccessData?.count ?? 0 : 0;
  };
  const recipientsCount = getRecipientsCount();
  const closeEditPanel = (): void => {
    navigateBack(routes.userSecrets);
  };
  if (!secret) {
    closeEditPanel();
    return null;
  }
  const handleSubmit = async (
    shouldClosePanel = true,
    attachments?: EmbeddedAttachment[]
  ): Promise<void> => {
    setIsUpdatePending(true);
    await updateSecret(
      {
        title: secretValues.title,
        content: secretValues.content,
        spaceId: secretValues.spaceId ?? "",
        isSecured: secretValues.secured,
        attachments,
      },
      secret.id
    );
    setIsUpdatePending(false);
    if (shouldClosePanel) {
      closeEditPanel();
    }
  };
  const handleFileInfoDetached = (secureFileInfoId: string) => {
    const nextAttachments = secretValues.attachments.filter(
      (a) => a.id !== secureFileInfoId
    );
    setSecretValues((prev) => ({
      ...prev,
      attachments: nextAttachments,
    }));
    handleSubmit(false, nextAttachments);
  };
  const handleOnFileUploadStarted = () => {
    setIsAttachmentUploading(true);
  };
  const handleOnSecureFileUploadDone = async (result: AddSecureFileResult) => {
    setIsAttachmentUploading(false);
    if (result.success) {
      await carbonConnector.commitSecureFile({
        secureFileInfo: result.secureFileInfo,
      });
      const nextAttachments = [
        ...secretValues.attachments,
        createEmbeddedAttachmentFromSecureFile(result.secureFileInfo),
      ];
      setSecretValues((prev) => ({
        ...prev,
        attachments: nextAttachments,
      }));
      handleSubmit(false, nextAttachments);
    }
  };
  const handleChange = (
    key: keyof Omit<SaveSecretContentValues, "id" | "limitedPermissions">,
    value: string
  ) => {
    if (key === "spaceId" && value === secretValues.spaceId) {
      return;
    }
    const updatedValues = {
      ...secretValues,
      [key]: value,
    };
    const hasUpdatedValues =
      secret.title !== updatedValues.title ||
      secret.content !== updatedValues.content ||
      secret.spaceId !== updatedValues.spaceId ||
      secret.isSecured !== updatedValues.secured;
    if (hasUpdatedValues !== hasDataBeenModified) {
      setHasDataBeenModified(hasUpdatedValues);
    }
    setSecretValues(updatedValues);
  };
  const goToSharingAccess = (): void => {
    setActiveTab(SecretsTabs.SHARED_ACCESS);
  };
  const deleteTranslations = {
    confirmDeleteConfirm: translate(I18N_KEYS.DELETE_CONFIRM),
    confirmDeleteDismiss: translate(I18N_KEYS.DELETE_DISMISS),
    confirmDeleteSubtitle: translate(I18N_KEYS.DELETE_SUBTITLE),
    confirmDeleteTitle: translate(I18N_KEYS.DELETE_TITLE),
    lastAdminActionLabel: translate(I18N_KEYS.LAST_ADMIN_ACTION),
    lastAdminTitle: translate(I18N_KEYS.LAST_ADMIN_TITLE),
    lastAdminSubtitle: translate(I18N_KEYS.LAST_ADMIN_SUBTITLE),
    groupSharingTitle: translate(I18N_KEYS.GROUP_SHARING_TITLE),
    groupSharingSubtitle: translate(I18N_KEYS.GROUP_SHARING_SUBTITLE),
    genericErrorTitle: I18N_KEYS.GENERIC_ERROR_TITLE,
    genericErrorSubtitle: I18N_KEYS.GENERIC_ERROR_SUBTITLE,
  };
  if (isUserFrozen === null) {
    return null;
  }
  const tabs =
    isShared || displayStorageTab
      ? [
          {
            id: "tab-secret-detail",
            contentId: "content-secret-detail",
            title: translate(I18N_KEYS.TAB_TITLE_DETAILS_EDITION),
            onSelect: () => setActiveTab(CONTENT),
          },
        ]
      : [];
  if (isShared) {
    tabs.push({
      id: "tab-secret-shared-access",
      contentId: "content-secret-shared-access",
      title: `${translate(
        I18N_KEYS.TAB_TITLE_SHARED_ACCESS_EDITION
      )} (${recipientsCount})`,
      onSelect: () => setActiveTab(SHARED_ACCESS),
    });
  } else if (displayStorageTab) {
    tabs.push({
      id: "tab-secret-attachments",
      contentId: "content-secret-attachments",
      title: translate(I18N_KEYS.TAB_TITLE_ATTACHMENTS_EDITION),
      onSelect: () => setActiveTab(DOCUMENT_STORAGE),
    });
  }
  const isShareable = (item: Secret): boolean =>
    item && (!isShared || isAdmin) && !item.attachments?.length;
  const getSecondaryActions = () => {
    switch (activeTab) {
      case CONTENT:
        return [
          isShareable(secret) ? (
            <GrapheneShareActions
              key="shareaction"
              id={secret.id}
              isShared={isShared}
              isAdmin={isAdmin}
              isDiscontinuedUser={isUserFrozen}
              getSharing={getSecretSharing}
            />
          ) : null,
        ];
      case DOCUMENT_STORAGE:
        return [
          <SecureAttachmentUploadButton
            isQuotaReached={false}
            onFileUploadStarted={handleOnFileUploadStarted}
            onFileUploadDone={handleOnSecureFileUploadDone}
            isShared={isShared}
            itemId={secret.id}
            key="uploadAction"
            dataType="KWSecret"
            disabled={!!isUserFrozen}
          />,
        ];
      default:
        return [];
    }
  };
  return (
    <EditPanel
      isUsingNewDesign
      isViewingExistingItem={true}
      itemHasBeenEdited={hasDataBeenModified}
      onSubmit={() => handleSubmit()}
      submitPending={isUpdatePending}
      secondaryActions={getSecondaryActions()}
      onNavigateOut={closeEditPanel}
      onClickDelete={() => setDisplayConfirmDeleteDialog(true)}
      ignoreCloseOnEscape={
        displayConfirmDeleteDialog || childComponentModalOpen
      }
      isSomeDialogOpen={displayConfirmDeleteDialog}
      formId="edit_secret_panel"
      header={<Header title={secretValues.title} tabs={tabs} />}
    >
      <SecretForm
        activeTab={activeTab}
        isAdmin={isAdmin}
        isSecured={secret.isSecured}
        isAttachmentUploading={isAttachmentUploading}
        isNewItem={false}
        secretValues={secretValues}
        handleChange={handleChange}
        handleFileInfoDetached={handleFileInfoDetached}
        onModalDisplayStateChange={setChildComponentModalOpen}
      />

      <ConfirmDeleteVaultItemDialog
        isVisible={displayConfirmDeleteDialog}
        itemId={secret.id}
        closeConfirmDeleteDialog={() => setDisplayConfirmDeleteDialog(false)}
        goToSharingAccess={goToSharingAccess}
        onDeletionSuccess={closeEditPanel}
        translations={deleteTranslations}
        vaultItemType={VaultItemType.Secret}
        isShared={isShared}
        isLastAdmin={isLastAdmin}
        isSharedViaUserGroup={isSharedViaUserGroup}
      />
    </EditPanel>
  );
};
