import { DismissUserMessagesRequest } from "@dashlane/communication";
import { CoreServices } from "Services";
import { userMessagesDismissed } from "UserMessages/Store/actions";
export const dismissUserMessagesHandler = (
  services: CoreServices,
  data: DismissUserMessagesRequest
): Promise<void> => {
  services.storeService.dispatch(userMessagesDismissed(data));
  services.sessionService.getInstance().user.persistLocalSettings();
  return Promise.resolve();
};
