import { DataStatus, useCarbonEndpoint } from '@dashlane/carbon-api-consumers';
import { carbonConnector } from '../carbon/connector';
export const useUserLogin = (): string | undefined => {
    const result = useCarbonEndpoint({
        queryConfig: {
            query: carbonConnector.getUserLogin,
        },
    }, []);
    return result.status === DataStatus.Success ? result.data : undefined;
};
