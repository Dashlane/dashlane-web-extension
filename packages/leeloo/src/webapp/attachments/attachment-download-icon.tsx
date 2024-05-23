import { AlertSeverity, colors, DownloadIcon, jsx, mergeSx, Tooltip, } from '@dashlane/ui-components';
import { useCallback, useEffect } from 'react';
import { FileDownloadStatus, SecureFileDownloadProgressView, } from '@dashlane/communication';
import { UserDownloadVaultItemAttachmentEvent } from '@dashlane/hermes';
import { useSecureFileDownload } from 'webapp/secure-files/hooks';
import useTranslate from 'libs/i18n/useTranslate';
import { useTranslateWithMarkup } from 'libs/i18n/useTranslateWithMarkup';
import { useAlert } from 'libs/alert-notifications/use-alert';
import { logEvent } from 'libs/logs/logEvent';
import { SecureAttachmentProps } from './types';
import { I18N_KEYS } from './attachment-translation-keys';
import { actionCellSx, disableButtonSx } from './attachments-ui';
interface AttachmentProgressProps {
    progress: SecureFileDownloadProgressView | null;
}
export const AttachmentDownloadIcon = ({ attachment, disableActions, setDisableActions, progress, parentId, parentType, }: SecureAttachmentProps & AttachmentProgressProps) => {
    const { translate } = useTranslate();
    const { translateWithMarkup } = useTranslateWithMarkup();
    const alert = useAlert();
    const setError = useCallback(() => alert.showAlert(translateWithMarkup(I18N_KEYS.UNKNOWN_ERROR), AlertSeverity.ERROR), [alert, translateWithMarkup]);
    const { download } = useSecureFileDownload(attachment, setError, parentType);
    const handleDownload = () => {
        if (parentId) {
            logEvent(new UserDownloadVaultItemAttachmentEvent({
                itemId: parentId,
                itemType: parentType,
            }));
        }
        download();
    };
    useEffect(() => {
        switch (progress?.status) {
            case FileDownloadStatus.Downloading:
                setDisableActions(true);
                break;
            case FileDownloadStatus.TransferComplete:
                setDisableActions(false);
                break;
            case FileDownloadStatus.Error:
                setDisableActions(false);
                break;
        }
    }, [progress, setDisableActions, translateWithMarkup]);
    return (<Tooltip placement="left" trigger="hover" content={disableActions
            ? translateWithMarkup(I18N_KEYS.DOWNLOAD_BUTTON_TOOLTIP_CONTENT_DISABLE)
            : translateWithMarkup(I18N_KEYS.DOWNLOAD_BUTTON_TOOLTIP_CONTENT_ENABLE)}>
      <div sx={disableActions
            ? mergeSx([actionCellSx, disableButtonSx])
            : actionCellSx} onClick={disableActions ? undefined : handleDownload}>
        <DownloadIcon sx={disableActions ? disableButtonSx : undefined} color={colors.dashGreen00} aria-hidden="true" aria-label={translate(I18N_KEYS.DOWNLOAD_BUTTON_TITLE)} title={translate(I18N_KEYS.DOWNLOAD_BUTTON_TITLE)}/>
      </div>
    </Tooltip>);
};
