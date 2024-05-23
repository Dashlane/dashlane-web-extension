import { DataStatus } from '@dashlane/carbon-api-consumers';
import { Offer } from '@dashlane/team-admin-contracts';
import { B2bPlanTier, PlanChangeStep, UserChangeTeamPlanTierEvent, } from '@dashlane/hermes';
import { usePremiumStatus } from 'libs/carbon/hooks/usePremiumStatus';
import { logEvent } from 'libs/logs/logEvent';
import { isOfferBusinessTier } from './utils';
interface UseMidCycleTierUpgradeProps {
    selectedOffer?: Offer;
    hasPromo: boolean;
    currentSeats: number;
    additionalSeats: number;
    planChangeStep: PlanChangeStep;
}
export const useMidCycleTierLogs = ({ selectedOffer, hasPromo, currentSeats, additionalSeats, planChangeStep, }: UseMidCycleTierUpgradeProps) => {
    const premiumStatus = usePremiumStatus();
    const currentPlanIsStarter = premiumStatus.status === DataStatus.Success &&
        premiumStatus.data.planName === '2022_team_starter_tier';
    const currentBillingPlanTier = currentPlanIsStarter
        ? B2bPlanTier.StarterTeam
        : B2bPlanTier.Team;
    return {
        logChangePlanEvent: (newOffer?: Offer) => {
            const targetOffer = newOffer ? newOffer : selectedOffer;
            const nextBillingPlanTier = targetOffer
                ? isOfferBusinessTier(targetOffer)
                    ? B2bPlanTier.Business
                    : B2bPlanTier.Team
                : currentBillingPlanTier;
            logEvent(new UserChangeTeamPlanTierEvent({
                currentBillingPlanTier,
                currentPlanPaidSeatsCount: currentSeats,
                hasPromo,
                nextBillingPlanTier,
                planChangeStep,
                seatAddedCount: additionalSeats,
            }));
        },
    };
};
