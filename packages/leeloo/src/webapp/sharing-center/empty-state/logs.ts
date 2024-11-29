import { Button, UserClickEvent } from "@dashlane/hermes";
import { logEvent } from "../../../libs/logs/logEvent";
const logStartSharingClick = () =>
  logEvent(
    new UserClickEvent({
      button: Button.StartSharing,
    })
  );
const logGoToLoginsClick = () =>
  logEvent(
    new UserClickEvent({
      button: Button.GoToLogins,
    })
  );
const logInviteMembersClick = () =>
  logEvent(
    new UserClickEvent({
      button: Button.InviteMembers,
    })
  );
export { logStartSharingClick, logGoToLoginsClick, logInviteMembersClick };
