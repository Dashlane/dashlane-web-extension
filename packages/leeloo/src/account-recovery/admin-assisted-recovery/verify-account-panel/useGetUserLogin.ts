import { DataStatus, useCarbonEndpoint } from '@dashlane/carbon-api-consumers';
import { carbonConnector } from 'libs/carbon/connector';
export function useUserLogin(): string {
    const userLogin = useCarbonEndpoint({
        queryConfig: {
            query: carbonConnector.getUserLogin,
        },
    }, []);
    let login = '';
    if (userLogin.status === DataStatus.Success && userLogin.data) {
        login = userLogin.data;
    }
    return login;
}
