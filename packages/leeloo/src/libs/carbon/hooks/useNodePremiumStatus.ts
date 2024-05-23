import { CarbonEndpointResult, DataStatus, useCarbonEndpoint, } from '@dashlane/carbon-api-consumers';
import { NodePremiumStatus, SpaceTier } from '@dashlane/communication';
import { carbonConnector } from 'libs/carbon/connector';
export type DiscontinuedStatusLoaded = {
    isLoading: false;
    planFeature: SpaceTier | undefined;
    planCopy: string | undefined;
    isTeamSoftDiscontinued: boolean | undefined;
    isTrial: boolean | undefined;
    isBillingOrFullAdmin: boolean | undefined;
};
export type UseDiscontinuedStatusOutput = {
    isLoading: true;
} | DiscontinuedStatusLoaded;
export type IsFreeB2CUser = {
    isLoading: true;
    isFreeB2C: null;
} | {
    isLoading: false;
    isFreeB2C: boolean;
};
export function useNodePremiumStatus(): CarbonEndpointResult<NodePremiumStatus> {
    return useCarbonEndpoint({
        queryConfig: {
            query: carbonConnector.getNodePremiumStatus,
        },
    }, []);
}
export function useDiscontinuedStatus(): UseDiscontinuedStatusOutput {
    const nodePremiumStatusData = useNodePremiumStatus();
    if (nodePremiumStatusData.status === DataStatus.Loading) {
        return { isLoading: true };
    }
    if (nodePremiumStatusData.status === DataStatus.Error) {
        return {
            isLoading: false,
            planFeature: undefined,
            planCopy: undefined,
            isTeamSoftDiscontinued: undefined,
            isTrial: undefined,
            isBillingOrFullAdmin: undefined,
        };
    }
    const currentTeam = nodePremiumStatusData.data.b2bStatus?.currentTeam;
    const planFeature = currentTeam?.planFeature;
    const isBillingOrFullAdmin = currentTeam?.teamMembership
        ? currentTeam.teamMembership.isBillingAdmin ||
            currentTeam.teamMembership.isTeamAdmin
        : undefined;
    const planCopy = planFeature
        ? planFeature === 'team'
            ? 'team_account_teamplan_team'
            : 'team_account_teamplan_business'
        : undefined;
    const isTeamSoftDiscontinued = currentTeam?.isSoftDiscontinued;
    const isTrial = currentTeam?.isTrial;
    return {
        isLoading: false,
        planFeature,
        planCopy,
        isTeamSoftDiscontinued,
        isTrial,
        isBillingOrFullAdmin,
    };
}
export function useIsFreeB2CUser(): IsFreeB2CUser {
    const nodePremiumStatus = useNodePremiumStatus();
    if (nodePremiumStatus.status !== DataStatus.Success) {
        return { isLoading: true, isFreeB2C: null };
    }
    return {
        isLoading: false,
        isFreeB2C: nodePremiumStatus.data.statusCode === 0 &&
            Object.keys(nodePremiumStatus.data.b2bStatus ?? {}).length === 0 &&
            !nodePremiumStatus.data.isTrial,
    };
}
