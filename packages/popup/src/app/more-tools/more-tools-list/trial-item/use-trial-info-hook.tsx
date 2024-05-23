import { GetTeamBillingInformationResult, GetTeamTrialStatusResult, SpaceTier, TeamStatusBilling, } from '@dashlane/team-admin-contracts';
import { useDiscontinuedStatus, useSubscriptionCode } from 'libs/api';
import { useTeamBillingInfo } from 'libs/api/team/use-team-billing-info';
import { useTeamTrialStatus } from 'libs/hooks/use-team-trial-status';
type TrialInfoResult = {
    subscriptionCode: string | null;
    isTeam: boolean;
    isBusiness: boolean;
    billingInfo: GetTeamBillingInformationResult;
    trialStatus: GetTeamTrialStatusResult;
    isTeamSoftDiscontinued: boolean;
};
export const useTrialInfo = (): TrialInfoResult | null => {
    const billingInfo = useTeamBillingInfo();
    const trialStatus = useTeamTrialStatus();
    const discontinuationStatus = useDiscontinuedStatus();
    const subscriptionCode = useSubscriptionCode();
    if (discontinuationStatus.isLoading ||
        discontinuationStatus.isTeamSoftDiscontinued === undefined ||
        !billingInfo ||
        billingInfo.isLoading ||
        !billingInfo.teamBilling ||
        !trialStatus) {
        return null;
    }
    const isTeam = billingInfo.teamBilling?.spaceTier === SpaceTier.Team;
    const isBusiness = billingInfo.teamBilling?.spaceTier === SpaceTier.Business;
    const isTeamSoftDiscontinued = discontinuationStatus.isTeamSoftDiscontinued;
    return {
        subscriptionCode,
        billingInfo: billingInfo.teamBilling,
        trialStatus: trialStatus,
        isTeam,
        isBusiness,
        isTeamSoftDiscontinued,
    };
};
