import { Fragment } from 'react';
import { pick } from 'ramda';
import { InfoBox, jsx } from '@dashlane/ui-components';
import { NoteCategoryDetailView, NoteType } from '@dashlane/communication';
import { FEATURE_FLIPS_WITHOUT_MODULE } from '@dashlane/framework-dashlane-application';
import { Lee } from 'lee';
import { useHasFeatureEnabled } from 'libs/carbon/hooks/useHasFeature';
import useTranslate from 'libs/i18n/useTranslate';
import { useTrialDiscontinuedDialogContext } from 'libs/trial/trialDiscontinuationDialogContext';
import { SharedAccess } from 'webapp/shared-access';
import { SaveSecureNoteContentValues } from 'webapp/personal-data/types';
import { SecureNoteTabs } from 'webapp/secure-notes/edit/types';
import { SecureNoteContent } from './content';
import { SecureNoteDocumentsForm } from './document-storage';
import { TextMaxSizeReached } from './textMaxSizeReached';
import { SecureNoteOptions, SecureNotesOptionsForm, } from './secure-notes-options';
import styles from './style.css';
const { CONTENT, DOCUMENT_STORAGE, MORE_OPTIONS, SHARED_ACCESS } = SecureNoteTabs;
export interface Props {
    activeTab: SecureNoteTabs;
    data: SaveSecureNoteContentValues;
    content: string;
    setContent: (content: string) => void;
    handleFileInfoDetached: (secureFileInfoId: string) => void;
    hasAttachment: boolean;
    isAdmin: boolean;
    isSecureNoteAttachmentEnabled: boolean;
    isShared: boolean;
    isUploading: boolean;
    isEditing: boolean;
    setIsEditing: (isEditing: boolean) => void;
    lee: Lee;
    noteCategories: NoteCategoryDetailView[];
    onModifyData: () => void;
    onModalDisplayStateChange?: (isModalOpen: boolean) => void;
    saveSecureNoteOptions: (options: SecureNoteOptions) => void;
}
export interface State {
    headerBackground: NoteType;
    textSize: number;
}
export const MAX_AUTHORIZED_CHARACTERS = 10000;
export const SecureNotesForm = ({ activeTab, data, content, setContent, handleFileInfoDetached, hasAttachment, isAdmin, isSecureNoteAttachmentEnabled, isShared, isUploading, isEditing, setIsEditing, lee, noteCategories, onModifyData, onModalDisplayStateChange, saveSecureNoteOptions, }: Props) => {
    const { translate } = useTranslate();
    const { shouldShowTrialDiscontinuedDialog: isDisabled } = useTrialDiscontinuedDialogContext();
    const isDisableSecureNotesFFActive = useHasFeatureEnabled(FEATURE_FLIPS_WITHOUT_MODULE.DisableSecureNotes);
    return (<>
      {activeTab === CONTENT && (<>
          <div className={styles.formContent}>
            <SecureNoteContent content={content} setContent={(noteContent) => {
                onModifyData();
                setContent(noteContent);
            }} isEditing={isEditing} setIsEditing={setIsEditing} limitedPermissions={isShared && !isAdmin} readonly={isDisabled || isDisableSecureNotesFFActive}/>
          </div>
          <TextMaxSizeReached maxAuthorizedSize={MAX_AUTHORIZED_CHARACTERS} currentSize={content.length}/>
          {isSecureNoteAttachmentEnabled && (isShared || hasAttachment) && (<InfoBox severity="subtle" size="small" title={isShared
                    ? translate('webapp_secure_notes_infobox_shared')
                    : translate('webapp_secure_notes_infobox_has_attachments')} sx={{ margin: '0px 32px 0px 8px' }}/>)}
        </>)}

      {activeTab === SHARED_ACCESS && (<SharedAccess isAdmin={isAdmin} id={data.id}/>)}

      {activeTab === DOCUMENT_STORAGE && (<SecureNoteDocumentsForm currentValues={pick(['attachments'], data)} lee={lee} signalEditedValues={onModifyData} additionalProps={{
                handleFileInfoDetached: (secureFileInfoId: string) => {
                    handleFileInfoDetached(secureFileInfoId);
                },
                onModalDisplayStateChange,
                noteId: data.id,
                isUploading: isUploading,
            }}/>)}

      {activeTab === MORE_OPTIONS && (<SecureNotesOptionsForm data={{
                category: data.category,
                spaceId: data.spaceId ?? '',
                type: data.type,
                secured: data.secured,
            }} noteCategories={noteCategories} isNewItem={false} saveSecureNoteOptions={(options) => {
                saveSecureNoteOptions(options);
            }} disabled={!!isDisabled}/>)}
    </>);
};
