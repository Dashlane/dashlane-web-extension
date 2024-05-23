import React from 'react';
import { useIdAttachment } from './use-id-attachment';
import { updateItem } from './update-item';
import LoadingSpinner from 'libs/dashlane-style/loading-spinner';
import { AttachmentIcon, colors, Eyebrow, FlexContainer, Paragraph, ThemeUIStyleObject, } from '@dashlane/ui-components';
import { BaseIdUpdateModel, DataModelDetailView, } from '@dashlane/communication';
import useTranslate from 'libs/i18n/useTranslate';
import { Id } from 'webapp/ids/types';
import { AttachmentDisplay } from './attachment-display';
import styles from './attachments-tab-pane.css';
import { AttachmentFooter } from './attachments-footer';
import { WithDeleteModalProps } from '../edit-panel-types';
type AttachmentTabPaneProps = {
    item: DataModelDetailView & BaseIdUpdateModel;
    type: Id;
    focusAttachment: () => void;
    showListView: () => void;
} & WithDeleteModalProps;
const headerSx: ThemeUIStyleObject = {
    padding: '16px 16px 16px 0px',
    borderBottom: `1px solid ${colors.grey06}`,
    color: `${colors.grey01}`,
    alignSelf: 'center',
};
const I18N_KEYS = {
    MAX_CONTENT_LENGTH_EXCEEDED: 'webapp_secure_file_error_upload_max_length_excedeed',
    QUOTA_EXCEDEED: 'webapp_secure_file_error_upload_quota_excedeed',
    INVALID_FILE_TYPE: 'webapp_secure_file_error_file_type_not_allowed',
    UNKNOWN_ERROR: 'webapp_secure_file_error_unknown',
    UPLOAD_SUCCESS: 'webapp_secure_file_upload_success',
    ATTACHMENT_NAME: 'webapp_secure_notes_addition_field_tab_attachments_table_title_name',
    ATTACHMENT_CREATION_DATE: 'webapp_secure_notes_addition_field_tab_attachments_table_title_creation_date',
    ATTACHMENT_FILE_SIZE: 'webapp_secure_notes_addition_field_tab_attachments_table_title_file_size',
    STORAGE_QUOTA_INFO: 'webapp_secure_file_storage_quota_info',
    ATTACH_FILES: 'webapp_secure_notes_add_attachment_action_name',
    REMAINING_QUOTA: 'webapp_secure_file_storage_quota_info',
};
export const AttachmentsTabPane = ({ item, type, focusAttachment, openConfirmDeleteDialog, showListView, }: AttachmentTabPaneProps) => {
    const { translate } = useTranslate();
    const { isUploading, handleOnFileUploadStarted, handleOnSecureFileUploadDone, } = useIdAttachment(item, type);
    const attachments = item?.attachments ?? [];
    const handleFileInfoDetached = (secureFileInfoId: string) => {
        item.attachments = item.attachments?.filter((a) => a.id !== secureFileInfoId);
        updateItem(item, type);
        focusAttachment();
    };
    return (<>
      {isUploading && <LoadingSpinner size={30} mode="light"/>}
      <div data-testid="ids-attachment-tab" className={styles.attachments}>
        <FlexContainer flexDirection="column" alignItems="center" fullWidth={true} sx={{
            flex: 1,
            overflowY: 'auto',
            flexWrap: 'nowrap',
            margin: '20px;',
        }}>
          {attachments.length > 0 ? (<FlexContainer fullWidth={true} alignItems="center">
              <Eyebrow size="medium" sx={{ ...headerSx, width: '45%' }}>
                {translate(I18N_KEYS.ATTACHMENT_NAME)}
              </Eyebrow>
              <Eyebrow size="medium" sx={{ ...headerSx, width: '25%' }}>
                {translate(I18N_KEYS.ATTACHMENT_CREATION_DATE)}
              </Eyebrow>
              <Eyebrow size="medium" sx={{ ...headerSx, width: '30%' }}>
                {translate(I18N_KEYS.ATTACHMENT_FILE_SIZE)}
              </Eyebrow>
            </FlexContainer>) : (<div className={styles['no-attachment']}>
              <AttachmentIcon size={70} color={colors.dashGreen04} sx={{ marginBottom: '24px' }}/>
              <Paragraph sx={{ textAlign: 'center' }}>
                {translate(I18N_KEYS.ATTACH_FILES)}
              </Paragraph>
            </div>)}
          {attachments
            ? attachments.map((attachment) => (<AttachmentDisplay key={attachment.id} attachment={attachment} isUploading={isUploading} type={type} handleFileInfoDetached={handleFileInfoDetached}/>))
            : null}
        </FlexContainer>
        <AttachmentFooter handleOnFileUploadStarted={handleOnFileUploadStarted} handleOnSecureFileUploadDone={handleOnSecureFileUploadDone} item={item} openConfirmDeleteDialog={openConfirmDeleteDialog} showListView={showListView}/>
      </div>
    </>);
};
