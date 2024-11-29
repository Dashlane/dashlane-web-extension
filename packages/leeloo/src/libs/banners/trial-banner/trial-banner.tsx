import { useB2BTrialBannerConditions } from "../../hooks/use-b2b-trial-banner-conditions";
import { B2BTrialDaysLeftBanner } from "./b2b-days-left-banner";
import { B2CTrialDaysLeftBanner } from "./b2c-days-left-banner";
import { AdminAccess } from "../../../user/permissions";
interface TrialBannerProps {
  adminAccess: AdminAccess;
}
export const TrialBanner = ({ adminAccess }: TrialBannerProps) => {
  const canShowB2BTrialBanner = useB2BTrialBannerConditions(adminAccess);
  return canShowB2BTrialBanner ? (
    <B2BTrialDaysLeftBanner />
  ) : (
    <B2CTrialDaysLeftBanner />
  );
};
