import { DataStatus } from "@dashlane/carbon-api-consumers";
import { useFeatureFlip } from "@dashlane/framework-react";
import { PRIVACY_FEATURE_FLIPS } from "@dashlane/privacy-contracts";
import { useNodePremiumStatus } from "../../../../libs/carbon/hooks/useNodePremiumStatus";
import { AdminEmailPreferenceSetting } from "./admin-email-preference-setting";
import { CommonEmailPreferenceSetting } from "./common-email-preference-setting";
import { isFullAdmin } from "./helpers";
export const EmailPreferenceCenterWrapper = () => {
  const premiumStatus = useNodePremiumStatus();
  const hasEmailPreferenceCenterFF = useFeatureFlip(
    PRIVACY_FEATURE_FLIPS.EMAIL_PREFERENCE_CENTER
  );
  if (
    premiumStatus.status !== DataStatus.Success ||
    hasEmailPreferenceCenterFF === null ||
    hasEmailPreferenceCenterFF === undefined
  ) {
    return null;
  }
  const showAdminEmailPref =
    isFullAdmin(premiumStatus.data) &&
    !premiumStatus.data.b2bStatus?.currentTeam?.isTrial &&
    hasEmailPreferenceCenterFF;
  return showAdminEmailPref ? (
    <AdminEmailPreferenceSetting />
  ) : (
    <CommonEmailPreferenceSetting />
  );
};
