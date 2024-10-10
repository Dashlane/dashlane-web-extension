import { TwoFactorAuthenticationEnableStages } from "@dashlane/communication";
import { CoreServices } from "Services";
import { updateStore } from "Authentication/TwoFactorAuthentication/Flow/Enable/helpers";
import { TwoFactorAuthenticationEnableFlowStoreState } from "Authentication/TwoFactorAuthentication/Flow/Enable/Store";
import { getTwoFactorAuthenticationEnableFlowData } from "Authentication/TwoFactorAuthentication/Flow/Enable/Store/selectors";
export const enableTwoFactorAuthenticationBackupCodesHandler = async (
  coreServices: CoreServices,
  data: TwoFactorAuthenticationEnableFlowStoreState
) => {
  const { storeService } = coreServices;
  const flowData = getTwoFactorAuthenticationEnableFlowData(
    storeService.getState()
  );
  updateStore(coreServices, {
    ...data,
    stage: flowData.logoutRequired
      ? TwoFactorAuthenticationEnableStages.LOGOUT_REQUIRED
      : TwoFactorAuthenticationEnableStages.SUCCESS,
  });
  return { success: true };
};
