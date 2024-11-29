import { SpaceTier } from "@dashlane/team-admin-contracts";
import { DataStatus } from "@dashlane/framework-react";
import {
  useDiscontinuedStatus,
  useNodePremiumStatus,
} from "../../../libs/carbon/hooks/useNodePremiumStatus";
import { useTeamCancellationStatus } from "../../../libs/hooks/use-team-cancellation-status";
import { useTeamTrialStatus } from "../../../libs/hooks/use-team-trial-status";
import { CancelSubscriptionFlow } from "../cancelation/cancel-subscription-flow";
import { PlanUpgradeContent } from "./upgrade-content/plan-upgrade-content";
import { TrialUpgradeContent } from "./upgrade-content/trial-upgrade-content";
import { getSubscriptionPhase } from "../plan-information/helpers";
import { useCreditCardPaymentMethodDisplay } from "../upgrade-success/useCreditCardPaymentDisplay";
import { KeepSubscriptionGoing } from "./keep-subscription-going";
import { getSideContentType } from "./helpers";
export const PageSideContentContainer = () => {
  const cancelSubscriptionStatus = useTeamCancellationStatus();
  const discontinuedStatus = useDiscontinuedStatus();
  const premiumStatus = useNodePremiumStatus();
  const teamTrialStatus = useTeamTrialStatus();
  const { isExpired: isPaymentCardExpired } = useCreditCardPaymentMethodDisplay(
    {}
  );
  if (
    cancelSubscriptionStatus.isLoading ||
    discontinuedStatus.isLoading ||
    premiumStatus.status !== DataStatus.Success ||
    !premiumStatus.data.b2bStatus ||
    !teamTrialStatus
  ) {
    return null;
  }
  const subscriptionPhase = getSubscriptionPhase(
    discontinuedStatus,
    premiumStatus.data.b2bStatus,
    teamTrialStatus,
    isPaymentCardExpired
  );
  const sideContentType = getSideContentType(subscriptionPhase);
  if (sideContentType === "cancelSubscription") {
    if (
      teamTrialStatus.spaceTier === SpaceTier.Team ||
      teamTrialStatus.spaceTier === SpaceTier.Starter ||
      teamTrialStatus.spaceTier === SpaceTier.Standard
    ) {
      return (
        <div sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <PlanUpgradeContent />
          <CancelSubscriptionFlow status={cancelSubscriptionStatus.status} />
        </div>
      );
    }
    return <CancelSubscriptionFlow status={cancelSubscriptionStatus.status} />;
  } else if (sideContentType === "keepSubscription") {
    return <KeepSubscriptionGoing />;
  } else if (sideContentType === "trialUpgrade") {
    return <TrialUpgradeContent />;
  }
};
