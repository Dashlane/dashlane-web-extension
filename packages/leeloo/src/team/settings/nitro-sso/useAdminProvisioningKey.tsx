import { DataStatus, useCarbonEndpoint } from '@dashlane/carbon-api-consumers';
import { carbonConnector } from '../../../libs/carbon/connector';
const { getAdminProvisioningKey, liveAdminProvisioningKey } = carbonConnector;
export const useAdminProvisioningKey = () => {
    const keyResponse = useCarbonEndpoint({
        queryConfig: {
            query: getAdminProvisioningKey,
        },
        liveConfig: {
            live: liveAdminProvisioningKey,
        },
    }, []);
    return {
        adminProvisioningKeyGetLoading: keyResponse.status === DataStatus.Loading,
        adminProvisioningKeyGetError: keyResponse.status === DataStatus.Error
            ? new Error('Error getting adminProvisioningKey')
            : null,
        adminProvisioningKey: keyResponse.status === DataStatus.Success
            ? keyResponse.data.adminProvisioningKey
            : null,
    };
};
