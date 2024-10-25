import { CoreServices } from "Services";
import { vpnAccountNotFoundAction } from "VPN/actions";
export const clearVpnAccountErrorsHandler = (
  services: CoreServices
): Promise<void> => {
  services.storeService.dispatch(vpnAccountNotFoundAction());
  return Promise.resolve();
};
