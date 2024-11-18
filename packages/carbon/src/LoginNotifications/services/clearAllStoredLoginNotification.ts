import { ClearAllStoredLoginNotificationResult } from "@dashlane/communication";
import { CoreServices } from "Services";
import { resetAllLoginNotification } from "InMemoryInterSessionUnsyncedSettings/Store/loginNotifications/actions";
export const clearAllStoredLoginNotification = async (
  services: CoreServices
): Promise<ClearAllStoredLoginNotificationResult> => {
  services.storeService.dispatch(resetAllLoginNotification());
  return { success: true };
};
