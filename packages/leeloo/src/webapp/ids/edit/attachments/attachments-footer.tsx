import { AddSecureFileResult, BaseIdUpdateModel, DataModelDetailView, } from '@dashlane/communication';
import styles from './attachments-tab-pane.css';
import React from 'react';
import { SecureAttachmentUploadButton } from 'webapp/secure-files/components/secure-attachment-upload-button';
import { Button, TrashIcon } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { ID_EDIT_FOOTER_I18N_KEYS } from '../footer';
type AttachmentFooterProps = {
    handleOnFileUploadStarted: () => void;
    handleOnSecureFileUploadDone: (result: AddSecureFileResult) => Promise<void>;
    item: DataModelDetailView & BaseIdUpdateModel;
    showListView: () => void;
    openConfirmDeleteDialog: () => void;
};
export const AttachmentFooter = ({ handleOnFileUploadStarted, handleOnSecureFileUploadDone, item, openConfirmDeleteDialog, showListView, }: AttachmentFooterProps) => {
    const { translate } = useTranslate();
    return (<div className={styles['attach-files']}>
      <Button nature="secondary" onClick={openConfirmDeleteDialog} type="button">
        <TrashIcon />
        {translate(ID_EDIT_FOOTER_I18N_KEYS.DELETE)}
      </Button>
      <SecureAttachmentUploadButton isQuotaReached={false} isShared={false} onFileUploadStarted={handleOnFileUploadStarted} onFileUploadDone={handleOnSecureFileUploadDone} itemId={item.id} key="uploadAction" dataType="KWIDCard" disabled={false}/>
      <Button nature="secondary" onClick={showListView} type="button">
        {translate(ID_EDIT_FOOTER_I18N_KEYS.CLOSE)}
      </Button>
    </div>);
};
