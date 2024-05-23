import { useEffect, useRef } from 'react';
import { carbonConnector } from 'libs/carbon/connector';
import { logEvent } from 'libs/logs/logEvent';
import { ItemType, UserDownloadVaultItemAttachmentEvent, } from '@dashlane/hermes';
import { EmbeddedAttachment, FileDownloadStatus, SecureFileResultErrorCode, } from '@dashlane/communication';
import { useSecureFileDownloadProgress } from 'webapp/secure-files/hooks';
const deserializeContent = (content: string, setError: (errorCode: SecureFileResultErrorCode) => void) => {
    try {
        const deserializedContent = JSON.parse(content as string);
        return new Uint8Array(deserializedContent).buffer;
    }
    catch (e) {
        setError(SecureFileResultErrorCode.INTERNAL_ERROR);
        return null;
    }
};
const createDownloadLink = (content: ArrayBuffer | null, filename: string, type: string) => {
    if (content) {
        const blob = new Blob([content], {
            type,
        });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    }
};
export function useSecureFileDownload({ id, filename, downloadKey, cryptoKey, type }: EmbeddedAttachment, setError: (errorCode: SecureFileResultErrorCode) => void, itemType: ItemType) {
    const fileDownloadProgress = useSecureFileDownloadProgress(downloadKey);
    const content = useRef<string>('');
    useEffect(() => {
        if (fileDownloadProgress?.status === FileDownloadStatus.ChunkReady) {
            content.current = content.current.concat(fileDownloadProgress.chunk);
            carbonConnector.chunkTransferDone(downloadKey);
        }
    }, [fileDownloadProgress, downloadKey]);
    useEffect(() => {
        if (fileDownloadProgress?.status === FileDownloadStatus.TransferComplete) {
            createDownloadLink(deserializeContent(content.current, setError), filename, type);
            content.current = '';
            carbonConnector.clearSecureFileState(downloadKey);
            logEvent(new UserDownloadVaultItemAttachmentEvent({
                itemId: id,
                itemType,
            }));
        }
    }, [
        fileDownloadProgress,
        setError,
        filename,
        type,
        downloadKey,
        id,
        itemType,
    ]);
    return {
        download: () => {
            carbonConnector.downloadSecureFile({
                downloadKey,
                cryptoKey,
            });
        },
    };
}
