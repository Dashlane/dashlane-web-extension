import { SupportedDerivationMethods } from '@dashlane/communication';
import { DataStatus, useCarbonEndpoint } from '@dashlane/carbon-api-consumers';
import { carbonConnector } from 'libs/carbon/connector';
export function useUserDerivationMethod(): SupportedDerivationMethods | undefined {
    const result = useCarbonEndpoint({
        queryConfig: { query: carbonConnector.getUserDerivationMethod },
        liveConfig: { live: carbonConnector.liveUserDerivationMethod },
    }, []);
    const supportedMethods = Object.values(SupportedDerivationMethods);
    return result.status === DataStatus.Success &&
        supportedMethods.includes(result.data)
        ? result.data
        : undefined;
}
