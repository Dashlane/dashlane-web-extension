import {
  BrowseComponent,
  CallToAction,
  PageView,
  UserCallToActionEvent,
} from "@dashlane/hermes";
import { logEvent, logPageView } from "../../../../libs/logs/logEvent";
export const sendFeedbackPageView = () => {
  logPageView(PageView.TacAccountSendFeedback, BrowseComponent.Tac);
};
export const logFeedbackSent = () => {
  logEvent(
    new UserCallToActionEvent({
      callToActionList: [CallToAction.SendEmail],
      chosenAction: CallToAction.SendEmail,
      hasChosenNoAction: false,
    })
  );
};
export const logFeedbackModalClosed = () => {
  logEvent(
    new UserCallToActionEvent({
      hasChosenNoAction: true,
    })
  );
};
