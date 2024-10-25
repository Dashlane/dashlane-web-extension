import { SubscriptionInformation } from "@dashlane/communication";
import { CoreServices } from "Services";
import { refreshSubscriptionInformation } from "Session/PremiumController";
export const refreshSubscriptionInformationHandler = async (
  services: CoreServices
): Promise<SubscriptionInformation> =>
  refreshSubscriptionInformation(
    services.storeService,
    services.storeService.getAccountInfo().login
  );
