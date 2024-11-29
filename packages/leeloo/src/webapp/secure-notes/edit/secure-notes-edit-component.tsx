import { useRef, useState } from 'react';
import { AddSecureFileResult, NoteType } from '@dashlane/communication';
import { DataStatus, useModuleCommands } from '@dashlane/framework-react';
import { ItemType, Origin, PageView } from '@dashlane/hermes';
import { AlertSeverity } from '@dashlane/ui-components';
import { isFailure } from '@dashlane/framework-types';
import { SecureNote, vaultItemsCrudApi, VaultItemType, } from '@dashlane/vault-contracts';
import { carbonConnector } from '../../../libs/carbon/connector';
import useTranslate from '../../../libs/i18n/useTranslate';
import { logPageView } from '../../../libs/logs/logEvent';
import { useFrozenState } from '../../../libs/frozen-state/frozen-state-dialog-context';
import { useAlert } from '../../../libs/alert-notifications/use-alert';
import { useLocation, useRouterGlobalSettingsContext, } from '../../../libs/router';
import { EditPanel } from '../../panel';
import { ConfirmDeleteVaultItemDialog } from '../../personal-data/edit/confirm-delete-vault-item-dialog';
import { SecureNoteTabs } from './types';
import { Header } from '../form/header/header';
import { SecureNotesForm } from '../form/secure-notes-form';
import { getNoteSharing } from '../../sharing-invite/helpers';
import { withProtectedItemsUnlocker } from '../../unlock-items';
import { SecureAttachmentUploadButton } from '../../secure-files/components/secure-attachment-upload-button';
import { createEmbeddedAttachmentFromSecureFile } from '../../secure-files/helpers/embedded-attachment';
import { clearSecureFileState } from '../../secure-files/services/clear-secure-file-state';
import { useSharedAccessData } from '../../shared-access/hooks/use-shared-access-data';
import { SharingButton } from '../../sharing-invite/sharing-button';
import { FieldCollection } from '../../credentials/form/collections-field/collections-field-context';
import { useAddNoteToCollections } from '../hooks/use-add-note-to-collection';
import { useCollectionsContext } from '../../collections/collections-context';
import { useSecureFileDelete } from '../../secure-files/hooks';
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
    COLLECTION_SHARING_TITLE: 'webapp_credential_edition_collection_sharing_title',
    COLLECTION_SHARING_SUBTITLE: 'webapp_credential_edition_collection_sharing_subtitle',
};
interface SecureNoteOptions {
    category: string;
    type: NoteType;
    spaceId: string;
    secured: boolean;
}
export interface Props {
    note: SecureNote;
    isShared: boolean;
    isAdmin: boolean;
    isSharedViaUserGroup: boolean;
    isLastAdmin: boolean;
    onClose: () => void;
}
const getSharing = (id: string) => getNoteSharing(id);
const NoteEditComponent = ({ note, isShared, isAdmin, isSharedViaUserGroup, isLastAdmin, onClose, }: Props) => {
    const { translate } = useTranslate();
    const { routes } = useRouterGlobalSettingsContext();
    const location = useLocation();
    const isClosing = useRef(false);
    const { updateVaultItem } = useModuleCommands(vaultItemsCrudApi);
    const { showAlert } = useAlert();
    const { shouldShowFrozenStateDialog: isDisabled } = useFrozenState();
    const { addNoteToCollections } = useAddNoteToCollections();
    const { allCollections } = useCollectionsContext();
    const [activeTab, setActiveTab] = useState(CONTENT);
    const [hasDataBeenModified, setHasDataBeenModified] = useState(false);
    const [secureNoteOptions] = useState<SecureNoteOptions | null>(null);
    const [displayConfirmDeleteDialog, setDisplayConfirmDeleteDialog] = useState(false);
    const [childComponentModalOpen, setChildComponentModalOpen] = useState(false);
    const [isUpdatePending, setIsUpdatePending] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isSecured, setIsSecured] = useState(note.isSecured);
    const [content, setContent] = useState(note.content);
    const [title, setTitle] = useState(note.title);
    const [color, setColor] = useState(note.color);
    const [spaceId, setSpaceId] = useState(note.spaceId);
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
    const [collectionsToUpdate, setCollectionsToUpdate] = useState<FieldCollection[]>([]);
    const [hasDialogsOpenedByChildren, setHasDialogsOpenedByChildren] = useState(false);
    const { data: sharedAccessData, status } = useSharedAccessData(note.id);
    const showGenericError = () => showAlert(translate('_common_generic_error'), AlertSeverity.ERROR);
    const closeEditPanel = (): void => {
        if (isClosing.current) {
            return;
        }
        isClosing.current = true;
        clearSecureFileState();
        if (location.pathname.includes(routes.userSecureNotes)) {
            logPageView(PageView.ItemSecureNoteList);
        }
        onClose();
    };
    const handleSubmit = async (shouldClosePanel = true): Promise<void> => {
        setIsUpdatePending(true);
        const options = secureNoteOptions ?? {
            spaceId: spaceId,
            type: color,
            category: note.categoryId,
            secured: isSecured,
        };
        try {
            const result = await updateVaultItem({
                vaultItemType: VaultItemType.SecureNote,
                content: {
                    content,
                    title,
                    id: note.id,
                    attachments: [...(note.attachments ?? [])],
                    ...options,
                },
                id: note.id,
            });
            addNoteToCollections(note.id, collectionsToUpdate);
            if (isFailure(result)) {
                showGenericError();
            }
        }
        catch (error) {
            showGenericError();
        }
        setIsUpdatePending(false);
        if (shouldClosePanel) {
            closeEditPanel();
        }
        else {
            setHasDataBeenModified(false);
        }
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
            note.attachments?.push(createEmbeddedAttachmentFromSecureFile(result.secureFileInfo));
            handleSubmit(false);
        }
    };
    const handleFileInfoDetached = (secureFileInfoId: string) => {
        note.attachments = note.attachments?.filter((a) => a.id !== secureFileInfoId);
        handleSubmit(false);
    };
    const getRecipientsCount = (): number => {
        if (!isShared) {
            return 0;
        }
        return status === DataStatus.Success ? sharedAccessData?.count ?? 0 : 0;
    };
    const goToSharingAccess = (): void => {
        setActiveTab(SecureNoteTabs.SHARED_ACCESS);
    };
    const onModifyData = () => setHasDataBeenModified(true);
    const deleteSecureFile = useSecureFileDelete(ItemType.SecureNote, showGenericError);
    const onDeletionSuccess = async () => {
        note.attachments?.forEach(async (attachment) => {
            const { id } = attachment;
            deleteSecureFile(id);
        });
        closeEditPanel();
    };
    const initialCollections = allCollections.filter((collection) => collection.vaultItems.some((item) => item.id === note.id));
    const hasCollections = initialCollections.length || collectionsToUpdate.length;
    const hasAttachment = !!note.attachments && note.attachments.length > 0;
    const displaySharedAccess = isShared;
    const displayStorageTab = !hasCollections;
    const visibleTabs = [CONTENT];
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
        collectionSharingTitle: translate(I18N_KEYS.COLLECTION_SHARING_TITLE),
        collectionSharingSubtitle: translate(I18N_KEYS.COLLECTION_SHARING_SUBTITLE),
        genericErrorTitle: I18N_KEYS.GENERIC_ERROR_TITLE,
        genericErrorSubtitle: I18N_KEYS.GENERIC_ERROR_SUBTITLE,
    };
    const isShareable = (item: SecureNote): boolean => item && (!isShared || isAdmin) && !item.attachments?.length;
    const getSecondaryActions = () => {
        switch (activeTab) {
            case CONTENT:
                return [
                    isShareable(note) ? (<SharingButton key="shareaction" tooltipPlacement="top-start" sharing={getSharing(note.id)} text={translate('webapp_sharing_invite_share')} origin={Origin.ItemDetailView}/>) : null,
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
        attachments: note.attachments ?? [],
        category: note.categoryId ? note.categoryId : 'noCategory',
        content: note.content,
        id: note.id,
        limitedPermissions: isShared && !isAdmin,
        secured: note.isSecured,
        spaceId: note.spaceId,
        title: note.title,
        type: note.color,
    };
    const withOnModifyData = <T>(callback: (newValue: T) => void) => {
        return (newValue: T) => {
            onModifyData();
            callback(newValue);
        };
    };
    const handleSetSpaceId = withOnModifyData(setSpaceId);
    const handleSetColor = withOnModifyData(setColor);
    const handleSetTitle = withOnModifyData(setTitle);
    const handleSetContent = withOnModifyData(setContent);
    const handleSetIsSecured = withOnModifyData(setIsSecured);
    const recipientsCount = getRecipientsCount();
    const isItemInCollection = initialCollections.filter((collection) => collection.isShared).length > 0;
    return (<EditPanel isViewingExistingItem={true} submitDisabled={isSubmitDisabled} itemHasBeenEdited={hasDataBeenModified} onSubmit={() => {
            handleSubmit();
        }} isUsingNewDesign submitPending={isUpdatePending} secondaryActions={getSecondaryActions()} onNavigateOut={closeEditPanel} onClickDelete={() => setDisplayConfirmDeleteDialog(true)} ignoreCloseOnEscape={displayConfirmDeleteDialog || childComponentModalOpen} isSomeDialogOpen={displayConfirmDeleteDialog || hasDialogsOpenedByChildren} formId="edit_securenote_panel" header={<Header backgroundColor={data.type} displayDocumentStorage={visibleTabs.includes(DOCUMENT_STORAGE)} displaySharedAccess={visibleTabs.includes(SHARED_ACCESS)} displayMoreOptions={visibleTabs.includes(MORE_OPTIONS)} isSecured={isSecured} recipientsCount={recipientsCount} attachmentsCount={note?.attachments?.length ?? 0} setActiveTab={setActiveTab} disabled={isShared && !isAdmin} title={title} setTitle={handleSetTitle}/>}>
      <SecureNotesForm activeTab={activeTab} data={data} content={content ?? ''} title={title} color={color} spaceId={spaceId} isDisabled={!!isDisabled} isSecured={isSecured} onSpaceIdChange={handleSetSpaceId} onColorChange={handleSetColor} onTitleChange={handleSetTitle} onContentChange={handleSetContent} onIsSecuredChange={handleSetIsSecured} onIsSubmitDisabled={setIsSubmitDisabled} handleFileInfoDetached={handleFileInfoDetached} hasAttachment={hasAttachment} isAdmin={isAdmin} isShared={isShared} isUploading={isUploading} onModifyData={onModifyData} onModalDisplayStateChange={setChildComponentModalOpen} onCollectionsToUpdate={setCollectionsToUpdate} setHasDialogsOpenedByChildren={setHasDialogsOpenedByChildren}/>

      <ConfirmDeleteVaultItemDialog isVisible={displayConfirmDeleteDialog} itemId={note.id} closeConfirmDeleteDialog={() => setDisplayConfirmDeleteDialog(false)} goToSharingAccess={goToSharingAccess} onDeletionSuccess={onDeletionSuccess} isLastAdmin={isLastAdmin} isShared={isShared} isSharedViaUserGroup={isSharedViaUserGroup} isItemInCollection={isItemInCollection} translations={deleteTranslations} vaultItemType={VaultItemType.SecureNote}/>
    </EditPanel>);
};
export const NoteEditPanelComponent = withProtectedItemsUnlocker(NoteEditComponent);
