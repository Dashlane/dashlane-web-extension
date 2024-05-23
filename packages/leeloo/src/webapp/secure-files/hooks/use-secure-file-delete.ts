import { SecureFileResultErrorCode } from '@dashlane/communication';
import { carbonConnector } from 'libs/carbon/connector';
import { logEvent } from 'libs/logs/logEvent';
import { Action, ItemType, UserUpdateVaultItemAttachmentEvent, } from '@dashlane/hermes';
export function useSecureFileDelete(id: string, setError: (errorCode: SecureFileResultErrorCode) => void, itemType: ItemType, handleFileInfoDetached?: (secureFileInfoId: string) => void) {
    return {
        deleteFile: () => {
            carbonConnector.deleteSecureFile({ id }).then((response) => {
                if (response.success ||
                    (!response.success &&
                        response.error?.code === SecureFileResultErrorCode.FILE_NOT_FOUND)) {
                    handleFileInfoDetached?.(id);
                    logEvent(new UserUpdateVaultItemAttachmentEvent({
                        attachmentAction: Action.Delete,
                        itemId: id,
                        itemType: itemType,
                    }));
                }
                else {
                    setError(response.error?.code ?? SecureFileResultErrorCode.INTERNAL_ERROR);
                }
            });
        },
    };
}
