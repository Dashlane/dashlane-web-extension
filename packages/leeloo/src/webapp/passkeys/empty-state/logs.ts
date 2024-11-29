import { Button, UserClickEvent } from "@dashlane/hermes";
import { logEvent } from "../../../libs/logs/logEvent";
const logCheckSupportedDevicesClick = () =>
  logEvent(
    new UserClickEvent({
      button: Button.CheckSupportedDevices,
    })
  );
export { logCheckSupportedDevicesClick };
