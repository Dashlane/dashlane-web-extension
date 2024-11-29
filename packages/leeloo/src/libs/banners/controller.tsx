import { DataStatus } from "@dashlane/carbon-api-consumers";
import { InstallExtensionBanner } from "./install-extension-banner/install-extension-banner";
import { TrialBanner } from "./trial-banner/trial-banner";
import { AdminAccess } from "../../user/permissions";
import { useShouldDisplayInstallExtensionBanner } from "./install-extension-banner/hooks/use-should-display-install-extension-banner";
import { useShowB2CFrozenState } from "../hooks/use-b2c-show-frozen-state";
import { B2CFrozenStateBanner } from "./b2c-frozen-banner/b2c-frozen-banner";
interface BannerControllerProps {
  adminAccess: AdminAccess;
}
export const BannerController = ({ adminAccess }: BannerControllerProps) => {
  const shouldDisplayB2CFrozenBannerBanner = useShowB2CFrozenState();
  const shouldDisplayInstallExtensionBanner =
    useShouldDisplayInstallExtensionBanner();
  if (
    !shouldDisplayB2CFrozenBannerBanner.isLoading &&
    shouldDisplayB2CFrozenBannerBanner.showB2CFrozenBanner
  ) {
    return <B2CFrozenStateBanner />;
  }
  if (
    shouldDisplayInstallExtensionBanner.status === DataStatus.Success &&
    shouldDisplayInstallExtensionBanner.shouldDisplay
  ) {
    return <InstallExtensionBanner />;
  }
  return <TrialBanner adminAccess={adminAccess} />;
};
