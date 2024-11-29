import { Button, UserClickEvent } from "@dashlane/hermes";
import { logEvent } from "../../../libs/logs/logEvent";
const logAddClick = () =>
  logEvent(
    new UserClickEvent({
      button: Button.AddId,
    })
  );
export { logAddClick };
