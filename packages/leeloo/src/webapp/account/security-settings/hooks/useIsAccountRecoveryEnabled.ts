import { CarbonQueryResult, useCarbonEndpoint, } from '@dashlane/carbon-api-consumers';
import { carbonConnector } from 'libs/carbon/connector';
export function useIsAccountRecoveryEnabled(): CarbonQueryResult<boolean> {
    const isAccountRecoveryForTeam = useCarbonEndpoint({
        queryConfig: {
            query: carbonConnector.getIsRecoveryEnabled,
        },
    }, []);
    return isAccountRecoveryForTeam;
}
