import { DataStatus, useCarbonEndpoint } from '@dashlane/carbon-api-consumers';
import { carbonConnector } from 'src/carbonConnector';
export const useIsMPlessUser = () => {
    const result = useCarbonEndpoint({
        queryConfig: {
            query: carbonConnector.getAccountAuthenticationType,
        },
    }, []);
    return {
        status: result.status,
        isMPLessUser: result.status === DataStatus.Success &&
            result.data === 'invisibleMasterPassword',
    };
};
