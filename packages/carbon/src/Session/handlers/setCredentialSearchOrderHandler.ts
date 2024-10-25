import { CredentialSearchOrderRequest } from "@dashlane/communication";
import { CoreServices } from "Services";
import { credentialSearchOrderUpdated } from "Session/Store/localSettings/actions";
export const setCredentialSearchOrderHandler = (
  services: CoreServices,
  data: CredentialSearchOrderRequest
): Promise<void> => {
  services.storeService.dispatch(credentialSearchOrderUpdated(data.order));
  services.sessionService.getInstance().user.persistLocalSettings();
  return Promise.resolve();
};
