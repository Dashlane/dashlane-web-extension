import { CoreServices } from "Services";
export { SendTokenStatus } from "Libs/WS/Authentication";
import { premiumChurningDismissDateUpdated } from "Session/Store/localSettings/actions";
export const updatePremiumChurningDismissDateHandler = (
  services: CoreServices
): Promise<void> => {
  const now = new Date();
  services.storeService.dispatch(
    premiumChurningDismissDateUpdated(now.getTime())
  );
  services.sessionService.getInstance().user.persistLocalSettings();
  return Promise.resolve();
};
