import { SecureFileDownloadProgressView } from '@dashlane/communication';
import { DataStatus, useCarbonEndpoint } from '@dashlane/carbon-api-consumers';
import { carbonConnector } from 'libs/carbon/connector';
export function useSecureFileDownloadProgress(downloadKey: string): SecureFileDownloadProgressView | null {
    const fileDownloadProgress = useCarbonEndpoint({
        queryConfig: {
            query: carbonConnector.getFileDownloadProgress,
            queryParam: downloadKey,
        },
        liveConfig: {
            live: carbonConnector.liveFileDownloadProgress,
            liveParam: downloadKey,
        },
    }, [downloadKey]);
    return fileDownloadProgress.status === DataStatus.Success
        ? fileDownloadProgress.data
        : null;
}
