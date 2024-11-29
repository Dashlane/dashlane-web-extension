import { Button, UserClickEvent } from "@dashlane/hermes";
import { logEvent } from "../../../libs/logs/logEvent";
const logImportClick = () =>
  logEvent(
    new UserClickEvent({
      button: Button.ImportSecureNotes,
    })
  );
const logAddClick = () =>
  logEvent(
    new UserClickEvent({
      button: Button.AddSecureNote,
    })
  );
export { logImportClick, logAddClick };
