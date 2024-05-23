import { CarbonEndpointResult, DataStatus, useCarbonEndpoint, } from '@dashlane/carbon-api-consumers';
import { carbonConnector } from 'carbonConnector';
export enum CommonABTestVariants {
    NOT_PARTICIPATING = 'not-participating',
    CONTROL_GROUP = 'controlGroup'
}
export function useGetABTestVariant(testName: string): CarbonEndpointResult<string | undefined> {
    const queryParam = testName;
    const liveParam = btoa(JSON.stringify(queryParam));
    return useCarbonEndpoint({
        queryConfig: {
            query: carbonConnector.getUserABTestVariant,
            queryParam,
        },
        liveConfig: {
            live: carbonConnector.liveUserABTestVariant,
            liveParam,
        },
    }, []);
}
export function useUserParticipatesInABTest(testName: string): boolean {
    const abTestVariant = useGetABTestVariant(testName);
    return (abTestVariant.status === DataStatus.Success &&
        abTestVariant.data !== CommonABTestVariants.NOT_PARTICIPATING);
}
