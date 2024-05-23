import { useEffect, useState } from 'react';
import { AttachmentIcon, colors, FlexContainer, InfoBox, jsx, Paragraph, ThemeUIStyleObject, } from '@dashlane/ui-components';
import { SecureDocument } from './secure-document';
import { Props as CommonProps } from 'webapp/personal-data/edit/form/common';
import { SaveSecureNoteContentValues } from 'webapp/personal-data/types';
import useTranslate from 'libs/i18n/useTranslate';
import { useSecureFilesQuota } from 'webapp/secure-files/hooks/use-secure-files-quota';
import { EmbeddedAttachment } from '@dashlane/communication';
import { DISPLAY_SECURE_FILES_QUOTA_WARNING_THRESHOLD, formatQuota, } from 'webapp/secure-files/helpers/quota';
import { useIsSecureNoteAttachmentEnabled } from 'webapp/secure-files/hooks';
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
    EMPTY_ATTACHMENTS: 'webapp_secure_file_empty_attachments_markup',
    REMAINING_QUOTA: 'webapp_secure_file_storage_quota_info',
};
interface AdditionalProps {
    handleFileInfoDetached: (secureFileInfoId: string) => void;
    onModalDisplayStateChange?: (isModalOpen: boolean) => void;
    noteId?: string;
    isUploading: boolean;
}
type Props = CommonProps<SaveSecureNoteContentValues> & {
    additionalProps: AdditionalProps;
};
const headerSx: ThemeUIStyleObject = {
    padding: '16px 16px 16px 0px',
    borderBottom: `1px solid ${colors.grey06}`,
    color: 'ds.text.neutral.quiet',
    alignSelf: 'center',
    fontSize: '12px',
    textTransform: 'uppercase',
};
export const SecureNoteDocumentsForm = ({ currentValues, additionalProps, }: Props) => {
    const { translate } = useTranslate();
    const isSecureNoteAttachmentEnabled = useIsSecureNoteAttachmentEnabled();
    const [disableActions, setDisableActions] = useState(false);
    const secureFilesQuota = useSecureFilesQuota();
    const shouldDisplaySecureFilesQuotaWarning = secureFilesQuota.max > 0 &&
        secureFilesQuota.remaining < DISPLAY_SECURE_FILES_QUOTA_WARNING_THRESHOLD &&
        isSecureNoteAttachmentEnabled;
    const attachments = currentValues.attachments;
    useEffect(() => {
        setDisableActions(additionalProps.isUploading);
    }, [additionalProps.isUploading]);
    return (<FlexContainer flexDirection="column" sx={{ padding: '12px 0px', flex: 1, overflow: 'hidden' }}>
      <FlexContainer flexDirection="column" alignItems="center" fullWidth={true} sx={{ flex: 1, overflowY: 'auto', flexWrap: 'nowrap' }}>
        {attachments.length > 0 ? (<FlexContainer fullWidth={true} alignItems="center">
            <Paragraph sx={{ ...headerSx, width: '45%' }}>
              {translate(I18N_KEYS.ATTACHMENT_NAME)}
            </Paragraph>
            <Paragraph sx={{ ...headerSx, width: '25%' }}>
              {translate(I18N_KEYS.ATTACHMENT_CREATION_DATE)}
            </Paragraph>
            <Paragraph sx={{ ...headerSx, width: '30%' }}>
              {translate(I18N_KEYS.ATTACHMENT_FILE_SIZE)}
            </Paragraph>
          </FlexContainer>) : (<FlexContainer justifyContent="center" flexDirection="column" alignItems="center" sx={{ flex: 1 }}>
            <AttachmentIcon size={70} color={colors.dashGreen04} sx={{ marginBottom: '24px' }}/>
            <Paragraph sx={{ textAlign: 'center', color: 'ds.text.neutral.catchy' }}>
              {translate.markup(I18N_KEYS.EMPTY_ATTACHMENTS)}
            </Paragraph>
          </FlexContainer>)}
        {attachments
            ? attachments.map((attachment: EmbeddedAttachment) => {
                return (<SecureDocument key={attachment.id} attachment={attachment} handleFileInfoDetached={additionalProps?.handleFileInfoDetached} isAttachmentEnabled={isSecureNoteAttachmentEnabled} disableActions={disableActions} setDisableActions={setDisableActions} onModalDisplayStateChange={additionalProps.onModalDisplayStateChange} noteId={additionalProps?.noteId}/>);
            })
            : null}
      </FlexContainer>
      {shouldDisplaySecureFilesQuotaWarning ? (<InfoBox severity="warning" title={translate(I18N_KEYS.REMAINING_QUOTA, formatQuota(secureFilesQuota.remaining, secureFilesQuota.max))} sx={{ flex: 0, marginTop: '16px' }}/>) : null}
    </FlexContainer>);
};
