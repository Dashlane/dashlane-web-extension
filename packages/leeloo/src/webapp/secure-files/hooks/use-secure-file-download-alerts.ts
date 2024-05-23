import { EmbeddedAttachment, FileDownloadStatus, } from '@dashlane/communication';
import { AlertSeverity } from '@dashlane/ui-components';
import { useAlert } from 'libs/alert-notifications/use-alert';
import { TranslationOptions } from 'libs/i18n/types';
import { useTranslateWithMarkup } from 'libs/i18n/useTranslateWithMarkup';
import { useEffect } from 'react';
import { useSecureFileDownloadProgress } from '.';
import { wrapWithLoadingIcon } from '../helpers/alert-text';
const I18N_KEYS = {
    PROGRESS_DOWNLOADING: 'webapp_secure_file_download_progress_downloading_markup',
    PROGRESS_DECIPHERING: 'webapp_secure_file_download_progress_deciphering_markup',
    DOWNLOAD_SUCCESS: 'webapp_secure_file_download_progress_success_markup',
    ERROR: 'webapp_secure_file_error_unknown',
};
export const useSecureFileDownloadAlerts = (attachment: EmbeddedAttachment) => {
    const { showAlert } = useAlert();
    const { translateWithMarkup } = useTranslateWithMarkup();
    const fileDownloadProgress = useSecureFileDownloadProgress(attachment.downloadKey);
    useEffect(() => {
        const showAlertWithLoader = (translationOptions: TranslationOptions) => showAlert(wrapWithLoadingIcon(translateWithMarkup(translationOptions)), AlertSeverity.SUBTLE, false);
        if (!fileDownloadProgress?.status) {
            return;
        }
        switch (fileDownloadProgress.status) {
            case FileDownloadStatus.Downloading:
                showAlertWithLoader({
                    key: I18N_KEYS.PROGRESS_DOWNLOADING,
                    params: {
                        fileName: attachment.filename,
                        progress: Math.round((100 * fileDownloadProgress?.bytesReceived ?? 0) /
                            fileDownloadProgress?.contentLength ?? 1),
                    },
                });
                break;
            case FileDownloadStatus.Deciphering:
                showAlertWithLoader({
                    key: I18N_KEYS.PROGRESS_DECIPHERING,
                    params: {
                        fileName: attachment.filename,
                    },
                });
                break;
            case FileDownloadStatus.TransferComplete:
                showAlert(translateWithMarkup({
                    key: I18N_KEYS.DOWNLOAD_SUCCESS,
                    params: {
                        fileName: attachment.filename,
                    },
                }), AlertSeverity.SUCCESS);
                break;
            case FileDownloadStatus.Error:
                showAlert(translateWithMarkup({
                    key: I18N_KEYS.ERROR,
                }), AlertSeverity.ERROR);
                break;
            default:
                break;
        }
    }, [alert, attachment, fileDownloadProgress, translateWithMarkup]);
};
