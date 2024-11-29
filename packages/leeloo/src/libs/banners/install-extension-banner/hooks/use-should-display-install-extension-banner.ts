import { AvailableFeatureFlips } from "@dashlane/onboarding-contracts";
import { DataStatus } from "@dashlane/carbon-api-consumers";
import { useFeatureFlip } from "@dashlane/framework-react";
import { useTeamTrialStatus } from "../../../hooks/use-team-trial-status";
import { useDiscontinuedStatus } from "../../../carbon/hooks/useNodePremiumStatus";
type UseShouldDisplayInstallExtensionBanner =
  | {
      status: DataStatus.Error | DataStatus.Loading;
    }
  | {
      status: DataStatus.Success;
      shouldDisplay: boolean;
    };
export const useShouldDisplayInstallExtensionBanner =
  (): UseShouldDisplayInstallExtensionBanner => {
    const isInExtensionOrDesktop =
      APP_PACKAGED_IN_EXTENSION || APP_PACKAGED_IN_DESKTOP;
    const hasExtensionInstallBannerFeatureFlip = useFeatureFlip(
      AvailableFeatureFlips.OnboardingWebExtensionInstallStaticBanner
    );
    const useTeamTrialResponse = useTeamTrialStatus();
    const useDiscontinuedResponse = useDiscontinuedStatus();
    if (useDiscontinuedResponse.isLoading) {
      return { status: DataStatus.Loading };
    }
    if (useTeamTrialResponse === null) {
      return {
        status: DataStatus.Success,
        shouldDisplay: false,
      };
    }
    const { isGracePeriod, isSecondStageOfTrial } = useTeamTrialResponse;
    const discontinued: boolean =
      useDiscontinuedResponse.isTeamSoftDiscontinued ?? false;
    return {
      status: DataStatus.Success,
      shouldDisplay:
        !!hasExtensionInstallBannerFeatureFlip &&
        !isInExtensionOrDesktop &&
        !isSecondStageOfTrial &&
        !discontinued &&
        !isGracePeriod,
    };
  };
