import { CoreServices } from "Services";
import {
  TwoFactorAuthenticationEnableFlowStoreState,
  updateTwoFactorAuthenticationStage,
} from "Authentication/TwoFactorAuthentication/Flow/Enable/Store";
export const updateStore = (
  { storeService }: CoreServices,
  updateData: TwoFactorAuthenticationEnableFlowStoreState
) => {
  const action = updateTwoFactorAuthenticationStage({
    ...updateData,
  });
  storeService.dispatch(action);
};
