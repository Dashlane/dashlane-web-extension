import { DataStatus, useCarbonEndpoint } from '@dashlane/carbon-api-consumers';
import { carbonConnector } from '../connector';
export const useIsAllowedToShare = (): boolean => {
    const result = useCarbonEndpoint({ queryConfig: { query: carbonConnector.isAllowedToShare } }, []);
    return result.status === DataStatus.Success ? result.data : false;
};
