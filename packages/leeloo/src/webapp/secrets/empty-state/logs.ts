import { Button, UserClickEvent } from "@dashlane/hermes";
import { logEvent } from "../../../libs/logs/logEvent";
const logImportClick = () =>
  logEvent(
    new UserClickEvent({
      button: Button.ImportSecrets,
    })
  );
const logAddClick = () =>
  logEvent(
    new UserClickEvent({
      button: Button.AddSecret,
    })
  );
export { logImportClick, logAddClick };
