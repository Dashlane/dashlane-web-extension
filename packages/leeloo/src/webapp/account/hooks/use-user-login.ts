import { DataStatus, useCarbonEndpoint } from '@dashlane/carbon-api-consumers';
import { carbonConnector } from 'libs/carbon/connector';
export function useUserLogin(): string | undefined {
    const userLogin = useCarbonEndpoint({
        queryConfig: {
            query: carbonConnector.getUserLogin,
        },
    }, []);
    return userLogin.status === DataStatus.Success ? userLogin.data : undefined;
}
