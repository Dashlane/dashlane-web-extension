import {
  AddUserMessageRequest,
  UserMessageTypes,
} from "@dashlane/communication";
import { CoreServices } from "Services";
import { userMessageAdded } from "UserMessages/Store/actions";
export const addUserMessageHandler = (
  services: CoreServices,
  data: AddUserMessageRequest
): Promise<void> => {
  services.storeService.dispatch(
    userMessageAdded({ type: data.type as UserMessageTypes })
  );
  services.sessionService.getInstance().user.persistLocalSettings();
  return Promise.resolve();
};
