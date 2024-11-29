import { useEffect, useState } from 'react';
import { ItemType, PageView } from '@dashlane/hermes';
import { AddSecureFileResult, NoteType, PremiumStatusSpace, SecureFileInfo, } from '@dashlane/communication';
import { DataStatus } from '@dashlane/carbon-api-consumers';
import { useModuleCommands } from '@dashlane/framework-react';
import { getSuccess, isSuccess } from '@dashlane/framework-types';
import { AlertSeverity } from '@dashlane/ui-components';
import { vaultItemsCrudApi, VaultItemType } from '@dashlane/vault-contracts';
import { logPageView } from '../../../libs/logs/logEvent';
import { redirect, useHistory } from '../../../libs/router';
import { carbonConnector } from '../../../libs/carbon/connector';
import { usePaywall } from '../../../libs/paywall/paywallContext';
import { usePremiumStatus } from '../../../libs/carbon/hooks/usePremiumStatus';
import { useFrozenState } from '../../../libs/frozen-state/frozen-state-dialog-context';
import { useRouterGlobalSettingsContext } from '../../../libs/router/RouterGlobalSettingsProvider';
import { SecureNotesForm } from '../form/secure-notes-form';
import { EditPanel } from '../../panel';
import { SecureNoteTabs } from '../edit/types';
import { createEmbeddedAttachmentFromSecureFile } from '../../secure-files/helpers/embedded-attachment';
import { SecureAttachmentUploadButton } from '../../secure-files/components/secure-attachment-upload-button';
import { clearSecureFileState } from '../../secure-files/services/clear-secure-file-state';
import { useSecureFileDelete } from '../../secure-files/hooks';
import { PaywalledCapability, PaywallName, shouldShowPaywall, } from '../../paywall';
import { Header } from '../form/header/header';
import { useTeamSpaceContext } from '../../../team/settings/components/TeamSpaceContext';
import { useAlert } from '../../../libs/alert-notifications/use-alert';
import useTranslate from '../../../libs/i18n/useTranslate';
import { useAddNoteToCollections } from '../hooks/use-add-note-to-collection';
import { FieldCollection } from '../../credentials/form/collections-field/collections-field-context';
const { CONTENT, DOCUMENT_STORAGE } = SecureNoteTabs;
export interface Props {
    activeSpaces: PremiumStatusSpace[];
}
export const NoteAddPanelComponent = ({ activeSpaces }: Props) => {
    const { routes } = useRouterGlobalSettingsContext();
    const premiumStatus = usePremiumStatus();
    const { openPaywall } = usePaywall();
    const history = useHistory();
    const { openDialog: openTrialDiscontinuedDialog, shouldShowFrozenStateDialog, } = useFrozenState();
    const [activeTab, setActiveTab] = useState(CONTENT);
    const [hasDataBeenModified, setHasDataBeenModified] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [temporaryAttachedFiles, setTemporaryAttachedFiles] = useState<SecureFileInfo[]>([]);
    const { currentSpaceId } = useTeamSpaceContext();
    const alertContext = useAlert();
    const { translate } = useTranslate();
    const { addNoteToCollections } = useAddNoteToCollections();
    const [isUploading, setIsUploading] = useState(false);
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [color, setColor] = useState('GRAY');
    const [spaceId, setSpaceId] = useState(activeSpaces?.length > 0 && !activeSpaces[0].info?.personalSpaceEnabled
        ? activeSpaces[0].teamId
        : currentSpaceId ?? '');
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
    const [isSecured, setIsSecured] = useState(false);
    const { createVaultItem } = useModuleCommands(vaultItemsCrudApi);
    const [collectionsToUpdate, setCollectionsToUpdate] = useState<FieldCollection[]>([]);
    const [hasDialogsOpenedByChildren, setHasDialogsOpenedByChildren] = useState(false);
    const data = {
        attachments: temporaryAttachedFiles.map(createEmbeddedAttachmentFromSecureFile),
        id: '',
        limitedPermissions: false,
        content,
        title,
        category: 'noCategory',
        type: 'GRAY' as NoteType,
        spaceId,
        secured: false,
    };
    useEffect(() => {
        logPageView(PageView.ItemSecureNoteCreate);
    }, []);
    useEffect(() => {
        if (shouldShowFrozenStateDialog) {
            openTrialDiscontinuedDialog();
        }
    }, [shouldShowFrozenStateDialog]);
    const displayGenericError = () => alertContext.showAlert(translate('_common_generic_error'), AlertSeverity.ERROR);
    const deleteSecureFile = useSecureFileDelete(ItemType.SecureNote, displayGenericError);
    if (premiumStatus.status !== DataStatus.Success || !premiumStatus?.data) {
        return null;
    }
    const shouldDisplayPaywall = shouldShowPaywall(PaywalledCapability.SecureNotes, premiumStatus.data?.capabilities);
    const showListView = () => {
        logPageView(PageView.ItemSecureNoteList);
        clearSecureFileState();
        redirect(routes.userSecureNotes);
    };
    const closeAndShowListView = (): void => {
        temporaryAttachedFiles.forEach(async (attachment) => {
            const { Id: id } = attachment;
            deleteSecureFile(id);
        });
        clearSecureFileState();
        setTemporaryAttachedFiles([]);
        showListView();
    };
    const saveNote = async () => {
        const noteOptions = {
            spaceId: spaceId ?? '',
            type: color,
            category: 'noCategory',
            secured: isSecured,
        };
        try {
            const createResult = await createVaultItem({
                vaultItemType: VaultItemType.SecureNote,
                content: {
                    ...noteOptions,
                    content: content,
                    title: title,
                    attachments: data.attachments,
                },
            });
            if (!isSuccess(createResult)) {
                displayGenericError();
                return;
            }
            const createdNoteId = getSuccess(createResult).id;
            await addNoteToCollections(createdNoteId, collectionsToUpdate);
        }
        catch (error) {
            displayGenericError();
        }
        setTemporaryAttachedFiles([]);
    };
    const submit = async (): Promise<void> => {
        if (isSubmitting) {
            return;
        }
        setIsSubmitting(true);
        try {
            await saveNote();
        }
        catch {
            setIsSubmitting(false);
        }
        showListView();
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
            setTemporaryAttachedFiles([
                ...temporaryAttachedFiles,
                result.secureFileInfo,
            ]);
            setHasDataBeenModified(true);
        }
    };
    const handleDeleteSecureFileInfoAttached = (fileInfoId: string) => {
        setTemporaryAttachedFiles(temporaryAttachedFiles.filter((file) => {
            return file.Id !== fileInfoId;
        }));
    };
    const getSecondaryActions = () => {
        switch (activeTab) {
            case DOCUMENT_STORAGE:
                return [
                    <SecureAttachmentUploadButton isQuotaReached={false} isShared={false} onFileUploadStarted={handleOnFileUploadStarted} onFileUploadDone={handleOnSecureFileUploadDone} key="uploadAction" dataType="KWSecureNote"/>,
                ];
            default:
                return [];
        }
    };
    const onModifyData = () => setHasDataBeenModified(true);
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
    if (shouldDisplayPaywall) {
        openPaywall(PaywallName.SecureNote);
        history.push('/secure-notes');
    }
    return (<EditPanel isViewingExistingItem={false} itemHasBeenEdited={hasDataBeenModified} submitPending={isSubmitting} submitDisabled={isSubmitDisabled} onSubmit={submit} secondaryActions={getSecondaryActions()} primaryActions={[]} onNavigateOut={closeAndShowListView} isUsingNewDesign isSomeDialogOpen={hasDialogsOpenedByChildren} formId="add_securenote_panel" header={<Header backgroundColor={data.type} displayDocumentStorage={!collectionsToUpdate.length} displaySharedAccess={false} displayMoreOptions={false} isSecured={isSecured} setActiveTab={setActiveTab} title={title} setTitle={(updatedTitle) => {
                onModifyData();
                setTitle(updatedTitle);
            }}/>}>
      <SecureNotesForm activeTab={activeTab} data={data} content={content} title={title} color={color} spaceId={spaceId ?? ''} onSpaceIdChange={handleSetSpaceId} onColorChange={handleSetColor} onTitleChange={handleSetTitle} onContentChange={handleSetContent} onIsSecuredChange={handleSetIsSecured} onIsSubmitDisabled={setIsSubmitDisabled} handleFileInfoDetached={handleDeleteSecureFileInfoAttached} hasAttachment={!!temporaryAttachedFiles.length} isSecured={isSecured} isAdmin={false} isDisabled={!!shouldShowFrozenStateDialog} isShared={false} isUploading={isUploading} onModifyData={onModifyData} onCollectionsToUpdate={setCollectionsToUpdate} setHasDialogsOpenedByChildren={setHasDialogsOpenedByChildren}/>
    </EditPanel>);
};
