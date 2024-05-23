import { DataStatus, useCarbonEndpoint } from '@dashlane/carbon-api-consumers';
import { CredentialLimitStatus } from '@dashlane/communication';
import { carbonConnector } from 'libs/carbon/connector';
export function useCredentialLimitStatus(): CredentialLimitStatus | null {
    const limitStatus = useCarbonEndpoint({
        queryConfig: {
            query: carbonConnector.getCredentialLimitStatus,
        },
        liveConfig: {
            live: carbonConnector.liveCredentialLimitStatus,
        },
    }, []);
    if (limitStatus.status !== DataStatus.Success) {
        return null;
    }
    return limitStatus.data;
}
