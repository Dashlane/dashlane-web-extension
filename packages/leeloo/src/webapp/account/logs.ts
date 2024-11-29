import { UserLogoutEvent } from "@dashlane/hermes";
import { logEvent } from "../../libs/logs/logEvent";
export const logLogoutEvent = () => {
  logEvent(new UserLogoutEvent({}));
};
