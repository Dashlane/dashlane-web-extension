import { useCarbonEndpoint } from '@dashlane/carbon-api-consumers';
import { DataStatus } from '@dashlane/framework-react';
import { carbonConnector } from 'src/carbonConnector';
export function useIsNewAuthenticationFlowDisabled(): {
    loading: boolean;
    data?: boolean;
} {
    const isExtngLoginFlowDisabled = useCarbonEndpoint({
        queryConfig: {
            query: carbonConnector.getIsLoginFlowMigrationDisabled,
        },
        liveConfig: {
            live: carbonConnector.liveIsLoginFlowMigrationDisabled,
        },
    }, []);
    switch (isExtngLoginFlowDisabled.status) {
        case DataStatus.Success:
            return { loading: false, data: isExtngLoginFlowDisabled.data };
        case DataStatus.Loading:
            return { loading: true };
        case DataStatus.Error:
        default:
            return { loading: false, data: true };
    }
}
