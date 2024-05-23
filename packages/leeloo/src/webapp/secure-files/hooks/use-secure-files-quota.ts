import { DataStatus, useCarbonEndpoint } from '@dashlane/carbon-api-consumers';
import { SecureFilesQuota } from '@dashlane/communication';
import { carbonConnector } from 'libs/carbon/connector';
export function useSecureFilesQuota(): SecureFilesQuota {
    const secureFilesQuota = useCarbonEndpoint({
        queryConfig: {
            query: carbonConnector.getSecureFilesQuota,
        },
        liveConfig: {
            live: carbonConnector.liveSecureFilesQuota,
        },
    }, []);
    return secureFilesQuota.status === DataStatus.Success
        ? secureFilesQuota.data
        : {
            max: 0,
            remaining: 0,
        };
}
