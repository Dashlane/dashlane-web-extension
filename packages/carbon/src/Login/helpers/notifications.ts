import { LoginNotification } from "@dashlane/communication";
import { CoreServices } from "Services";
import { addNewLoginNotification } from "InMemoryInterSessionUnsyncedSettings/Store/loginNotifications/actions";
export async function addLoginNotification(
  services: CoreServices,
  params: LoginNotification
) {
  const { storeService } = services;
  storeService.dispatch(addNewLoginNotification(params));
}
