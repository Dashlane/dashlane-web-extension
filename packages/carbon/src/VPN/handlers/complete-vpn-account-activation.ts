import { CoreServices } from "Services";
import { vpnAccountActivationCompleteAction } from "VPN/actions";
export const completeVpnAccountActivationHandler = (
  services: CoreServices
): Promise<void> => {
  services.storeService.dispatch(vpnAccountActivationCompleteAction());
  return Promise.resolve();
};
