import { useState } from 'react';
import { AddSecureFileResult, BaseIdUpdateModel, DataModelDetailView, } from '@dashlane/communication';
import { carbonConnector } from 'libs/carbon/connector';
import { createEmbeddedAttachmentFromSecureFile } from 'webapp/secure-files/helpers/embedded-attachment';
import { Id } from 'webapp/ids/types';
import { updateItem } from './update-item';
export function useIdAttachment(item: DataModelDetailView & BaseIdUpdateModel, type: Id) {
    const [isUploading, setIsUploading] = useState(false);
    const handleOnFileUploadStarted = () => {
        setIsUploading(true);
    };
    const handleOnSecureFileUploadDone = async (result: AddSecureFileResult) => {
        setIsUploading(false);
        if (result.success) {
            await carbonConnector.commitSecureFile({
                secureFileInfo: result.secureFileInfo,
            });
            const fileAsAttachment = createEmbeddedAttachmentFromSecureFile(result.secureFileInfo);
            const updatedItem = {
                ...item,
                attachments: [...(item?.attachments ?? []), fileAsAttachment],
            };
            await updateItem(updatedItem, type);
        }
    };
    return {
        isUploading,
        handleOnFileUploadStarted,
        handleOnSecureFileUploadDone,
    };
}
