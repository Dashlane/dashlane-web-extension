import { useEffect, useState } from 'react';
import { jsx } from '@dashlane/design-system';
import { PageView } from '@dashlane/hermes';
import { AddSecureFileResult, ListResults, NoteCategoryDetailView, NoteType, SecureFileInfo, } from '@dashlane/communication';
import { DataStatus } from '@dashlane/carbon-api-consumers';
import { Lee } from 'lee';
import { getCurrentSpaceId } from 'libs/webapp';
import { logPageView } from 'libs/logs/logEvent';
import { redirect, useHistory } from 'libs/router';
import { carbonConnector } from 'libs/carbon/connector';
import { usePaywall } from 'libs/paywall/paywallContext';
import { usePremiumStatus } from 'libs/carbon/hooks/usePremiumStatus';
import { useTrialDiscontinuedDialogContext } from 'libs/trial/trialDiscontinuationDialogContext';
import { useRouterGlobalSettingsContext } from 'libs/router/RouterGlobalSettingsProvider';
import { SecureNotesForm } from 'webapp/secure-notes/form/secure-notes-form';
import { EditPanel } from 'webapp/panel';
import { SecureNoteTabs } from 'webapp/secure-notes/edit/types';
import { createEmbeddedAttachmentFromSecureFile } from 'webapp/secure-files/helpers/embedded-attachment';
import { SecureAttachmentUploadButton } from 'webapp/secure-files/components/secure-attachment-upload-button';
import { clearSecureFileState } from 'webapp/secure-files/services/clear-secure-file-state';
import { useIsSecureNoteAttachmentEnabled } from 'webapp/secure-files/hooks';
import { PaywalledCapability, PaywallName, shouldShowPaywall, } from 'webapp/paywall';
import { SecureNoteOptions } from '../form/secure-notes-options';
import { Header } from '../form/header';
const { CONTENT, DOCUMENT_STORAGE } = SecureNoteTabs;
export interface Props {
    lee: Lee;
    noteCategories: ListResults<NoteCategoryDetailView>;
}
export const NoteAddPanelComponent = ({ lee, noteCategories }: Props) => {
    const { routes } = useRouterGlobalSettingsContext();
    const isSecureNoteAttachmentEnabled = useIsSecureNoteAttachmentEnabled();
    const premiumStatus = usePremiumStatus();
    const { openPaywall } = usePaywall();
    const history = useHistory();
    const { openDialog: openTrialDiscontinuedDialog, shouldShowTrialDiscontinuedDialog, } = useTrialDiscontinuedDialogContext();
    const [activeTab, setActiveTab] = useState(CONTENT);
    const [hasDataBeenModified, setHasDataBeenModified] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [temporaryAttachedFiles, setTemporaryAttachedFiles] = useState<SecureFileInfo[]>([]);
    const [secureNoteOptions, setSecureNoteOptions] = useState<SecureNoteOptions>({
        category: 'noCategory',
        type: 'GRAY' as NoteType,
        spaceId: getCurrentSpaceId(lee.globalState) ?? '',
        secured: false,
    });
    const [isUploading, setIsUploading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const data = {
        attachments: temporaryAttachedFiles.map(createEmbeddedAttachmentFromSecureFile),
        id: '',
        limitedPermissions: false,
        content,
        title,
        ...secureNoteOptions,
    };
    useEffect(() => {
        logPageView(PageView.ItemSecureNoteCreate);
    }, []);
    useEffect(() => {
        if (shouldShowTrialDiscontinuedDialog) {
            openTrialDiscontinuedDialog();
        }
    }, [shouldShowTrialDiscontinuedDialog]);
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
            await carbonConnector.deleteSecureFile({ id });
        });
        clearSecureFileState();
        setTemporaryAttachedFiles([]);
        showListView();
    };
    const saveNote = async () => {
        await carbonConnector.addSecureNote({
            ...secureNoteOptions,
            content: content,
            title: title,
            attachments: data.attachments,
        });
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
    if (shouldDisplayPaywall) {
        openPaywall(PaywallName.SecureNote);
        history.push('/secure-notes');
    }
    return (<EditPanel isViewingExistingItem={false} itemHasBeenEdited={hasDataBeenModified} submitPending={isSubmitting} onSubmit={submit} secondaryActions={getSecondaryActions()} primaryActions={[]} onNavigateOut={closeAndShowListView} formId="add_securenote_panel" header={<Header activeTab={activeTab} backgroundColor={data.type} displayDocumentStorage={true} displaySharedAccess={false} setActiveTab={setActiveTab} title={title} setTitle={(title) => {
                onModifyData();
                setTitle(title);
            }}/>}>
      <SecureNotesForm activeTab={activeTab} data={data} content={content} setContent={setContent} handleFileInfoDetached={handleDeleteSecureFileInfoAttached} hasAttachment={false} isAdmin={false} isSecureNoteAttachmentEnabled={isSecureNoteAttachmentEnabled} isShared={false} isUploading={isUploading} lee={lee} noteCategories={noteCategories.items} onModifyData={onModifyData} saveSecureNoteOptions={setSecureNoteOptions} isEditing={isEditing} setIsEditing={setIsEditing}/>
    </EditPanel>);
};
