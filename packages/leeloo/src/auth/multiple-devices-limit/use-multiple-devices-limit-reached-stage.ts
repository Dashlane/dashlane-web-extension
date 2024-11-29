import { DataStatus } from "@dashlane/carbon-api-consumers";
import { AuthenticationFlowContracts } from "@dashlane/authentication-contracts";
import { useModuleCommands } from "@dashlane/framework-react";
import { carbonConnector } from "../../libs/carbon/connector";
import { usePremiumStatus } from "../../libs/carbon/hooks/usePremiumStatus";
import { openDashlaneUrl } from "../../libs/external-urls";
import { getPlanRenewalPeriodicity } from "../../libs/premium-status.lib";
import { useRouterGlobalSettingsContext } from "../../libs/router/RouterGlobalSettingsProvider";
import {
  UnlinkMultipleDevicesRequest,
  UnlinkMultipleDevicesResult,
} from "@dashlane/communication";
export interface MultipleDevicesLimitReachedStage {
  logOut: () => void;
  unlinkMultipleDevices: (
    devices: UnlinkMultipleDevicesRequest
  ) => Promise<UnlinkMultipleDevicesResult>;
  onHandleGoToPremiumPlan: (subscriptionCode: string) => void;
}
export function useMultipleDevicesLimitReachedStage(): MultipleDevicesLimitReachedStage {
  const premiumStatus = usePremiumStatus();
  const { routes } = useRouterGlobalSettingsContext();
  const { logout } = useModuleCommands(
    AuthenticationFlowContracts.authenticationFlowApi
  );
  const onHandleGoToPremiumPlanFactory = (subscriptionCode: string) => {
    if (premiumStatus.status === DataStatus.Success) {
      const goPremiumUrl = routes.userGoPremium(
        subscriptionCode,
        getPlanRenewalPeriodicity(premiumStatus.data.autoRenewInfo)
      );
      const trackingParams = {
        type: "multipleDevicesLimit",
        action: "goPremium",
      };
      openDashlaneUrl(goPremiumUrl, trackingParams, {
        newTab: false,
      });
    }
  };
  return {
    logOut: () => logout(),
    unlinkMultipleDevices: carbonConnector.unlinkMultipleDevices,
    onHandleGoToPremiumPlan: (subscriptionCode) =>
      onHandleGoToPremiumPlanFactory(subscriptionCode),
  };
}
