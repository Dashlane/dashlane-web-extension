import React from 'react';
import { FlexContainer } from '@dashlane/ui-components';
import { useSecureFileDownloadProgress } from 'webapp/secure-files/hooks';
import { AttachmentDeleteIcon } from './attachment-delete-icon';
import { SecureAttachmentProps } from './types';
import { AttachmentDownloadIcon } from './attachment-download-icon';
export const AttachmentActionsAndStatus = (props: SecureAttachmentProps) => {
    const fileDownloadProgress = useSecureFileDownloadProgress(props.attachment.downloadKey);
    return (<FlexContainer alignItems="center" justifyContent="flex-end">
      <AttachmentDownloadIcon progress={fileDownloadProgress} {...props}/>
      <AttachmentDeleteIcon {...props}/>
    </FlexContainer>);
};
