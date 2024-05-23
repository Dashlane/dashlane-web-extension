import React, { useState } from 'react';
import { AddSecureFileResult, GroupRecipient, ListResults, NoteCategoryDetailView, NoteDetailView, UserRecipient, } from '@dashlane/communication';
import { PageView } from '@dashlane/hermes';
import { VaultItemType } from '@dashlane/vault-contracts';
import { DataStatus } from '@dashlane/framework-react';
import { Lee } from 'lee';
import { carbonConnector } from 'libs/carbon/connector';
import { logPageView } from 'libs/logs/logEvent';
import useTranslate from 'libs/i18n/useTranslate';
import { redirect } from 'libs/router';
import { useRouterGlobalSettingsContext } from 'libs/router/RouterGlobalSettingsProvider';
import { useTrialDiscontinuedDialogContext } from 'libs/trial/trialDiscontinuationDialogContext';
import { redirectBackToSharingCenterPanel } from 'webapp/sharing-center/utils';
import { SecureNoteTabs } from 'webapp/secure-notes/edit/types';
import { ShareActions } from 'webapp/personal-data/edit/sharing/actions';
import { ConfirmDeleteVaultItemDialog } from 'webapp/personal-data/edit/confirm-delete-vault-item-dialog';
import { EditPanel } from 'webapp/panel';
import { getNoteSharing } from 'webapp/sharing-invite/helpers';
import { SecureNotesForm } from 'webapp/secure-notes/form/secure-notes-form';
import { withProtectedItemsUnlocker } from 'webapp/unlock-items';
import { createEmbeddedAttachmentFromSecureFile } from 'webapp/secure-files/helpers/embedded-attachment';
import { SecureAttachmentUploadButton } from 'webapp/secure-files/components/secure-attachment-upload-button';
import { clearSecureFileState } from 'webapp/secure-files/services/clear-secure-file-state';
import { useIsSecureNoteAttachmentEnabled } from 'webapp/secure-files/hooks';
import { Header } from 'webapp/secure-notes/form/header';
import { useSharedAccessData } from 'webapp/shared-access/hooks/use-shared-access-data';
import { SecureNoteOptions } from '../form/secure-notes-options';
const { CONTENT, DOCUMENT_STORAGE, MORE_OPTIONS, SHARED_ACCESS } = SecureNoteTabs;
const I18N_KEYS = {
    DELETE_CONFIRM: 'webapp_secure_notes_edition_delete_confirm',
    DELETE_DISMISS: 'webapp_credential_edition_delete_dismiss',
    DELETE_SUBTITLE: 'webapp_credential_edition_confirm_delete_subtitle',
    DELETE_TITLE: 'webapp_secure_notes_edition_delete_title',
    LAST_ADMIN_ACTION: 'webapp_credential_edition_change_permissions',
    LAST_ADMIN_TITLE: 'webapp_credential_edition_last_admin_title',
    LAST_ADMIN_SUBTITLE: 'webapp_credential_edition_last_admin_subtitle',
    GROUP_SHARING_TITLE: 'webapp_secure_notes_edition_group_sharing_title',
    GROUP_SHARING_SUBTITLE: 'webapp_credential_edition_group_sharing_subtitle',
    GENERIC_ERROR_TITLE: 'webapp_account_recovery_generic_error_title',
    GENERIC_ERROR_SUBTITLE: 'webapp_account_recovery_generic_error_subtitle',
};
export interface Props {
    lee: Lee;
    location?: {
        pathname: string;
        state: {
            entity: UserRecipient | GroupRecipient;
        };
    };
    match: {
        params?: {
            uuid?: string;
        };
    };
    note: NoteDetailView;
    noteCategories: ListResults<NoteCategoryDetailView>;
    isShared: boolean;
    isAdmin: boolean;
    isSharedViaUserGroup: boolean;
    isLastAdmin: boolean;
}
const getSharing = (id: string) => getNoteSharing(id);
const NoteEditComponent = ({ lee, location, note, noteCategories, isShared, isAdmin, isSharedViaUserGroup, isLastAdmin, }: Props) => {
    const { translate } = useTranslate();
    const { routes } = useRouterGlobalSettingsContext();
    const isSecureNoteAttachmentEnabled = useIsSecureNoteAttachmentEnabled();
    const { shouldShowTrialDiscontinuedDialog: isDisabled } = useTrialDiscontinuedDialogContext();
    const [activeTab, setActiveTab] = useState(CONTENT);
    const [hasDataBeenModified, setHasDataBeenModified] = useState(false);
    const [secureNoteOptions] = useState<SecureNoteOptions | null>(null);
    const [displayConfirmDeleteDialog, setDisplayConfirmDeleteDialog] = useState(false);
    const [childComponentModalOpen, setChildComponentModalOpen] = useState(false);
    const [isUpdatePending, setIsUpdatePending] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [content, setContent] = useState(() => note.content);
    const [title, setTitle] = useState(() => note.title);
    const { data: sharedAccessData, status } = useSharedAccessData(note.id);
    const closeEditPanel = (): void => {
        clearSecureFileState();
        if (location?.state?.entity) {
            redirectBackToSharingCenterPanel({ routes, location });
            return;
        }
        logPageView(PageView.ItemSecureNoteList);
        redirect(routes.userSecureNotes);
    };
    const handleSubmit = async (shouldClosePanel = true): Promise<void> => {
        setIsUpdatePending(true);
        const options = secureNoteOptions ?? { spaceId: note.spaceId ?? '' };
        await carbonConnector.updateSecureNote({
            content: content,
            title: title,
            id: note.id,
            attachments: [...note.attachments],
            ...options,
        });
        setIsUpdatePending(false);
        if (shouldClosePanel) {
            closeEditPanel();
        }
        else {
            setIsEditing(false);
            setHasDataBeenModified(false);
        }
    };
    const saveSecureNoteOptions = (options: SecureNoteOptions) => {
        const { category, spaceId, type, secured } = options;
        carbonConnector.updateSecureNote({
            id: note.id,
            spaceId: spaceId ?? '',
            type,
            category,
            secured,
        });
    };
    const handleOnFileUploadStarted = () => {
        setIsUploading(true);
    };
    const handleOnSecureFileUploadDone = async (result: AddSecureFileResult) => {
        setIsUploading(false);
        if (result.success) {
            await carbonConnector.commitSecureFile({
                secureFileInfo: result.secureFileInfo,
            });
            note.attachments.push(createEmbeddedAttachmentFromSecureFile(result.secureFileInfo));
            handleSubmit(false);
        }
    };
    const handleFileInfoDetached = (secureFileInfoId: string) => {
        note.attachments = note.attachments.filter((a) => a.id !== secureFileInfoId);
        handleSubmit(false);
    };
    const getRecipientsCount = (): number => {
        if (!isShared) {
            return 0;
        }
        return status === DataStatus.Success ? sharedAccessData.count : 0;
    };
    const goToSharingAccess = (): void => {
        setActiveTab(SecureNoteTabs.SHARED_ACCESS);
    };
    const onModifyData = () => setHasDataBeenModified(true);
    const onDeletionSuccess = async () => {
        note.attachments.forEach(async (attachment) => {
            const { id } = attachment;
            await carbonConnector.deleteSecureFile({ id });
        });
        closeEditPanel();
    };
    const displaySharedAccess = isShared;
    const displayStorageTab = isSecureNoteAttachmentEnabled || note.attachments.length > 0;
    const visibleTabs = [CONTENT, MORE_OPTIONS];
    if (displaySharedAccess) {
        visibleTabs.push(SHARED_ACCESS);
    }
    else if (displayStorageTab) {
        visibleTabs.push(DOCUMENT_STORAGE);
    }
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
    const getSecondaryActions = () => {
        switch (activeTab) {
            case CONTENT:
                return [
                    <ShareActions item={note} getSharing={getSharing} key="shareaction"/>,
                ];
            case DOCUMENT_STORAGE:
                return [
                    <SecureAttachmentUploadButton isQuotaReached={false} onFileUploadStarted={handleOnFileUploadStarted} onFileUploadDone={handleOnSecureFileUploadDone} isShared={isShared} itemId={note.id} key="uploadAction" dataType="KWSecureNote" disabled={!!isDisabled}/>,
                ];
            default:
                return [];
        }
    };
    const data = {
        attachments: note.attachments,
        category: note.category ? note.category.id : 'noCategory',
        content: note.content,
        id: note.id,
        limitedPermissions: isShared && !isAdmin,
        secured: note.secured,
        spaceId: note.spaceId,
        title: note.title,
        type: note.color,
    };
    const recipientsCount = getRecipientsCount();
    return (<EditPanel isViewingExistingItem={true} itemHasBeenEdited={hasDataBeenModified} onSubmit={() => {
            handleSubmit();
        }} submitPending={isUpdatePending} secondaryActions={getSecondaryActions()} onNavigateOut={closeEditPanel} onClickDelete={() => setDisplayConfirmDeleteDialog(true)} ignoreCloseOnEscape={displayConfirmDeleteDialog || childComponentModalOpen} isSomeDialogOpen={displayConfirmDeleteDialog} formId="edit_securenote_panel" header={<Header activeTab={activeTab} backgroundColor={data.type} displayDocumentStorage={visibleTabs.includes(DOCUMENT_STORAGE)} displaySharedAccess={visibleTabs.includes(SHARED_ACCESS)} recipientsCount={recipientsCount} setActiveTab={setActiveTab} disabled={isShared && !isAdmin} title={title} setTitle={(title) => {
                onModifyData();
                setTitle(title);
            }}/>}>
      <SecureNotesForm activeTab={activeTab} data={data} content={content} setContent={setContent} handleFileInfoDetached={handleFileInfoDetached} hasAttachment={note.attachments.length > 0} isAdmin={isAdmin} isSecureNoteAttachmentEnabled={isSecureNoteAttachmentEnabled} isShared={isShared} isUploading={isUploading} isEditing={isEditing} setIsEditing={setIsEditing} lee={lee} noteCategories={noteCategories.items} onModifyData={onModifyData} onModalDisplayStateChange={setChildComponentModalOpen} saveSecureNoteOptions={saveSecureNoteOptions}/>

      <ConfirmDeleteVaultItemDialog isVisible={displayConfirmDeleteDialog} itemId={note.id} closeConfirmDeleteDialog={() => setDisplayConfirmDeleteDialog(false)} goToSharingAccess={goToSharingAccess} onDeletionSuccess={onDeletionSuccess} isLastAdmin={isLastAdmin} isShared={isShared} isSharedViaUserGroup={isSharedViaUserGroup} translations={deleteTranslations} vaultItemType={VaultItemType.SecureNote}/>
    </EditPanel>);
};
export const NoteEditPanelComponent = withProtectedItemsUnlocker(NoteEditComponent);
