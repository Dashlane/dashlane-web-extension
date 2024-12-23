import { FEATURE_FLIPS_WITHOUT_MODULE } from "@dashlane/framework-dashlane-application";
import { useFeatureFlip } from "@dashlane/framework-react";
import { useDiscontinuedStatus } from "../../../../libs/carbon/hooks/useNodePremiumStatus";
export const useShowQuickDisableSpaceManagement = (): boolean | null => {
  const discontinuedStatus = useDiscontinuedStatus();
  const hasB2BDiscontinuationFFEnabled = useFeatureFlip(
    FEATURE_FLIPS_WITHOUT_MODULE.EcommerceWebB2BDiscontinuationDev
  );
  if (
    discontinuedStatus.isLoading ||
    typeof hasB2BDiscontinuationFFEnabled !== "boolean"
  ) {
    return null;
  }
  return (
    hasB2BDiscontinuationFFEnabled &&
    !!discontinuedStatus.isTeamSoftDiscontinued &&
    !!discontinuedStatus.isTrial
  );
};
