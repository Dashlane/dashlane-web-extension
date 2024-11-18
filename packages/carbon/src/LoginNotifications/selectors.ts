import { LoginNotification } from "@dashlane/communication";
import { State } from "Store";
export const loginNotificationListSelector = (
  state: State
): LoginNotification[] => state.inMemoryInterSessionUnsynced.loginNotification;
