import { Button, UserClickEvent } from "@dashlane/hermes";
import { logEvent } from "../../../libs/logs/logEvent";
const logImportClick = () =>
  logEvent(
    new UserClickEvent({
      button: Button.ImportLogins,
    })
  );
const logAddClick = () =>
  logEvent(
    new UserClickEvent({
      button: Button.AddLogin,
    })
  );
export { logImportClick, logAddClick };
