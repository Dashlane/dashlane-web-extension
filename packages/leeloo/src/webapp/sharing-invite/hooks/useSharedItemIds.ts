import { DataStatus, useCarbonEndpoint } from '@dashlane/carbon-api-consumers';
import { carbonConnector } from 'libs/carbon/connector';
export const useSharedItemIds = (): string[] => {
    const result = useCarbonEndpoint({
        queryConfig: {
            query: carbonConnector.getAllSharedItemIds,
        },
    }, []);
    return result.status === DataStatus.Success ? result.data : [];
};
