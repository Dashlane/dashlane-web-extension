import {
  Button,
  CallToAction,
  UserCallToActionEvent,
  UserClickEvent,
} from "@dashlane/hermes";
import { logEvent } from "../libs/logs/logEvent";
export const logIDontWantToJoinTeamClick = () => {
  logEvent(
    new UserClickEvent({
      button: Button.CreatePersonalAccount,
    })
  );
};
export const logCreatePersonalAccountClick = () => {
  logEvent(
    new UserCallToActionEvent({
      callToActionList: [
        CallToAction.Cancel,
        CallToAction.CreatePersonalAccount,
      ],
      chosenAction: CallToAction.CreatePersonalAccount,
      hasChosenNoAction: false,
    })
  );
};
export const logCancelClick = () => {
  logEvent(
    new UserCallToActionEvent({
      callToActionList: [
        CallToAction.Cancel,
        CallToAction.CreatePersonalAccount,
      ],
      chosenAction: CallToAction.Cancel,
      hasChosenNoAction: false,
    })
  );
};
export const logNavigateAway = () => {
  logEvent(
    new UserCallToActionEvent({
      callToActionList: [
        CallToAction.Cancel,
        CallToAction.CreatePersonalAccount,
      ],
      hasChosenNoAction: true,
    })
  );
};
